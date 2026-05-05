import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.scss';

export interface DeprecationBannerProps {
  ctaHref?: string;
  ctaLabel?: string;
}

export default function DeprecationBanner({
  ctaHref = '/docs/introduction',
  ctaLabel = 'View current docs',
}: DeprecationBannerProps): JSX.Element {
  return (
    <aside
      className={styles.banner}
      role="alert"
      aria-label="Nebari Classic deprecation notice"
    >
      <div className={styles.body}>
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <p className={styles.text}>
          <strong>Nebari Classic is deprecated.</strong> There is no migration
          path today. See the current Nebari documentation for the supported
          platform.
        </p>
      </div>
      <Link className={styles.cta} to={ctaHref}>
        {ctaLabel}
      </Link>
    </aside>
  );
}
