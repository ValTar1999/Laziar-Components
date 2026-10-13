import { DocsComponentMeta } from '../../core/component-doc.model';

export const MODAL_COMPONENT_META: DocsComponentMeta = {
  name: 'Modal',
  selector: 'lz-modal',
  description:
    'One dialog for publikator and frontend: titled layout or confirm with an icon, bottom sheet below 768px.',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['default', 'confirm'],
      default: 'default',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      default: 'md',
    },
    { name: 'title', kind: 'string', default: 'Adaugă autor' },
    { name: 'description', kind: 'string', default: '' },
    {
      name: 'icon',
      kind: 'select',
      options: ['x-circle', 'exclamation-triangle', 'check-circle', 'information-circle'],
      default: 'x-circle',
      description: 'Confirm variant only',
    },
    {
      name: 'tone',
      kind: 'select',
      options: ['danger', 'warning', 'success', 'neutral'],
      default: 'danger',
      description: 'Confirm variant only',
    },
    { name: 'sheetOnMobile', kind: 'boolean', default: true },
    { name: 'busy', kind: 'boolean', default: false },
    { name: 'dismissible', kind: 'boolean', default: true },
  ],
  variants: [
    {
      label: 'default',
      props: { variant: 'default', size: 'md', title: 'Adaugă autor' },
    },
    {
      label: 'confirm',
      props: {
        variant: 'confirm',
        size: 'md',
        title: 'Șterge short',
        description: 'Operațiunea este definitivă și datele nu mai pot fi recuperate.',
        icon: 'x-circle',
        tone: 'danger',
      },
    },
  ],
  inputs: [
    {
      name: 'open',
      type: 'boolean',
      default: 'false',
      description: 'Shown state, owned by the host',
    },
    {
      name: 'variant',
      type: `'default' | 'confirm'`,
      default: `'default'`,
      description:
        'default = publikator modal-layout; confirm = icon, title and description, no dividers',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg' | 'xl' | 'full'`,
      default: `'md'`,
      description: 'Max width: 448 / 512 / 800 / 976px / viewport. Custom: --lz-modal-width',
    },
    { name: 'title', type: 'string', description: 'Dialog title and accessible name' },
    { name: 'description', type: 'string', description: 'Text under the title; aria-describedby' },
    { name: 'icon', type: 'string', description: 'Icon in the confirm tile' },
    {
      name: 'tone',
      type: `'danger' | 'warning' | 'success' | 'neutral'`,
      default: `'danger'`,
      description: 'Confirm icon colour',
    },
    {
      name: 'dividers',
      type: 'boolean',
      description:
        'Header/footer borders. Default: on for default, off for confirm (confirm: footer only)',
    },
    {
      name: 'sheetOnMobile',
      type: 'boolean',
      default: 'true',
      description: 'Bottom sheet with full-width actions below 768px',
    },
    {
      name: 'busy',
      type: 'boolean',
      default: 'false',
      description: 'Blocks backdrop, Escape and the close button while a request runs',
    },
    {
      name: 'dismissible',
      type: 'boolean',
      default: 'true',
      description: 'false = required step: no close button, backdrop and Escape ignored',
    },
    {
      name: 'closeOnBackdrop',
      type: 'boolean',
      default: 'true',
      description: 'Close on a backdrop press',
    },
    {
      name: 'closeOnEscape',
      type: 'boolean',
      default: 'true',
      description: 'Close on Escape (topmost modal only)',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      description: 'Accessible name when a header slot replaces the title',
    },
    {
      name: 'closeButtonLabel',
      type: 'string',
      default: `'Close dialog'`,
      description: 'Localized label of the close button',
    },
  ],
  outputs: [
    {
      name: 'closed',
      type: `'backdrop' | 'escape' | 'close-button' | 'programmatic'`,
      description: 'Close requested; the host sets open to false',
    },
  ],
  slots: [
    { name: '[lz-modal-header]', description: 'Replaces the default title' },
    { name: '[lz-modal-body] / default', description: 'Body content, scrolls' },
    {
      name: '[lz-modal-footer]',
      description:
        'Right-aligned actions. Put the attribute on each button so they stretch on the mobile sheet',
    },
    {
      name: '[lz-modal-footer-start]',
      description: 'Left-aligned secondary action; its own row on the mobile sheet',
    },
  ],
  examples: [
    {
      title: 'Form modal (publikator modal-layout)',
      code: `<lz-modal [open]="open()" size="lg" title="Adaugă autor" (closed)="open.set(false)">
  <form>…</form>
  <lz-button lz-modal-footer variant="outline" label="Anulează" (clicked)="open.set(false)" />
  <lz-button lz-modal-footer label="Salvează" (clicked)="save()" />
</lz-modal>`,
    },
    {
      title: 'Confirm delete',
      code: `<lz-modal
  [open]="open()"
  variant="confirm"
  icon="x-circle"
  tone="danger"
  title="Șterge short"
  description="Operațiunea este definitivă."
  [busy]="deleting()"
  (closed)="open.set(false)"
>
  <lz-button lz-modal-footer variant="outline" label="Anulează" (clicked)="open.set(false)" />
  <lz-button lz-modal-footer color="red" label="Da, șterge" (clicked)="delete()" />
</lz-modal>`,
    },
    {
      title: 'Picker with fixed height and a left action',
      code: `<lz-modal [open]="open()" size="xl" title="Adaugă videoclipuri"
          style="--lz-modal-height: min(720px, 90dvh)" (closed)="open.set(false)">
  …
  <lz-button lz-modal-footer-start variant="tertiary" icon="pencil" label="Schimbă Layout" />
  <lz-button lz-modal-footer variant="outline" label="Anulează" (clicked)="open.set(false)" />
  <lz-button lz-modal-footer label="Salvează" (clicked)="save()" />
</lz-modal>`,
    },
    {
      title: 'Required choice (publisher selector)',
      code: `<lz-modal [open]="!publisher()" size="lg" title="Selectează publisher-ul" [dismissible]="false">
  …
</lz-modal>`,
    },
  ],
  tokens: [
    { name: '--lz-modal-width', description: 'Custom max width, overrides size' },
    { name: '--lz-modal-height', description: 'Fixed height, e.g. min(720px, 90dvh)' },
    { name: '--lz-modal-scrim', description: 'Backdrop colour (default #121212 at 70%)' },
    { name: '--lz-z-modal', description: 'Stacking order of the backdrop' },
    { name: '--lz-color-background', description: 'Panel background' },
    { name: '--lz-color-border-subtle', description: 'Dividers and icon tile border' },
    { name: '--lz-radius-2xl', description: 'Panel corners' },
  ],
};
