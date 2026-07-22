/** Sidebar / search navigation for the docs site. */

export type DocsNavKind = 'page' | 'component' | 'service' | 'pipe' | 'directive';

export interface DocsNavItem {
  id: string;
  label: string;
  route: string;
  kind: DocsNavKind;
  /** Free-text for search (defaults to label). */
  keywords?: string;
}

export interface DocsNavGroup {
  id: string;
  label: string;
  items: DocsNavItem[];
}

export const DOCS_REPO_URL = 'https://github.com/laziar/laziar-components';

export const DOCS_NAV: DocsNavGroup[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    items: [
      {
        id: 'introduction',
        label: 'Introduction',
        route: '/getting-started',
        kind: 'page',
        keywords: 'install setup quickstart',
      },
    ],
  },
  {
    id: 'theming',
    label: 'Theming',
    items: [
      {
        id: 'theming',
        label: 'Tokens & ThemeService',
        route: '/theming',
        kind: 'page',
        keywords: 'css variables dark light',
      },
    ],
  },
  {
    id: 'forms',
    label: 'Components · Forms',
    items: [
      {
        id: 'stub',
        label: 'Stub (layout demo)',
        route: '/components/stub',
        kind: 'component',
        keywords: 'button sandbox preview demo scaffold',
      },
    ],
  },
  {
    id: 'layout',
    label: 'Components · Layout',
    items: [],
  },
  {
    id: 'feedback',
    label: 'Components · Feedback',
    items: [],
  },
  {
    id: 'navigation',
    label: 'Components · Navigation',
    items: [],
  },
  {
    id: 'data-display',
    label: 'Components · Data Display',
    items: [],
  },
  {
    id: 'services',
    label: 'Services',
    items: [
      {
        id: 'theme-service',
        label: 'ThemeService',
        route: '/theming',
        kind: 'service',
        keywords: 'theme dark mode',
      },
    ],
  },
  {
    id: 'pipes',
    label: 'Pipes',
    items: [],
  },
  {
    id: 'directives',
    label: 'Directives',
    items: [],
  },
];

export function flattenDocsNav(groups: DocsNavGroup[] = DOCS_NAV): DocsNavItem[] {
  return groups.flatMap((g) => g.items);
}

export function filterDocsNav(query: string, groups: DocsNavGroup[] = DOCS_NAV): DocsNavGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return groups;
  }

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const hay = `${item.label} ${item.id} ${item.keywords ?? ''}`.toLowerCase();
        return hay.includes(q);
      }),
    }))
    .filter((group) => group.items.length > 0);
}
