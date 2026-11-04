import * as React from 'react';

let counter = 0;
const useReactId = (React as { useId?: () => string }).useId;

/**
 * Unique, SVG-safe id per component instance, so gradients from two
 * tab bars on the same page (e.g. on web) don't overwrite each other.
 */
export function useSvgId(prefix: string): string {
  // `useReactId` is fixed for the lifetime of the app, so the hook order is stable.
  const reactId = useReactId ? useReactId() : null;
  const fallback = React.useRef<string | null>(null);
  if (fallback.current === null) fallback.current = String(++counter);

  return `${prefix}-${(reactId ?? fallback.current).replace(/[^A-Za-z0-9_-]/g, '')}`;
}
