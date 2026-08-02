import { DocsSandboxValues } from '../../core/component-doc.model';

export function docsStr(values: DocsSandboxValues, key: string, fallback = ''): string {
  const v = values[key];
  return v === undefined || v === null ? fallback : String(v);
}

export function docsBool(values: DocsSandboxValues, key: string): boolean {
  return Boolean(values[key]);
}

export function docsNum(values: DocsSandboxValues, key: string, fallback = 0): number {
  const v = values[key];
  if (v === undefined || v === null || v === '') {
    return fallback;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function docsOptStr(values: DocsSandboxValues, key: string): string | undefined {
  const s = docsStr(values, key).trim();
  return s || undefined;
}
