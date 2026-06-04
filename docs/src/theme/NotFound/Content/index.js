import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';

export default function NotFoundContent({className}) {
  return (
    <main className={clsx('container margin-vert--xl', className)}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <Heading as="h1" className="hero__title">
            Page not found
          </Heading>
          <p>That URL doesn't exist on this site. The docs were recently reorganized; try one of these:</p>
          <ul>
            <li><a href="/docs/introduction">Nebari Kubernetes Platform (NKP) overview</a></li>
            <li><a href="/classic/welcome">Nebari Classic documentation</a></li>
          </ul>
        </div>
      </div>
    </main>
  );
}
