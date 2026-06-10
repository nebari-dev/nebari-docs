import React from 'react';
import Admonition from '@theme/Admonition';

type PlannedProviderProps = {
  /** The provider's package name under `nebari-infrastructure-core/pkg/provider/`. */
  stub: string;
};

/**
 * Shared "Planned, not yet implemented" banner for provider pages whose
 * scaffolding exists in `nebari-infrastructure-core` but is not yet usable.
 * Only the `stub` differs between providers; the wording stays uniform.
 */
export default function PlannedProvider({stub}: PlannedProviderProps): JSX.Element {
  const stubPath = `nebari-infrastructure-core/pkg/provider/${stub}`;
  const stubUrl = `https://github.com/nebari-dev/nebari-infrastructure-core/tree/main/pkg/provider/${stub}`;
  return (
    <Admonition type="warning" title="🚧 Planned, not yet implemented">
      This provider is on the NKP roadmap but is not production-ready today.
      Placeholder code lives in{' '}
      <a href={stubUrl}>
        <code>{stubPath}</code>
      </a>
      . Contributions to help build it are welcome.
    </Admonition>
  );
}
