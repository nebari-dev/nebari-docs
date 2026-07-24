import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import React, { useMemo, useState } from 'react';

import styles from './styles.module.css';

/**
 * NicConfigBuilder is a guided starter for `nebari-config.yaml`. It asks for a
 * cloud provider, a DNS provider, and a handful of always-required fields, then
 * emits a minimal but valid-shaped config to copy. It is intentionally curated
 * rather than schema-driven: the full field set lives in the
 * [Configuration schema](/references/config-schema) reference, and the emitted
 * file is a starting point to refine and check with `nic validate`.
 */

type ProviderKey = 'aws' | 'gcp' | 'azure' | 'hetzner';

type ProviderMeta = {
  label: string;
  // `stub: true` means the cloud is supported by NIC but not yet wired into this
  // builder; its tab shows a hand-off notice instead of a form. To enable a
  // provider, drop `stub` and fill regionLabel/regions/instances with values
  // confirmed against the schema (do not guess).
  stub?: boolean;
  regionLabel?: string;
  regions?: string[];
  instances?: string[];
};

const PROVIDERS: Record<ProviderKey, ProviderMeta> = {
  aws: {
    label: 'AWS',
    regionLabel: 'region',
    regions: ['us-west-2', 'us-east-1', 'eu-west-1', 'ap-southeast-2'],
    instances: ['m5.large', 'm5.xlarge', 'm5.2xlarge'],
  },
  gcp: { label: 'GCP', stub: true },
  azure: { label: 'Azure', stub: true },
  hetzner: { label: 'Hetzner', stub: true },
};

type BuilderState = {
  provider: ProviderKey;
  projectName: string;
  domain: string;
  region: string;
  certType: 'lets-encrypt' | 'self-signed';
  acmeEmail: string;
  nodeGroupName: string;
  instance: string;
  minNodes: number;
  maxNodes: number;
  useCloudflare: boolean;
  zoneId: string;
};

const initialFor = (provider: ProviderKey): BuilderState => ({
  provider,
  projectName: 'my-nebari',
  domain: 'nebari.example.com',
  region: PROVIDERS[provider].regions?.[0] ?? '',
  certType: 'lets-encrypt',
  acmeEmail: 'admin@example.com',
  nodeGroupName: 'general',
  instance: PROVIDERS[provider].instances?.[0] ?? '',
  minNodes: 1,
  maxNodes: 5,
  useCloudflare: true,
  zoneId: '',
});

function buildYaml(s: BuilderState): string {
  const meta = PROVIDERS[s.provider];
  const lines: string[] = [];

  lines.push(`project_name: ${s.projectName || 'my-nebari'}`);
  lines.push(`domain: ${s.domain || 'nebari.example.com'}`);

  lines.push('certificate:');
  if (s.certType === 'lets-encrypt') {
    lines.push('  type: lets-encrypt');
    lines.push('  acme:');
    lines.push(`    email: ${s.acmeEmail || 'admin@example.com'}`);
  } else {
    lines.push('  type: self-signed');
  }

  lines.push('cluster:');
  lines.push(`  ${s.provider}:`);
  lines.push(`    ${meta.regionLabel}: ${s.region}`);
  lines.push('    node_groups:');
  lines.push(`      ${s.nodeGroupName || 'general'}:`);
  lines.push(`        instance: ${s.instance}`);
  lines.push(`        min_nodes: ${s.minNodes}`);
  lines.push(`        max_nodes: ${s.maxNodes}`);

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

  const set = <K extends keyof BuilderState>(key: K, value: BuilderState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  // Switching provider resets the region/instance to that provider's defaults.
  const changeProvider = (provider: ProviderKey) =>
    setState((prev) => ({
      ...prev,
      provider,
      region: PROVIDERS[provider].regions?.[0] ?? '',
      instance: PROVIDERS[provider].instances?.[0] ?? '',
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
            <span className={styles.label}>certificate.type</span>
            <select
              className={styles.input}
              value={state.certType}
              onChange={(e) => set('certType', e.target.value as BuilderState['certType'])}
            >
              <option value="lets-encrypt">lets-encrypt</option>
              <option value="self-signed">self-signed</option>
            </select>
          </label>
        </div>

        {state.certType === 'lets-encrypt' && (
          <label className={styles.field}>
            <span className={styles.label}>certificate.acme.email</span>
            <input
              className={styles.input}
              value={state.acmeEmail}
              onChange={(e) => set('acmeEmail', e.target.value)}
            />
          </label>
        )}

        <fieldset className={styles.group}>
          <legend className={styles.legend}>Default node group</legend>
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
              <span className={styles.label}>instance</span>
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
        </fieldset>

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
