import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import Admonition from '@theme/Admonition';
import Link from '@docusaurus/Link';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import type LayoutType from '@theme/DocItem/Layout';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): JSX.Element {
  const { metadata } = useDoc();
  const isClassic = metadata.permalink?.startsWith('/classic/');

  return (
    <>
      {isClassic && (
        <Admonition type="danger" title="Deprecated">
          <p>
            <strong>Nebari Classic is deprecated.</strong> There is no migration
            path today. See the{' '}
            <Link to="/docs/introduction">current Nebari documentation</Link>{' '}
            for the supported platform.
          </p>
        </Admonition>
      )}
      <Layout {...props} />
    </>
  );
}
