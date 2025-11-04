import React from 'react';
import Link from '@docusaurus/Link';
import type { Props } from '@theme/TOCItems/Tree';

function TOCItemTree({
  toc,
  className,
  linkClassName,
  isChild,
}: Props): JSX.Element | null {
  if (!toc.length) {
    return null;
  }

  return (
    <ul className={isChild ? undefined : className}>
      {toc.map((heading) => {
        // Parse the heading ID to check if it has "provider::actualId"
        let providerQuery = null;
        let actualId = heading.id;

        if (heading.id.includes('::')) {
          const [provider, ...rest] = heading.id.split('::');
          providerQuery = provider;
          actualId = rest.join('::'); // In case there's more than one '::', join back the rest.
        }

        // If a provider is found, build the URL with the query param
        const linkHref = providerQuery
          ? `?provider=${providerQuery}#${heading.id}`
          : `#${heading.id}`;

        return (
          <li key={heading.id}>
            <Link
              to={linkHref}
              className={linkClassName ?? undefined}
              // Developer provided the HTML, so assume it's safe.
              dangerouslySetInnerHTML={{ __html: heading.value }}
            />
            <TOCItemTree
              isChild
              toc={heading.children}
              className={className}
              linkClassName={linkClassName}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default React.memo(TOCItemTree);
