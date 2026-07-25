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

  const providerSelector = (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>Cloud provider</legend>
      <div className={styles.pills}>
        {(Object.keys(PROVIDERS) as ProviderKey[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`${styles.pill} ${state.provider === key ? styles.pillActive : ''}`}
            onClick={() => changeProvider(key)}
          >
            {PROVIDERS[key].label}
          </button>
        ))}
      </div>
    </fieldset>
  );

  // A supported cloud that this builder does not yet cover: hand the reader off
  // to the schema reference rather than emitting a half-guessed config.
  if (meta.stub) {
    return (
      <div className={styles.wrapper}>
        {providerSelector}
        <div className={styles.stub}>
          <p>
            Nebari supports {meta.label}, but it is not yet wired into this UI. Write the
            YAML by hand using the{' '}
            <Link to="/docs/references/config-schema">configuration schema</Link> for the
            full set of fields.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {providerSelector}
      <div className={styles.builder}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>project_name</span>
              <input
                className={styles.input}
                value={state.projectName}
                onChange={(e) => set('projectName', e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>domain</span>
              <input
                className={styles.input}
                value={state.domain}
                onChange={(e) => set('domain', e.target.value)}
              />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>
                cluster.{state.provider}.{meta.regionLabel ?? 'region'}
              </span>
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
            </label>
            <label className={styles.field}>
              <span className={styles.label}>cluster.{state.provider}.kubernetes_version</span>
              <input
                className={styles.input}
                value={state.kubernetesVersion}
                onChange={(e) => set('kubernetesVersion', e.target.value)}
              />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>certificate.type</span>
              <select
                className={styles.input}
                value={state.certType}
                onChange={(e) => set('certType', e.target.value as BuilderState['certType'])}
              >
                <option value="letsencrypt">letsencrypt</option>
                <option value="selfsigned">selfsigned</option>
              </select>
            </label>
            {state.certType === 'letsencrypt' && (
              <label className={styles.field}>
                <span className={styles.label}>certificate.acme.email</span>
                <input
                  className={styles.input}
                  value={state.acmeEmail}
                  onChange={(e) => set('acmeEmail', e.target.value)}
                />
              </label>
            )}
          </div>

          <fieldset className={styles.group}>
            <legend className={styles.legend}>Node group</legend>
            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>name</span>
                <input
                  className={styles.input}
                  value={state.nodeGroupName}
                  onChange={(e) => set('nodeGroupName', e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{isHetzner ? 'instance_type' : 'instance'}</span>
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
              </label>
            </div>
            {isHetzner ? (
              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>count</span>
                  <input
                    className={styles.input}
                    type="number"
                    min={1}
                    value={state.maxNodes}
                    onChange={(e) => set('maxNodes', Number(e.target.value))}
                  />
                </label>
              </div>
            ) : (
              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>min_nodes</span>
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    value={state.minNodes}
                    onChange={(e) => set('minNodes', Number(e.target.value))}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>max_nodes</span>
                  <input
                    className={styles.input}
                    type="number"
                    min={1}
                    value={state.maxNodes}
                    onChange={(e) => set('maxNodes', Number(e.target.value))}
                  />
                </label>
              </div>
            )}
            {isHetzner && (
              <p className={styles.hint}>
                Hetzner (k3s) needs a master node group; the builder adds one automatically
                alongside this worker group.
              </p>
            )}
          </fieldset>

          {meta.dedicatedStorage && (
            <fieldset className={styles.group}>
              <legend className={styles.legend}>Longhorn storage</legend>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={state.dedicatedStorage}
                  onChange={(e) => set('dedicatedStorage', e.target.checked)}
                />
                <span>Dedicated storage node group</span>
              </label>
              <p className={styles.hint}>
                Adds a tainted <code>storage</code> node group and sets{' '}
                <code>longhorn.dedicated_nodes</code>, confining Longhorn replicas to it. On
                an existing cluster this is a manual migration; see the{' '}
                <Link to="/docs/references/config-schema">configuration schema</Link>.
              </p>
            </fieldset>
          )}

          <fieldset className={styles.group}>
            <legend className={styles.legend}>DNS</legend>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={state.useCloudflare}
                onChange={(e) => set('useCloudflare', e.target.checked)}
              />
              <span>Manage DNS with Cloudflare</span>
            </label>
            {state.useCloudflare && (
              <label className={styles.field}>
                <span className={styles.label}>dns.cloudflare.zone_id</span>
                <input
                  className={styles.input}
                  placeholder="<your-cloudflare-zone-id>"
                  value={state.zoneId}
                  onChange={(e) => set('zoneId', e.target.value)}
                />
              </label>
            )}
          </fieldset>
        </form>

        <div className={styles.output}>
          <div className={styles.outputHead}>
            <span className={styles.outputTitle}>nebari-config.yaml</span>
            <span className={styles.starterBadge}>starter</span>
          </div>
          <CodeBlock language="yaml" title="nebari-config.yaml">
            {yaml}
          </CodeBlock>
        </div>
      </div>
    </div>
  );
}
