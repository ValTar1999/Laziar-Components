/** Metadata driving the reusable component documentation layout. */

export type DocsControlKind = 'select' | 'boolean' | 'string' | 'number' | 'color';

export interface DocsSandboxControl {
  name: string;
  label?: string;
  kind: DocsControlKind;
  /** Union / enum options for `select`. */
  options?: readonly string[];
  default: string | boolean | number;
  description?: string;
}

export type DocsSandboxValues = Record<string, string | boolean | number>;

export interface DocsApiInput {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface DocsApiOutput {
  name: string;
  type: string;
  description: string;
}

export interface DocsApiSlot {
  name: string;
  description: string;
}

export interface DocsApiDeprecated {
  name: string;
  type: string;
  replacedBy?: string;
  description: string;
}

export interface DocsVariant {
  label: string;
  /** Props applied in the gallery card (and reflected in snippet). */
  props: DocsSandboxValues;
  /** Optional override; otherwise generated from selector + props. */
  code?: string;
}

export interface DocsExample {
  title: string;
  description?: string;
  code: string;
}

export interface DocsTokenRef {
  name: string;
  description: string;
}

export interface DocsComponentMeta {
  name: string;
  selector: string;
  description: string;
  /** Static projected content in generated snippets. */
  content?: string;
  /** If set, projected content is taken from this control's string value. */
  contentFrom?: string;
  controls: DocsSandboxControl[];
  variants: DocsVariant[];
  inputs: DocsApiInput[];
  outputs: DocsApiOutput[];
  slots: DocsApiSlot[];
  deprecated?: DocsApiDeprecated[];
  examples: DocsExample[];
  tokens: DocsTokenRef[];
}

export function defaultsFromControls(controls: DocsSandboxControl[]): DocsSandboxValues {
  return Object.fromEntries(controls.map((c) => [c.name, c.default]));
}

/** Build an Angular template snippet from selector + current sandbox values. */
export function generateTemplateCode(
  selector: string,
  values: DocsSandboxValues,
  controls: DocsSandboxControl[],
  content = '',
  skipControls: readonly string[] = [],
): string {
  const skip = new Set(skipControls);
  const attrs: string[] = [];

  for (const control of controls) {
    if (skip.has(control.name)) {
      continue;
    }

    const raw = values[control.name];
    if (raw === undefined) {
      continue;
    }

    if (control.kind === 'boolean') {
      if (raw === true) {
        attrs.push(`[${control.name}]="true"`);
      }
      continue;
    }

    if (control.kind === 'number') {
      attrs.push(`[${control.name}]="${Number(raw)}"`);
      continue;
    }

    attrs.push(`${control.name}="${escapeAttr(String(raw))}"`);
  }

  const multiline = attrs.length > 2;
  const attrBlock = attrs.length
    ? multiline
      ? `\n  ${attrs.join('\n  ')}\n`
      : ` ${attrs.join(' ')}`
    : '';

  if (content) {
    return multiline
      ? `<${selector}${attrBlock}>${content}</${selector}>`
      : `<${selector}${attrBlock}>${content}</${selector}>`;
  }

  return multiline ? `<${selector}${attrBlock}/>` : `<${selector}${attrBlock} />`;
}

export function resolveSnippetContent(
  meta: Pick<DocsComponentMeta, 'content' | 'contentFrom'>,
  values: DocsSandboxValues,
): string {
  if (meta.contentFrom && values[meta.contentFrom] !== undefined) {
    return String(values[meta.contentFrom]);
  }
  return meta.content ?? '';
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
