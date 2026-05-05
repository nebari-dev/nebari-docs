import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import DeprecationBanner from '@site/src/components/DeprecationBanner';
import type LayoutType from '@theme/DocItem/Layout';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): JSX.Element {
  const { metadata } = useDoc();
  const isClassic = metadata.permalink?.startsWith('/classic/');

  return (
    <>
      {isClassic && <DeprecationBanner />}
      <Layout {...props} />
    </>
  );
}
