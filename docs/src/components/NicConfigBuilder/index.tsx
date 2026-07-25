import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import React, { useMemo, useState } from 'react';

import styles from './styles.module.css';

/**
 * NicConfigBuilder is a guided starter for `nebari-config.yaml`. It asks for a
 * cloud provider, a DNS provider, and a handful of always-required fields, then
 * emits a minimal but valid-shaped config to copy. It is intentionally curated
 * rather than schema-driven: the full field set lives in the
 * [Configuration schema](/docs/references/config-schema) reference, and the
 * emitted file is a starting point to refine and check with `nic validate`.
 */

type ProviderKey = 'aws' | 'gcp' | 'azure' | 'hetzner';

type ProviderMeta = {
  label: string;
  // `stub: true` means the cloud is supported by NIC but not yet wired into this
  // builder; its tab shows a hand-off notice instead of a form. To enable a
  // provider, drop `stub` and fill the fields below with values confirmed
  // against the schema (do not guess).
  stub?: boolean;
  regionLabel?: string;
  regions?: string[];
  instances?: string[];
  // Node-group shape the provider's schema expects: 'aws' uses
  // instance/min_nodes/max_nodes; 'hetzner' uses instance_type/count and needs a
  // master group. kubernetes_version is required by every provider's schema.
  nodeShape?: 'aws' | 'hetzner';
  kubernetesVersion?: string;
  // Whether the provider can express a dedicated Longhorn storage node group.
  // Requires per-node-group labels/taints, which the Hetzner schema lacks.
  dedicatedStorage?: boolean;
};

const PROVIDERS: Record<ProviderKey, ProviderMeta> = {
  aws: {
    label: 'AWS',
    regionLabel: 'region',
    regions: ['us-west-2', 'us-east-1', 'eu-west-1', 'ap-southeast-2'],
    instances: ['m5.large', 'm5.xlarge', 'm5.2xlarge'],
    nodeShape: 'aws',
    kubernetesVersion: '1.34',
    dedicatedStorage: true,
  },
  gcp: { label: 'GCP', stub: true },
  azure: { label: 'Azure', stub: true },
  hetzner: {
    label: 'Hetzner',
    regionLabel: 'location',
    regions: ['fsn1', 'nbg1', 'hel1', 'ash', 'hil', 'sin'],
    instances: ['cpx21', 'cpx31', 'cpx41', 'cpx51'],
    nodeShape: 'hetzner',
    kubernetesVersion: '1.32',
  },
};

type BuilderState = {
  provider: ProviderKey;
  projectName: string;
  domain: string;
  region: string;
  kubernetesVersion: string;
  certType: 'letsencrypt' | 'selfsigned';
  acmeEmail: string;
  nodeGroupName: string;
  instance: string;
  minNodes: number;
  maxNodes: number;
  dedicatedStorage: boolean;
  useCloudflare: boolean;
  zoneId: string;
};

const initialFor = (provider: ProviderKey): BuilderState => ({
  provider,
  projectName: 'my-nebari',
  domain: 'nebari.example.com',
  region: PROVIDERS[provider].regions?.[0] ?? '',
  kubernetesVersion: PROVIDERS[provider].kubernetesVersion ?? '',
  certType: 'letsencrypt',
  acmeEmail: 'admin@example.com',
  nodeGroupName: 'general',
  instance: PROVIDERS[provider].instances?.[0] ?? '',
  minNodes: 1,
  maxNodes: 5,
  dedicatedStorage: false,
  useCloudflare: true,
  zoneId: '',
});

function buildYaml(s: BuilderState): string {
  const meta = PROVIDERS[s.provider];
  const lines: string[] = [];

  lines.push(`project_name: ${s.projectName || 'my-nebari'}`);
  lines.push(`domain: ${s.domain || 'nebari.example.com'}`);

  lines.push('certificate:');
  if (s.certType === 'letsencrypt') {
    lines.push('  type: letsencrypt');
    lines.push('  acme:');
    lines.push(`    email: ${s.acmeEmail || 'admin@example.com'}`);
  } else {
    lines.push('  type: selfsigned');
  }

  const k8s = s.kubernetesVersion || meta.kubernetesVersion || '';
  const group = s.nodeGroupName || 'general';

  lines.push('cluster:');
  lines.push(`  ${s.provider}:`);

  if (meta.nodeShape === 'hetzner') {
    // Hetzner (k3s) needs exactly one master node group; the builder adds it and
    // treats the named group as workers. Node groups use instance_type/count.
    const workers = group === 'master' ? 'workers' : group;
    lines.push(`    location: ${s.region}`);
    lines.push(`    kubernetes_version: "${k8s}"`);
    lines.push('    node_groups:');
    lines.push('      master:');
    lines.push(`        instance_type: ${s.instance}`);
    lines.push('        count: 1');
    lines.push('        master: true');
    lines.push(`      ${workers}:`);
    lines.push(`        instance_type: ${s.instance}`);
    lines.push(`        count: ${s.maxNodes}`);
  } else {
    const dedicated = s.dedicatedStorage && meta.dedicatedStorage;
    lines.push(`    region: ${s.region}`);
    lines.push(`    kubernetes_version: "${k8s}"`);
    lines.push('    node_groups:');
    lines.push(`      ${group}:`);
    lines.push(`        instance: ${s.instance}`);
    lines.push(`        min_nodes: ${s.minNodes}`);
    lines.push(`        max_nodes: ${s.maxNodes}`);
    if (dedicated) {
      // A dedicated, tainted storage pool. The label is Longhorn's default
      // node_selector; the taint keeps other workloads off. Longhorn confines
      // replica disks to nodes carrying this label.
      lines.push('      storage:');
      lines.push(`        instance: ${s.instance}`);
      lines.push('        min_nodes: 1');
      lines.push('        max_nodes: 1');
      lines.push('        labels:');
      lines.push('          node.longhorn.io/storage: "true"');
      lines.push('        taints:');
      lines.push('          - key: node.longhorn.io/storage');
      lines.push('            value: "true"');
      lines.push('            effect: NO_SCHEDULE');
      lines.push('    longhorn:');
      lines.push('      dedicated_nodes: true');
    }
  }

  if (s.useCloudflare) {
    lines.push('dns:');
    lines.push('  cloudflare:');
    lines.push(`    zone_id: ${s.zoneId || '<your-cloudflare-zone-id>'}`);
  }

  return `${lines.join('\n')}\n`;
}

// A labelled control: human label + the schema key it maps to, above the input.
function LabeledField({
  label,
  schemaKey,
  required,
  children,
}: {
  label: string;
  schemaKey: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabelRow}>
        <label className={styles.fieldLabel}>
          {label}
          {required && <span className={styles.req}>*</span>}
        </label>
        <span className={styles.fieldKey}>{schemaKey}</span>
      </div>
      {children}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className={styles.sectionHead}>
        <span className={styles.sectionLabel}>{label}</span>
        <span className={styles.rule} />
      </div>
      {children}
    </div>
  );
}

export default function NicConfigBuilder(): JSX.Element {
  const [state, setState] = useState<BuilderState>(() => initialFor('aws'));
  const meta = PROVIDERS[state.provider];
  const yaml = useMemo(() => buildYaml(state), [state]);
  const isHetzner = meta.nodeShape === 'hetzner';

  const set = <K extends keyof BuilderState>(key: K, value: BuilderState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  // Switching provider resets the per-provider defaults (region, instance,
  // kubernetes_version) to that provider's values.
  const changeProvider = (provider: ProviderKey) =>
    setState((prev) => ({
      ...prev,
      provider,
      region: PROVIDERS[provider].regions?.[0] ?? '',
      instance: PROVIDERS[provider].instances?.[0] ?? '',
      kubernetesVersion: PROVIDERS[provider].kubernetesVersion ?? '',
    }));

  const download = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nebari-config.yaml';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const providerCards = (
    <div>
      <div className={styles.providerLabel}>Cloud provider</div>
      <div className={styles.providerCards}>
        {(Object.keys(PROVIDERS) as ProviderKey[]).map((key) => {
          const p = PROVIDERS[key];
          const active = state.provider === key;
          return (
            <button
              key={key}
              type="button"
              className={`${styles.providerCard} ${active ? styles.providerCardActive : ''} ${
                p.stub ? styles.providerCardStub : ''
              }`}
              onClick={() => changeProvider(key)}
            >
              <span className={styles.providerName}>{p.label}</span>
              <span className={styles.providerStatus}>{p.stub ? 'Not wired yet' : 'Ready'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // A supported cloud that this builder does not yet cover: hand the reader off
  // to the schema reference rather than emitting a half-guessed config.
  if (meta.stub) {
    return (
      <div className={styles.wrapper}>
        {providerCards}
        <div className={styles.stub}>
          <div className={styles.stubTitle}>Not wired into this builder yet</div>
          <p>
            NIC supports {meta.label}, but its regions and machine types are not confirmed
            against the schema, so the builder will not guess them.
          </p>
          <Link className={styles.stubLink} to="/docs/references/config-schema">
            Write it from the schema →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.builder}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {providerCards}
          <Section label="Deployment">
            <div className={styles.grid2}>
              <LabeledField label="Project name" schemaKey="project_name" required>
                <input
                  className={styles.input}
                  value={state.projectName}
                  onChange={(e) => set('projectName', e.target.value)}
                />
              </LabeledField>
              <LabeledField label="Domain" schemaKey="domain">
                <input
                  className={styles.input}
                  value={state.domain}
                  onChange={(e) => set('domain', e.target.value)}
                />
              </LabeledField>
              <LabeledField label="Certificate" schemaKey="certificate.type">
                <select
                  className={styles.input}
                  value={state.certType}
                  onChange={(e) => set('certType', e.target.value as BuilderState['certType'])}
                >
                  <option value="letsencrypt">letsencrypt</option>
                  <option value="selfsigned">selfsigned</option>
                </select>
              </LabeledField>
              {state.certType === 'letsencrypt' && (
                <LabeledField label="ACME email" schemaKey="certificate.acme.email">
                  <input
                    className={styles.input}
                    value={state.acmeEmail}
                    onChange={(e) => set('acmeEmail', e.target.value)}
                  />
                </LabeledField>
              )}
            </div>
          </Section>

          <Section label="Cluster">
            <div className={styles.grid2}>
              <LabeledField
                label={isHetzner ? 'Location' : 'Region'}
                schemaKey={`cluster.${state.provider}.${meta.regionLabel ?? 'region'}`}
                required
              >
                <select
                  className={styles.input}
                  value={state.region}
                  onChange={(e) => set('region', e.target.value)}
                >
                  {(meta.regions ?? []).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </LabeledField>
              <LabeledField label="Kubernetes version" schemaKey="kubernetes_version" required>
                <input
                  className={styles.input}
                  value={state.kubernetesVersion}
                  onChange={(e) => set('kubernetesVersion', e.target.value)}
                />
              </LabeledField>
            </div>
          </Section>

          <Section label="Node group">
            <p className={styles.sectionNote}>
              The pool your workloads land on. Add more later in the config file.
              {isHetzner && ' Hetzner (k3s) also needs a master group, which the builder adds automatically.'}
            </p>
            <div className={isHetzner ? styles.gridNodeHetzner : styles.gridNode}>
              <LabeledField label="Name" schemaKey="key">
                <input
                  className={styles.input}
                  value={state.nodeGroupName}
                  onChange={(e) => set('nodeGroupName', e.target.value)}
                />
              </LabeledField>
              <LabeledField
                label="Instance"
                schemaKey={isHetzner ? 'instance_type' : 'instance'}
                required
              >
                <select
                  className={styles.input}
                  value={state.instance}
                  onChange={(e) => set('instance', e.target.value)}
                >
                  {(meta.instances ?? []).map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </LabeledField>
              {isHetzner ? (
                <LabeledField label="Count" schemaKey="count" required>
                  <input
                    className={styles.input}
                    type="number"
                    min={1}
                    value={state.maxNodes}
                    onChange={(e) => set('maxNodes', Number(e.target.value))}
                  />
                </LabeledField>
              ) : (
                <>
                  <LabeledField label="Min" schemaKey="min_nodes">
                    <input
                      className={styles.input}
                      type="number"
                      min={0}
                      value={state.minNodes}
                      onChange={(e) => set('minNodes', Number(e.target.value))}
                    />
                  </LabeledField>
                  <LabeledField label="Max" schemaKey="max_nodes">
                    <input
                      className={styles.input}
                      type="number"
                      min={1}
                      value={state.maxNodes}
                      onChange={(e) => set('maxNodes', Number(e.target.value))}
                    />
                  </LabeledField>
                </>
              )}
            </div>
          </Section>

          <Section label="Options">
            <div className={styles.options}>
              {meta.dedicatedStorage && (
                <label className={styles.option}>
                  <input
                    type="checkbox"
                    checked={state.dedicatedStorage}
                    onChange={(e) => set('dedicatedStorage', e.target.checked)}
                  />
                  <span>
                    <span className={styles.optionTitle}>Dedicated storage nodes for Longhorn</span>
                    <span className={styles.optionDesc}>
                      Adds a tainted <code>storage</code> node group so replica disks stay off
                      your workload nodes. Changing this on a live cluster is a manual migration.
                    </span>
                  </span>
                </label>
              )}
              <label className={styles.option}>
                <input
                  type="checkbox"
                  checked={state.useCloudflare}
                  onChange={(e) => set('useCloudflare', e.target.checked)}
                />
                <span>
                  <span className={styles.optionTitle}>Let Nebari manage DNS with Cloudflare</span>
                  <span className={styles.optionDesc}>
                    Your API token comes from the environment at deploy time; only the zone id
                    goes in this file.
                  </span>
                </span>
              </label>
              {state.useCloudflare && (
                <div className={styles.zoneWrap}>
                  <LabeledField label="Zone id" schemaKey="dns.cloudflare.zone_id" required>
                    <input
                      className={styles.input}
                      placeholder="<your-cloudflare-zone-id>"
                      value={state.zoneId}
                      onChange={(e) => set('zoneId', e.target.value)}
                    />
                  </LabeledField>
                </div>
              )}
            </div>
          </Section>
        </form>

        <div className={styles.output}>
          <div className={styles.outputHead}>
            <span className={styles.outputTitle}>nebari-config.yaml</span>
            <span className={styles.spacer} />
            <button type="button" className={styles.btn} onClick={download}>
              Download
            </button>
          </div>
          <CodeBlock language="yaml">{yaml}</CodeBlock>
        </div>
      </div>
    </div>
  );
}
