/** Sidebar / search navigation for the docs site. */

export type DocsNavKind = 'page' | 'component' | 'service' | 'pipe' | 'directive';

export interface DocsNavItem {
  id: string;
  /** Transloco key for the visible label. */
  label: string;
  route: string;
  kind: DocsNavKind;
  /** Heroicons outline name for sidebar. */
  icon?: string;
  /** Free-text for search (defaults to label). */
  keywords?: string;
}

export interface DocsNavGroup {
  id: string;
  /** Transloco key for the group heading (empty string = no heading). */
  label: string;
  items: DocsNavItem[];
  /** Draw a soft rule above this group (secondary block). */
  dividerBefore?: boolean;
}

export const DOCS_REPO_URL = 'https://github.com/laziar/laziar-components';

export const DOCS_NAV: DocsNavGroup[] = [
  {
    id: 'getting-started',
    label: 'nav.groups.start',
    items: [
      {
        id: 'introduction',
        label: 'nav.items.introduction',
        route: '/getting-started',
        kind: 'page',
        icon: 'home',
        keywords: 'install setup quickstart introduction',
      },
    ],
  },
  {
    id: 'theming',
    label: 'nav.groups.theming',
    items: [
      {
        id: 'theming',
        label: 'nav.items.tokensTheme',
        route: '/theming',
        kind: 'page',
        icon: 'swatch',
        keywords: 'css variables dark light tokens theme',
      },
    ],
  },
  {
    id: 'forms',
    label: 'nav.groups.forms',
    items: [
      {
        id: 'button',
        label: 'nav.items.button',
        route: '/components/button',
        kind: 'component',
        icon: 'cursor-arrow-rays',
        keywords: 'button lz-button primary outline click',
      },
      {
        id: 'checkbox',
        label: 'nav.items.checkbox',
        route: '/components/checkbox',
        kind: 'component',
        icon: 'check-circle',
        keywords: 'checkbox radio lz-checkbox',
      },
      {
        id: 'switch-toggle',
        label: 'nav.items.switch',
        route: '/components/switch-toggle',
        kind: 'component',
        icon: 'bolt',
        keywords: 'switch toggle lz-switch',
      },
      {
        id: 'input',
        label: 'nav.items.input',
        route: '/components/input',
        kind: 'component',
        icon: 'pencil-square',
        keywords: 'input text field form',
      },
      {
        id: 'textarea',
        label: 'nav.items.textarea',
        route: '/components/textarea',
        kind: 'component',
        icon: 'bars-3-bottom-left',
        keywords: 'textarea form',
      },
      {
        id: 'select',
        label: 'nav.items.select',
        route: '/components/select',
        kind: 'component',
        icon: 'chevron-up-down',
        keywords: 'select dropdown options',
      },
      {
        id: 'stub',
        label: 'nav.items.stub',
        route: '/components/stub',
        kind: 'component',
        icon: 'square-2-stack',
        keywords: 'sandbox preview demo scaffold',
      },
    ],
  },
  {
    id: 'feedback',
    label: 'nav.groups.feedback',
    items: [
      {
        id: 'alert',
        label: 'nav.items.alert',
        route: '/components/alert',
        kind: 'component',
        icon: 'exclamation-triangle',
        keywords: 'alert banner message',
      },
      {
        id: 'badge',
        label: 'nav.items.badge',
        route: '/components/badge',
        kind: 'component',
        icon: 'tag',
        keywords: 'badge chip tag',
      },
      {
        id: 'loading',
        label: 'nav.items.loading',
        route: '/components/loading',
        kind: 'component',
        icon: 'arrow-path',
        keywords: 'spinner loader',
      },
      {
        id: 'progress-circle',
        label: 'nav.items.progressCircle',
        route: '/components/progress-circle',
        kind: 'component',
        icon: 'chart-pie',
        keywords: 'progress circle percent',
      },
      {
        id: 'tooltip',
        label: 'nav.items.tooltip',
        route: '/components/tooltip',
        kind: 'component',
        icon: 'chat-bubble-bottom-center-text',
        keywords: 'tooltip tip hover overlay info',
      },
      {
        id: 'pulse-dot',
        label: 'nav.items.pulseDot',
        route: '/components/pulse-dot',
        kind: 'component',
        icon: 'signal',
        keywords: 'pulse status dot',
      },
    ],
  },
  {
    id: 'data-display',
    label: 'nav.groups.dataDisplay',
    items: [
      {
        id: 'avatar',
        label: 'nav.items.avatar',
        route: '/components/avatar',
        kind: 'component',
        icon: 'user-circle',
        keywords: 'avatar user photo',
      },
      {
        id: 'avatar-group',
        label: 'nav.items.avatarGroup',
        route: '/components/avatar-group',
        kind: 'component',
        icon: 'user-group',
        keywords: 'avatars group',
      },
      {
        id: 'icon',
        label: 'nav.items.icon',
        route: '/components/icon',
        kind: 'component',
        icon: 'sparkles',
        keywords: 'icon svg heroicons',
      },
    ],
  },
  {
    id: 'navigation',
    label: 'nav.groups.navigation',
    items: [
      {
        id: 'tabs',
        label: 'nav.items.tabs',
        route: '/components/tabs',
        kind: 'component',
        icon: 'queue-list',
        keywords: 'tabs tablist',
      },
      {
        id: 'tab-button',
        label: 'nav.items.tabButton',
        route: '/components/tab-button',
        kind: 'component',
        icon: 'rectangle-group',
        keywords: 'tab button link',
      },
      {
        id: 'button-group',
        label: 'nav.items.buttonGroup',
        route: '/components/button-group',
        kind: 'component',
        icon: 'bars-3',
        keywords: 'button group segmented',
      },
    ],
  },
  {
    id: 'services',
    label: 'nav.groups.services',
    dividerBefore: true,
    items: [
      {
        id: 'theme-service',
        label: 'nav.items.themeService',
        route: '/theming',
        kind: 'service',
        icon: 'bell',
        keywords: 'theme dark mode',
      },
    ],
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
