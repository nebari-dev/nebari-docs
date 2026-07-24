import Admonition from '@theme/Admonition';
import CodeBlock from '@theme/CodeBlock';
import Details from '@theme/Details';
import Heading from '@theme/Heading';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import styles from './styles.module.css';

/**
 * NicSchemaLoader renders the Nebari Infrastructure Core (NIC) configuration
 * reference directly from the JSON Schema that `nebari-infrastructure-core`
 * generates from its Go config structs (`schemas/`, produced by `make
 * schemas`). Because the schema is generated from the source of truth, this
 * page cannot drift from the config the CLI actually accepts.
 *
 * Producer contract (schemas/manifest.json):
 *   { "providers": [...], "dns": [...], "top_level": "nebari-config.json" }
 * Each referenced file is a self-contained JSON Schema whose root `$ref`
 * points into its own `$defs` (e.g. `#/$defs/aws.Config`).
 */

type JSONSchema = {
  type?: string | string[];
  title?: string;
  description?: string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  items?: JSONSchema;
  enum?: unknown[];
  default?: unknown;
  examples?: unknown[];
  pattern?: string;
  additionalProperties?: boolean | JSONSchema;
  $ref?: string;
};

type Manifest = {
  providers: string[];
  dns: string[];
  top_level: string;
};

type LoadedSchemas = {
  topLevel: JSONSchema;
  cluster: { name: string; schema: JSONSchema }[];
  dns: { name: string; schema: JSONSchema }[];
};

// Source of truth. Once the schema-generation pipeline
// (nebari-infrastructure-core#362) lands on a tagged release, the release tags
// below become selectable; until then this preview entry tracks the branch.
const DEFAULT_REPO = 'nebari-dev/nebari-infrastructure-core';
const DEFAULT_REF = 'feat/config-schema-gen';

const schemasBase = (repo: string, ref: string) =>
  `https://raw.githubusercontent.com/${repo}/${ref}/schemas`;

const slug = (name: string) => name.replace(/[_.]/g, '-').toLowerCase();

// Field id from the full config path, so ids are unique across providers
// (a bare `enabled` occurs in five different `$defs`).
const pathId = (path: string[]) => path.map(slug).join('-');

const refKey = (ref: string) => ref.replace('#/$defs/', '');

/**
 * Inline every internal `#/$defs/...` reference against the file's own `$defs`
 * map. The generated schemas use recursive same-file pointer refs that generic
 * `$ref` resolvers leave untouched. `seen` guards against cycles.
 */
function deref(
  node: JSONSchema,
  defs: Record<string, JSONSchema>,
  seen: Set<string>,
): JSONSchema {
  if (node === null || typeof node !== 'object') {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((n) => deref(n, defs, seen)) as unknown as JSONSchema;
  }
  if (typeof node.$ref === 'string') {
    const key = refKey(node.$ref);
    if (seen.has(key) || !defs[key]) {
      return { type: 'object', description: node.description };
    }
    const target = deref(defs[key], defs, new Set(seen).add(key));
    return node.description && !target.description
      ? { ...target, description: node.description }
      : target;
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === '$defs') {
      continue;
    }
    out[k] = deref(v as JSONSchema, defs, seen);
  }
  return out as JSONSchema;
}

async function loadSchemaFile(base: string, path: string): Promise<JSONSchema> {
  const res = await fetch(`${base}/${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
  }
  const doc = (await res.json()) as JSONSchema & { $defs?: Record<string, JSONSchema> };
  const defs = doc.$defs ?? {};
  const entryKey = typeof doc.$ref === 'string' ? refKey(doc.$ref) : null;
  const entry = entryKey && defs[entryKey] ? defs[entryKey] : doc;
  return deref(entry, defs, new Set(entryKey ? [entryKey] : []));
}

function useNicSchemas(repo: string, ref: string) {
  const [data, setData] = useState<LoadedSchemas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const base = schemasBase(repo, ref);
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const manifestRes = await fetch(`${base}/manifest.json`, {
          headers: { Accept: 'application/json' },
        });
        if (!manifestRes.ok) {
          throw new Error(
            `Failed to fetch manifest.json: ${manifestRes.status} ${manifestRes.statusText}`,
          );
        }
        const manifest: Manifest = await manifestRes.json();

        const [topLevel, cluster, dns] = await Promise.all([
          loadSchemaFile(base, manifest.top_level),
          Promise.all(
            manifest.providers.map(async (name) => ({
              name,
              schema: await loadSchemaFile(base, `providers/${name}.json`),
            })),
          ),
          Promise.all(
            manifest.dns.map(async (name) => ({
              name,
              schema: await loadSchemaFile(base, `providers/${name}.json`),
            })),
          ),
        ]);

        if (!cancelled) {
          setData({ topLevel, cluster, dns });
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

const PREVIEW_OPTION: VersionOption = {
  value: DEFAULT_REF,
  label: `${DEFAULT_REF} (preview)`,
};

// Fetch upstream release tags so a reader can view the schema for a specific
// NIC version. Non-fatal on failure - the preview option alone renders the
// page. (Follow-up: replace with a committed schema-versions.json published by
// the NIC release workflow, so the toggle only lists versions that actually
// ship schemas/.)
function useVersions(repo: string): VersionOption[] {
  const [tags, setTags] = useState<VersionOption[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${repo}/tags?per_page=100`,
          { headers: { Accept: 'application/vnd.github+json' } },
        );
        if (!res.ok) {
          return;
        }
        const json: { name: string }[] = await res.json();
        if (!cancelled) {
          setTags(json.map((t) => ({ value: t.name, label: t.name })));
        }
      } catch {
        /* leave tags empty; the preview option is enough */
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [repo]);

  return [PREVIEW_OPTION, ...tags];
}

// A map type is an object with no fixed properties whose value shape is an
// `additionalProperties` schema (Go `map[string]T`).
function mapValueSchema(schema: JSONSchema): JSONSchema | null {
  if (
    schema.type === 'object' &&
    !schema.properties &&
    schema.additionalProperties &&
    typeof schema.additionalProperties === 'object'
  ) {
    return schema.additionalProperties;
  }
  return null;
}

function typeLabel(schema: JSONSchema): string {
  if (schema.enum) {
    return 'enum';
  }
  if (schema.type === 'array') {
    const it = schema.items;
    const itType = it
      ? Array.isArray(it.type)
        ? it.type.join(' | ')
        : it.type ?? (it.properties ? 'object' : 'any')
      : 'any';
    return `array<${itType}>`;
  }
  const mapValue = mapValueSchema(schema);
  if (mapValue) {
    return `map<${typeLabel(mapValue)}>`;
  }
  if (Array.isArray(schema.type)) {
    return schema.type.join(' | ');
  }
  return schema.type ?? (schema.properties ? 'object' : 'any');
}

// invopop emits godoc verbatim, which repeats the field name in Go casing
// ("Email is the email address..."). Strip that lead-in so the description
// reads as prose. Purely cosmetic; leaves the description intact if it does not
// match the pattern.
function cleanDescription(desc: string): string {
  const stripped = desc.replace(
    /^[A-Z][A-Za-z0-9]* (is|are|holds|controls|specifies|represents|configures|defines|sets|enables|contains|determines|provides|indicates) /,
    '',
  );
  if (stripped === desc) {
    return desc;
  }
  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

// Turn `owner/repo#N` references (which sometimes leak from internal godoc)
// into links rather than rendering bare implementation noise.
const issueRefLink = {
  text: ({ children }: { children: React.ReactNode }) => {
    const parts = React.Children.toArray(children).map((child) => {
      if (typeof child !== 'string') {
        return child;
      }
      return child.split(/(\b[\w-]+\/[\w.-]+#\d+\b)/g).map((seg, i) => {
        const m = seg.match(/^([\w-]+\/[\w.-]+)#(\d+)$/);
        return m ? (
          // eslint-disable-next-line react/no-array-index-key
          <a key={i} href={`https://github.com/${m[1]}/issues/${m[2]}`}>
            {seg}
          </a>
        ) : (
          seg
        );
      });
    });
    return <>{parts}</>;
  },
};

function FieldDescription({ description }: { description: string }) {
  return (
    <div className={styles.description}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={issueRefLink}>
        {cleanDescription(description)}
      </ReactMarkdown>
    </div>
  );
}

// A minimal YAML skeleton for a map/object field: keys are the required fields
// plus the first couple of optionals. Derived mechanically from the schema; far
// clearer than prose for shapes like `node_groups`.
function yamlSkeleton(name: string, valueSchema: JSONSchema, isMap: boolean): string {
  const props = valueSchema.properties ?? {};
  const required = new Set(valueSchema.required ?? []);
  const keys = Object.keys(props).sort((a, b) => {
    const ra = required.has(a);
    const rb = required.has(b);
    if (ra !== rb) {
      return ra ? -1 : 1;
    }
    return 0;
  });
  const shown = keys.filter((k) => required.has(k));
  for (const k of keys) {
    if (shown.length >= 3) {
      break;
    }
    if (!shown.includes(k)) {
      shown.push(k);
    }
  }
  const placeholder = (s: JSONSchema) => {
    const t = Array.isArray(s.type) ? s.type[0] : s.type;
    if (t === 'boolean') return 'true';
    if (t === 'integer' || t === 'number') return '0';
    if (t === 'array') return '[]';
    return `<${typeLabel(s)}>`;
  };
  const body = shown.map(
    (k) => `    ${k}: ${placeholder(props[k])}${required.has(k) ? '   # required' : ''}`,
  );
  if (isMap) {
    return `${name}:\n  <name>:\n${body.join('\n')}`;
  }
  return `${name}:\n${body.map((l) => l.slice(2)).join('\n')}`;
}

function requiredHint(valueSchema: JSONSchema): string {
  const req = valueSchema.required ?? [];
  return req.length ? ` — requires ${req.join(', ')}` : '';
}

function Field({
  name,
  schema,
  required,
  path,
  level,
}: {
  name: string;
  schema: JSONSchema;
  required: boolean;
  path: string[];
  level: number;
}) {
  const fieldPath = [...path, name];
  const id = pathId(fieldPath);
  const nestedObject = schema.type === 'object' && schema.properties;
  const arrayItems = schema.type === 'array' && schema.items?.properties ? schema.items : null;
  const mapValue = mapValueSchema(schema);
  const mapOfObjects = mapValue && mapValue.properties ? mapValue : null;
  const headingLevel = Math.min(level, 6) as 2 | 3 | 4 | 5 | 6;

  return (
    <div className={`${styles.field} ${required ? styles.fieldRequired : ''}`}>
      {fieldPath.length > 1 && (
        <div className={styles.breadcrumb}>{fieldPath.join('.')}</div>
      )}
      <Heading as={`h${headingLevel}`} id={id}>
        <span className={styles.name}>{name}</span>
      </Heading>

      <div className={styles.meta}>
        <span className={styles.chip}>{typeLabel(schema)}</span>
        <span className={`${styles.chip} ${required ? styles.chipRequired : styles.chipOptional}`}>
          {required ? 'required' : 'optional'}
        </span>
        {schema.default !== undefined && (
          <span className={styles.chip}>default: {JSON.stringify(schema.default)}</span>
        )}
        {schema.pattern && (
          <span className={styles.chip} title="Value must match this regular expression">
            pattern: {schema.pattern}
          </span>
        )}
      </div>

      {schema.enum && (
        <div className={styles.enumList}>
          {schema.enum.map((v) => (
            <code key={String(v)}>{String(v)}</code>
          ))}
        </div>
      )}

      {schema.description && <FieldDescription description={schema.description} />}

      {schema.examples && schema.examples.length > 0 && (
        <CodeBlock language="yaml">
          {schema.examples.map((e) => (typeof e === 'string' ? e : JSON.stringify(e))).join('\n')}
        </CodeBlock>
      )}

      {mapOfObjects && (
        <CodeBlock language="yaml">{yamlSkeleton(name, mapOfObjects, true)}</CodeBlock>
      )}

      {nestedObject && (
        <Details summary={<summary>{`${name} fields (${Object.keys(schema.properties ?? {}).length})`}</summary>}>
          <div className={styles.nested}>
            <FieldList schema={schema} path={fieldPath} level={level + 1} />
          </div>
        </Details>
      )}
      {arrayItems && (
        <Details
          summary={
            <summary>{`${name} item fields (${Object.keys(arrayItems.properties ?? {}).length})${requiredHint(arrayItems)}`}</summary>
          }
        >
          <div className={styles.nested}>
            <FieldList schema={arrayItems} path={fieldPath} level={level + 1} />
          </div>
        </Details>
      )}
      {mapOfObjects && (
        <Details
          summary={
            <summary>{`${name} entry fields (${Object.keys(mapOfObjects.properties ?? {}).length})${requiredHint(mapOfObjects)}`}</summary>
          }
        >
          <div className={styles.nested}>
            <FieldList schema={mapOfObjects} path={fieldPath} level={level + 1} />
          </div>
        </Details>
      )}
    </div>
  );
}

function FieldList({
  schema,
  path,
  level,
}: {
  schema: JSONSchema;
  path: string[];
  level: number;
}) {
  const properties = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  const names = Object.keys(properties);

  if (names.length === 0) {
    return (
      <Admonition type="note">
        This section is keyed by provider name; see the provider-specific
        reference below for its fields.
      </Admonition>
    );
  }

  const requiredNames = names.filter((n) => required.has(n)).sort();
  const optionalNames = names.filter((n) => !required.has(n)).sort();

  const renderField = (name: string) => (
    <Field
      key={name}
      name={name}
      schema={properties[name]}
      required={required.has(name)}
      path={path}
      level={level}
    />
  );

  return (
    <>
      {requiredNames.map(renderField)}
      {requiredNames.length > 0 && optionalNames.length > 0 && (
        <div className={styles.divider}>Optional fields</div>
      )}
      {optionalNames.map(renderField)}
    </>
  );
}

export default function NicSchemaLoader({
  repo = DEFAULT_REPO,
  ref = DEFAULT_REF,
}: {
  repo?: string;
  ref?: string;
}): JSX.Element {
  const [selectedRef, setSelectedRef] = useState(ref);
  const versions = useVersions(repo);
  const { data, loading, error } = useNicSchemas(repo, selectedRef);
  const isPreview = selectedRef === DEFAULT_REF;

  const toolbar = (
    <div className={styles.toolbar}>
      <label htmlFor="nic-schema-version">
        <strong>NIC version</strong>
      </label>
      <select
        id="nic-schema-version"
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
      <a
        href={`https://github.com/${repo}/tree/${selectedRef}/schemas`}
        target="_blank"
        rel="noopener noreferrer"
      >
        source
      </a>
    </div>
  );

  let body: React.ReactNode;
  if (loading) {
    body = <p>Loading configuration schema…</p>;
  } else if (error) {
    body = (
      <Admonition type="danger" title="Could not load the configuration schema">
        <p>{error}</p>
        <p>
          No generated schema was found for <code>{selectedRef}</code>. Release
          tags only carry a schema once <code>schemas/</code> ships in that
          version; pick the preview entry to view the latest.
        </p>
      </Admonition>
    );
  } else if (!data) {
    body = null;
  } else {
    body = renderSections(data);
  }

  return (
    <>
      {toolbar}
      {body}
    </>
  );
}

function renderSections(data: LoadedSchemas): JSX.Element {
  return (
    <>
      <Heading as="h2" id="top-level">
        Top-level configuration
      </Heading>
      <FieldList schema={data.topLevel} path={[]} level={3} />

      {data.cluster.length > 0 && (
        <>
          <Heading as="h2" id="cluster-providers">
            Cluster providers
          </Heading>
          <p>
            Configured under <code>cluster.&lt;provider&gt;</code>. Exactly one
            provider is set per deployment.
          </p>
          <Tabs queryString="cluster-provider">
            {data.cluster.map(({ name, schema }) => (
              <TabItem key={name} value={name} label={name}>
                <FieldList schema={schema} path={['cluster', name]} level={3} />
              </TabItem>
            ))}
          </Tabs>
        </>
      )}

      {data.dns.length > 0 && (
        <>
          <Heading as="h2" id="dns-providers">
            DNS providers
          </Heading>
          <p>
            Configured under <code>dns.&lt;provider&gt;</code>. Credentials (API
            tokens) are read from environment variables, not from config.
          </p>
          <Tabs queryString="dns-provider">
            {data.dns.map(({ name, schema }) => (
              <TabItem key={name} value={name} label={name}>
                <FieldList schema={schema} path={['dns', name]} level={3} />
              </TabItem>
            ))}
          </Tabs>
        </>
      )}
    </>
  );
}
