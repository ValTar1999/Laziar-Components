import { DocsComponentMeta } from '../../core/component-doc.model';

export const LANGUAGE_DROPDOWN_COMPONENT_META: DocsComponentMeta = {
  name: 'LanguageDropdown',
  selector: 'lz-language-dropdown',
  description:
    'Language picker with initials (or host-provided flags). Overlay via CDK + Floating UI. Selection is stored in localStorage.',
  controls: [{ name: 'storageKey', kind: 'string', default: 'lz-docs-demo-language' }],
  variants: [{ label: 'initials', props: { storageKey: 'lz-docs-demo-language' } }],
  inputs: [
    {
      name: 'languages',
      type: 'LzLanguageOption[]',
      default: 'RO / RU / EN / DE / FR / IT',
      description: 'Pass flag URLs from the host app; empty flag shows initials',
    },
    {
      name: 'storageKey',
      type: 'string',
      default: `'appLanguage'`,
      description: 'localStorage key for the selected code',
    },
  ],
  outputs: [
    {
      name: 'languageChange',
      type: 'OutputEmitterRef<LzLanguageOption>',
      description: 'Fires when the user picks a language',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'Custom list',
      code: `<lz-language-dropdown
  [languages]="[
    { code: 'en', name: 'English', initials: 'EN' },
    { code: 'ro', name: 'Română', initials: 'RO' }
  ]"
  (languageChange)="onLang($event)"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-shadow-dropdown', description: 'Menu shadow' },
    { name: '--lz-z-dropdown', description: 'Overlay layer (Floating UI)' },
  ],
};
