import React from 'react';
import Admonition from '@theme/Admonition';
import Link from '@docusaurus/Link';

export interface DeprecationBannerProps {
  ctaHref?: string;
  ctaLabel?: string;
}

export default function DeprecationBanner({
  ctaHref = '/docs/introduction',
  ctaLabel = 'current Nebari documentation',
}: DeprecationBannerProps): JSX.Element {
  return (
    <Admonition type="danger" title="Deprecated">
      <p>
        <strong>Nebari Classic is deprecated.</strong> There is no migration
        path today. See the <Link to={ctaHref}>{ctaLabel}</Link> for the
        supported platform.
      </p>
    </Admonition>
  );
}
