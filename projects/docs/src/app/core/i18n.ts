/** Supported docs languages. */
export const DOCS_LANGS = ['en', 'ru', 'ro'] as const;

export type DocsLang = (typeof DOCS_LANGS)[number];

export const DOCS_DEFAULT_LANG: DocsLang = 'en';
export const DOCS_LANG_STORAGE_KEY = 'lang';

export function isDocsLang(value: string | null | undefined): value is DocsLang {
  return !!value && (DOCS_LANGS as readonly string[]).includes(value);
}

/** Read persisted language from localStorage, or fall back to English. */
export function getInitialLang(): DocsLang {
  if (typeof localStorage === 'undefined') {
    return DOCS_DEFAULT_LANG;
  }

  const saved = localStorage.getItem(DOCS_LANG_STORAGE_KEY);
  return isDocsLang(saved) ? saved : DOCS_DEFAULT_LANG;
}

export function persistLang(lang: DocsLang): void {
  localStorage.setItem(DOCS_LANG_STORAGE_KEY, lang);
}
