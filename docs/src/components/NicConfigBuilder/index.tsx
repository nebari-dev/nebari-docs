import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './styles.module.css';

/**
 * NicConfigBuilder is a guided starter for `nebari-config.yaml`. The provider
 * list and each provider's structure (region key, node-group shape, whether a
 * dedicated Longhorn storage pool is expressible) are derived at build time from
 * the same JSON Schema the CLI validates against, for the selected NIC version.
 *
 * The one thing the schema does not carry is region/machine-type *values* (they
 * are free-form strings), so a small curated map supplies suggestions for them;
 * the fields stay editable. The emitted file is a starting point to refine and
 * check with `nic validate`.
 */

const DEFAULT_REPO = 'nebari-dev/nebari-infrastructure-core';
const DEFAULT_REF = 'feat/config-schema-gen-v2';

const schemasBase = (repo: string, ref: string) =>
  `https://raw.githubusercontent.com/${repo}/${ref}/schemas`;

// The only non-schema data: region/instance suggestions and a starter
// kubernetes_version per provider (the schema has none of these as values).
// Providers absent here still work — region/instance become free-text.
type Hint = { label: string; k8s: string; regions: string[]; instances: string[] };

const CURATED_HINTS: Record<string, Hint> = {
  aws: {
    label: 'AWS',
    k8s: '1.34',
    regions: ['us-west-2', 'us-east-1', 'eu-west-1', 'ap-southeast-2'],
    instances: ['m5.large', 'm5.xlarge', 'm5.2xlarge'],
  },
  hetzner: {
    label: 'Hetzner',
    k8s: '1.32',
    regions: ['fsn1', 'nbg1', 'hel1', 'ash', 'hil', 'sin'],
    instances: ['cpx21', 'cpx31', 'cpx41', 'cpx51'],
  },
  gcp: { label: 'GCP', k8s: '1.32', regions: [], instances: [] },
  azure: { label: 'Azure', k8s: '1.32', regions: [], instances: [] },
};

type JSONSchema = {
  type?: string | string[];
  properties?: Record<string, JSONSchema>;
  $defs?: Record<string, JSONSchema>;
};

type Derived = {
  name: string;
  label: string;
  regionKey: 'region' | 'location';
  nodeShape: 'aws' | 'hetzner';
  dedicatedStorage: boolean;
  regions: string[];
  instances: string[];
  k8s: string;
};

// Derive a provider's shape from its schema. Returns null for providers with no
// region/node-groups (existing, local) — not buildable as a greenfield starter.
function deriveProvider(name: string, doc: JSONSchema): Derived | null {
  const defs = doc.$defs ?? {};
  const cfg = Object.entries(defs).find(([k]) => k.endsWith('.Config'))?.[1];
  const props = cfg?.properties ?? {};
  const hasRegion = 'region' in props;
  const hasLocation = 'location' in props;
  if (!hasRegion && !hasLocation) {
    return null;
  }
  const ng = Object.entries(defs).find(([k]) => k.toLowerCase().endsWith('nodegroup'))?.[1];
  const ngProps = ng?.properties ?? {};
  if (Object.keys(ngProps).length === 0) {
    return null;
  }
  const hint = CURATED_HINTS[name];
  return {
    name,
    label: hint?.label ?? name.toUpperCase(),
    regionKey: hasLocation ? 'location' : 'region',
    nodeShape: 'instance_type' in ngProps ? 'hetzner' : 'aws',
    dedicatedStorage: 'longhorn' in props && 'labels' in ngProps && 'taints' in ngProps,
    regions: hint?.regions ?? [],
    instances: hint?.instances ?? [],
    k8s: hint?.k8s ?? '1.32',
  };
}

function useProviders(repo: string, ref: string) {
  const [data, setData] = useState<Derived[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const base = schemasBase(repo, ref);
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const mres = await fetch(`${base}/manifest.json`, {
          headers: { Accept: 'application/json' },
        });
        if (!mres.ok) {
          throw new Error(`Failed to fetch manifest.json: ${mres.status} ${mres.statusText}`);
        }
        const manifest = (await mres.json()) as { providers?: string[] };
        const derived = await Promise.all(
          (manifest.providers ?? []).map(async (name) => {
            const r = await fetch(`${base}/providers/${name}.json`, {
              headers: { Accept: 'application/json' },
            });
            if (!r.ok) {
              return null;
            }
            return deriveProvider(name, (await r.json()) as JSONSchema);
          }),
        );
        if (!cancelled) {
          setData(derived.filter((d): d is Derived => d !== null));
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [repo, ref]);

  return { data, loading, error };
}

type VersionOption = { value: string; label: string };
const PREVIEW_OPTION: VersionOption = { value: DEFAULT_REF, label: `${DEFAULT_REF} (preview)` };

// Upstream release tags, so the builder can target a specific NIC version.
// Non-fatal on failure — the preview option alone drives the builder.
function useVersions(repo: string): VersionOption[] {
  const [tags, setTags] = useState<VersionOption[]>([]);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/tags?per_page=100`, {
          headers: { Accept: 'application/vnd.github+json' },
        });
        if (!res.ok) {
          return;
        }
        const json = (await res.json()) as { name: string }[];
        if (!cancelled) {
          setTags(json.map((t) => ({ value: t.name, label: t.name })));
        }
      } catch {
        /* preview option is enough */
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [repo]);
  return [PREVIEW_OPTION, ...tags];
}

type BuilderState = {
  provider: string;
  projectName: string;
  domain: string;
  region: string;
  kubernetesVersion: string;
  certType: 'letsencrypt' | 'selfsigned';
  acmeEmail: string;
  gitUrl: string;
  gitBranch: string;
  gitPath: string;
  gitAuthMethod: 'token' | 'ssh';
  gitEnvVar: string;
  nodeGroupName: string;
  instance: string;
  minNodes: number;
  maxNodes: number;
  dedicatedStorage: boolean;
  useCloudflare: boolean;
  zoneId: string;
};

const INITIAL_STATE: BuilderState = {
  provider: '',
  projectName: 'my-nebari',
  domain: 'nebari.example.com',
  region: '',
  kubernetesVersion: '',
  certType: 'letsencrypt',
  acmeEmail: 'admin@example.com',
  gitUrl: 'https://github.com/my-org/my-nebari-config.git',
  gitBranch: 'main',
  gitPath: 'clusters/my-nebari',
  gitAuthMethod: 'token',
  gitEnvVar: 'GIT_TOKEN',
  nodeGroupName: 'general',
  instance: '',
  minNodes: 1,
  maxNodes: 5,
  dedicatedStorage: false,
  useCloudflare: true,
  zoneId: '',
};

function buildYaml(s: BuilderState, d: Derived): string {
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

  lines.push('git_repository:');
  lines.push(`  url: ${s.gitUrl || '<repo-url>'}`);
  lines.push(`  branch: ${s.gitBranch || 'main'}`);
  lines.push(`  path: ${s.gitPath || '<path>'}`);
  lines.push('  auth:');
  lines.push(
    `    ${s.gitAuthMethod === 'ssh' ? 'ssh_key_env' : 'token_env'}: ${
      s.gitEnvVar || (s.gitAuthMethod === 'ssh' ? 'GIT_SSH_PRIVATE_KEY' : 'GIT_TOKEN')
    }`,
  );

  const k8s = s.kubernetesVersion || d.k8s;
  const group = s.nodeGroupName || 'general';

  lines.push('cluster:');
  lines.push(`  ${s.provider}:`);

  if (d.nodeShape === 'hetzner') {
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
    const dedicated = s.dedicatedStorage && d.dedicatedStorage;
    lines.push(`    ${d.regionKey}: ${s.region}`);
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

// URL-safe encoding of the builder state, so a link reproduces the exact form a
// user built. Called only in the browser (guarded by callers).
function encodeState(s: BuilderState): string {
  const bytes = new TextEncoder().encode(JSON.stringify(s));
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeState(param: string): Partial<BuilderState> {
  const b64 = param.replace(/-/g, '+').replace(/_/g, '/');
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as Partial<BuilderState>;
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
  const [selectedRef, setSelectedRef] = useState(DEFAULT_REF);
  const versions = useVersions(DEFAULT_REPO);
  const { data: providers, loading, error } = useProviders(DEFAULT_REPO, selectedRef);
  const [state, setState] = useState<BuilderState>(INITIAL_STATE);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const derived = providers?.find((p) => p.name === state.provider) ?? null;
  const isHetzner = derived?.nodeShape === 'hetzner';
  const yaml = useMemo(() => (derived ? buildYaml(state, derived) : ''), [state, derived]);

  // Restore state from a shared link and show the config front-and-centre.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const c = new URLSearchParams(window.location.search).get('c');
    if (!c) {
      return;
    }
    try {
      setState((prev) => ({ ...prev, ...decodeState(c) }));
      setModalOpen(true);
    } catch {
      /* ignore malformed share links */
    }
  }, []);

  // Once providers load, pick a default provider (and its suggested defaults)
  // unless the state already names a valid one (e.g. from a shared link).
  useEffect(() => {
    if (!providers || providers.length === 0) {
      return;
    }
    setState((prev) => {
      if (prev.provider && providers.some((p) => p.name === prev.provider)) {
        return prev;
      }
      const p = providers[0];
      return {
        ...prev,
        provider: p.name,
        region: p.regions[0] ?? prev.region,
        instance: p.instances[0] ?? prev.instance,
        kubernetesVersion: prev.kubernetesVersion || p.k8s,
      };
    });
  }, [providers]);

  useEffect(() => {
    if (!modalOpen) {
      return undefined;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  const shareUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}${window.location.pathname}?c=${encodeState(state)}`;

  const copyLink = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
    } catch {
      /* clipboard unavailable */
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1600);
  };

  const set = <K extends keyof BuilderState>(key: K, value: BuilderState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const changeProvider = (name: string) => {
    const p = providers?.find((x) => x.name === name);
    setState((prev) => ({
      ...prev,
      provider: name,
      region: p?.regions[0] ?? '',
      instance: p?.instances[0] ?? '',
      kubernetesVersion: p?.k8s ?? prev.kubernetesVersion,
    }));
  };

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

  const isPreview = selectedRef === DEFAULT_REF;
  const versionBar = (
    <div className={styles.versionBar}>
      <label className={styles.versionLabel} htmlFor="nic-builder-version">
        NIC version
      </label>
      <select
        id="nic-builder-version"
        className={styles.input}
        value={selectedRef}
        onChange={(e) => setSelectedRef(e.target.value)}
      >
        {versions.map((v) => (
          <option key={v.value} value={v.value}>
            {v.label}
          </option>
        ))}
      </select>
      {isPreview && <span className={styles.previewBadge}>unreleased</span>}
    </div>
  );

  if (loading) {
    return (
      <div className={styles.wrapper}>
        {versionBar}
        <p>Loading providers from the {selectedRef} schema…</p>
      </div>
    );
  }

  if (error || !providers || providers.length === 0) {
    return (
      <div className={styles.wrapper}>
        {versionBar}
        <div className={styles.stub}>
          <div className={styles.stubTitle}>Could not load the schema</div>
          <p>
            No provider schema was found for <code>{selectedRef}</code>. Release tags carry a
            schema only once <code>schemas/</code> ships in that version; pick the preview
            entry, or write the config by hand from the{' '}
            <Link to="/docs/references/config-schema">configuration schema</Link>.
          </p>
        </div>
      </div>
    );
  }

  const providerCards = (
    <div>
      <div className={styles.providerLabel}>Cloud provider</div>
      <div className={styles.providerCards}>
        {providers.map((p) => {
          const active = state.provider === p.name;
          return (
            <button
              key={p.name}
              type="button"
              className={`${styles.providerCard} ${active ? styles.providerCardActive : ''}`}
              onClick={() => changeProvider(p.name)}
            >
              <span className={styles.providerName}>{p.label}</span>
              <span className={styles.providerStatus}>
                {p.regions.length ? 'Suggested values' : 'Free-text values'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!derived) {
    return (
      <div className={styles.wrapper}>
        {versionBar}
        {providerCards}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {versionBar}
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

          <Section label="Git repository">
            <p className={styles.sectionNote}>
              NIC pushes rendered manifests to this GitOps repo; foundational services sync
              from it. Credentials are read from an environment variable at deploy time.
            </p>
            <LabeledField label="Repository URL" schemaKey="git_repository.url" required>
              <input
                className={styles.input}
                value={state.gitUrl}
                onChange={(e) => set('gitUrl', e.target.value)}
              />
            </LabeledField>
            <div className={styles.grid2} style={{ marginTop: '16px' }}>
              <LabeledField label="Branch" schemaKey="git_repository.branch" required>
                <input
                  className={styles.input}
                  value={state.gitBranch}
                  onChange={(e) => set('gitBranch', e.target.value)}
                />
              </LabeledField>
              <LabeledField label="Path" schemaKey="git_repository.path" required>
                <input
                  className={styles.input}
                  value={state.gitPath}
                  onChange={(e) => set('gitPath', e.target.value)}
                />
              </LabeledField>
              <LabeledField label="Auth method" schemaKey="git_repository.auth">
                <select
                  className={styles.input}
                  value={state.gitAuthMethod}
                  onChange={(e) => {
                    const m = e.target.value as BuilderState['gitAuthMethod'];
                    setState((prev) => ({
                      ...prev,
                      gitAuthMethod: m,
                      gitEnvVar: m === 'ssh' ? 'GIT_SSH_PRIVATE_KEY' : 'GIT_TOKEN',
                    }));
                  }}
                >
                  <option value="token">token (HTTPS)</option>
                  <option value="ssh">ssh key</option>
                </select>
              </LabeledField>
              <LabeledField
                label={state.gitAuthMethod === 'ssh' ? 'SSH key env var' : 'Token env var'}
                schemaKey={`git_repository.auth.${
                  state.gitAuthMethod === 'ssh' ? 'ssh_key_env' : 'token_env'
                }`}
                required
              >
                <input
                  className={styles.input}
                  value={state.gitEnvVar}
                  onChange={(e) => set('gitEnvVar', e.target.value)}
                />
              </LabeledField>
            </div>
          </Section>

          <Section label="Cluster">
            <div className={styles.grid2}>
              <LabeledField
                label={isHetzner ? 'Location' : 'Region'}
                schemaKey={`cluster.${state.provider}.${derived.regionKey}`}
                required
              >
                <input
                  className={styles.input}
                  list={`regions-${derived.name}`}
                  value={state.region}
                  onChange={(e) => set('region', e.target.value)}
                />
                <datalist id={`regions-${derived.name}`}>
                  {derived.regions.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
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
                <input
                  className={styles.input}
                  placeholder={derived.instances[0] ?? (isHetzner ? 'e.g. cpx31' : 'e.g. m5.xlarge')}
                  value={state.instance}
                  onChange={(e) => set('instance', e.target.value)}
                />
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
              {derived.dedicatedStorage && (
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
            <button type="button" className={styles.btn} onClick={() => setModalOpen(true)}>
              Share
            </button>
            <button type="button" className={styles.btn} onClick={download}>
              Download
            </button>
          </div>
          <CodeBlock language="yaml">{yaml}</CodeBlock>
        </div>
      </div>

      {modalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
        <div className={styles.overlay} onClick={() => setModalOpen(false)}>
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label="Generated configuration"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.dialogHead}>
              <span className={styles.outputTitle}>nebari-config.yaml</span>
              <span className={styles.spacer} />
              <button type="button" className={styles.btn} onClick={download}>
                Download
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className={styles.dialogBody}>
              <CodeBlock language="yaml">{yaml}</CodeBlock>
            </div>
            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>Share link</span>
              <input
                className={styles.input}
                readOnly
                value={shareUrl}
                onFocus={(e) => e.target.select()}
              />
              <button type="button" className={styles.btn} onClick={copyLink}>
                {copiedLink ? 'Copied' : 'Copy link'}
              </button>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </div>
  );
}
