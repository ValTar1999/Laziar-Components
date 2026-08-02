/** Normalize API / control / token names into safe Transloco key segments. */
export function docsKeySegment(name: string): string {
  return (
    name
      .replace(/^--/, '')
      .replace(/^\[|\]$/g, '')
      .replace(/^\((.*)\)$/, '$1')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase() || 'item'
  );
}

/** Component docs id from selector (`lz-button` → `button`). */
export function docsComponentId(selector: string): string {
  return selector.replace(/^lz-/, '');
}
