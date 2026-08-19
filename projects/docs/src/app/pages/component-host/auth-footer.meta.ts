import { DocsComponentMeta } from '../../core/component-doc.model';

export const AUTH_FOOTER_COMPONENT_META: DocsComponentMeta = {
  name: 'AuthFooter',
  selector: 'lz-auth-footer',
  description: 'Auth-page footer with company name, year, and legal links.',
  controls: [
    { name: 'companyName', kind: 'string', default: 'Laziar SRL' },
    { name: 'aboutLabel', kind: 'string', default: 'About us' },
    { name: 'termsLabel', kind: 'string', default: 'Terms and conditions' },
    { name: 'contactsLabel', kind: 'string', default: 'Contacts' },
  ],
  variants: [{ label: 'default', props: { companyName: 'Laziar SRL' } }],
  inputs: [
    { name: 'companyName', type: 'string', default: `'Laziar SRL'`, description: 'Copyright name' },
    { name: 'aboutRoute', type: 'string', default: `'/about'`, description: 'About link' },
    {
      name: 'termsRoute',
      type: 'string',
      default: `'/terms-and-conditions'`,
      description: 'Terms link',
    },
    { name: 'contactsRoute', type: 'string', default: `'/contacts'`, description: 'Contacts link' },
    { name: 'aboutLabel', type: 'string', default: `'Despre noi'`, description: 'About label' },
    {
      name: 'termsLabel',
      type: 'string',
      default: `'Termeni și condiții'`,
      description: 'Terms label',
    },
    { name: 'contactsLabel', type: 'string', default: `'Contacte'`, description: 'Contacts label' },
  ],
  outputs: [],
  slots: [],
  examples: [{ title: 'Auth screen', code: `<lz-auth-footer companyName="Laziar SRL" />` }],
  tokens: [{ name: '--lz-color-text-muted', description: 'Footer text' }],
};
