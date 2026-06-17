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
            <strong>The original Nebari project is now called Nebari Classic, and is in maintenance mode.</strong>
            <br></br>
            We'll continue to provide security updates and key bug fixes; however, no new features are planned at this time.
            We're using the lessons learned from Nebari Classic to build a new Nebari ecosystem of tools, on a more robust foundation with a modular architecture.
            <br></br>
            See the{' '}
            <Link to="/docs/introduction">current Nebari documentation</Link>{' '}
            for details on the new platform.
          </p>
        </Admonition>
      )}
      <Layout {...props} />
    </>
  );
}
