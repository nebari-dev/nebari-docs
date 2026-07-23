import Admonition from '@theme/Admonition';
import Details from '@theme/Details';
import Heading from '@theme/Heading';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * NicSchemaLoader renders the Nebari Infrastructure Core (NIC) configuration
 * reference directly from the JSON Schema that `nebari-infrastructure-core`
 * generates from its Go config structs (the `schemas/` directory produced by
 * `make schemas`). Because the schema is generated from the source of truth,
 * this page cannot drift from the actual config contract.
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
// (nebari-infrastructure-core#362) lands on a tagged release, pin `ref` to
// that tag for versioned docs; until then it tracks the feature branch.
const DEFAULT_REPO = 'nebari-dev/nebari-infrastructure-core';
const DEFAULT_REF = 'feat/config-schema-gen';

const schemasBase = (repo: string, ref: string) =>
  `https://raw.githubusercontent.com/${repo}/${ref}/schemas`;

const slug = (name: string) => name.replace(/_/g, '-').toLowerCase();

const refKey = (ref: string) => ref.replace('#/$defs/', '');

/**
 * Inline every internal `#/$defs/...` reference against the file's own `$defs`
 * map. The generated schemas only ever use same-file pointer refs, so a local
 * dereference is sufficient - and necessary, because generic `$ref` resolvers
 * leave these recursive `$defs` refs untouched. `seen` guards against cycles
 * (a Go type that transitively references itself), returning a plain object
 * stub instead of recursing forever.
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
    // Preserve a description written on the ref site (invopop puts the field
    // doc there) unless the target already carries its own.
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

/**
 * Fetch one schema file and return the object its top-level `$ref` points to,
 * with every nested `$ref` inlined. Provider schemas are self-contained.
 */
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
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) {
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

// A map type is a JSON-Schema object with no fixed properties whose value shape
// is given by an `additionalProperties` schema (e.g. Go `map[string]NodeGroup`).
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

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <th style={{ textAlign: 'left', padding: '6px 12px', whiteSpace: 'nowrap' }}>
        {label}
      </th>
      <td style={{ padding: '6px 12px', width: '100%' }}>{value}</td>
    </tr>
  );
}

function Field({
  name,
  schema,
  required,
  level,
}: {
  name: string;
  schema: JSONSchema;
  required: boolean;
  level: number;
}) {
  const nestedObject = schema.type === 'object' && schema.properties;
  const arrayOfObjects = schema.type === 'array' && schema.items?.properties;
  const mapValue = mapValueSchema(schema);
  const mapOfObjects = mapValue && mapValue.properties;
  const headingLevel = Math.min(level, 6) as 2 | 3 | 4 | 5 | 6;

  return (
    <div style={{ marginBottom: '18px' }}>
      <Heading as={`h${headingLevel}`} id={slug(name)}>
        <code>{name}</code>{' '}
        {required && <span className="badge badge--secondary">required</span>}
      </Heading>

      {schema.description && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {schema.description}
        </ReactMarkdown>
      )}

      <table style={{ borderCollapse: 'collapse', display: 'table' }}>
        <tbody>
          <DetailRow label="Type" value={<code>{typeLabel(schema)}</code>} />
          {schema.enum && (
            <DetailRow
              label="Options"
              value={<code>{schema.enum.map(String).join(', ')}</code>}
            />
          )}
          {schema.pattern && (
            <DetailRow label="Pattern" value={<code>{schema.pattern}</code>} />
          )}
          {schema.default !== undefined && (
            <DetailRow
              label="Default"
              value={<code>{JSON.stringify(schema.default)}</code>}
            />
          )}
        </tbody>
      </table>

      {nestedObject && (
        <Details summary={<summary>Nested fields</summary>}>
          <FieldList schema={schema} level={level + 1} />
        </Details>
      )}
      {arrayOfObjects && (
        <Details summary={<summary>Item fields</summary>}>
          <FieldList schema={schema.items as JSONSchema} level={level + 1} />
        </Details>
      )}
      {mapOfObjects && (
        <Details summary={<summary>Value fields (one entry per key)</summary>}>
          <FieldList schema={mapValue as JSONSchema} level={level + 1} />
        </Details>
      )}
    </div>
  );
}

function FieldList({ schema, level }: { schema: JSONSchema; level: number }) {
  const properties = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  const entries = Object.entries(properties).sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) {
    return (
      <Admonition type="note">
        This section is keyed by provider name; see the provider-specific
        reference below for its fields.
      </Admonition>
    );
  }

  return (
    <>
      {entries.map(([key, value]) => (
        <Field
          key={key}
          name={key}
          schema={value}
          required={required.has(key)}
          level={level}
        />
      ))}
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
  const { data, loading, error } = useNicSchemas(repo, ref);

  if (loading) {
    return <p>Loading configuration schema…</p>;
  }
  if (error) {
    return (
      <Admonition type="danger" title="Could not load the configuration schema">
        <p>{error}</p>
        <p>
          The reference is generated from{' '}
          <a
            href={`https://github.com/${repo}/tree/${ref}/schemas`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>{repo}</code> <code>schemas/</code>
          </a>
          .
        </p>
      </Admonition>
    );
  }
  if (!data) {
    return null;
  }

  return (
    <>
      <Admonition type="info">
        This reference is generated automatically from the{' '}
        <a
          href={`https://github.com/${repo}/tree/${ref}/schemas`}
          target="_blank"
          rel="noopener noreferrer"
        >
          NIC configuration JSON Schema
        </a>{' '}
        (currently tracking <code>{ref}</code>). It cannot drift from the config
        the code actually accepts.
      </Admonition>

      <Heading as="h2" id="top-level">
        Top-level configuration
      </Heading>
      <FieldList schema={data.topLevel} level={3} />

      {data.cluster.length > 0 && (
        <>
          <Heading as="h2" id="cluster-providers">
            Cluster providers
          </Heading>
          <p>
            Configured under <code>cluster.&lt;provider&gt;</code>. Exactly one
            provider is set per deployment.
          </p>
          <Tabs>
            {data.cluster.map(({ name, schema }) => (
              <TabItem key={name} value={name} label={name}>
                <FieldList schema={schema} level={3} />
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
          <Tabs>
            {data.dns.map(({ name, schema }) => (
              <TabItem key={name} value={name} label={name}>
                <FieldList schema={schema} level={3} />
              </TabItem>
            ))}
          </Tabs>
        </>
      )}
    </>
  );
}
