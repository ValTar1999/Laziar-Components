import { DocsComponentMeta, DocsSandboxValues } from '../../core/component-doc.model';

function toastShowSnippet(values: DocsSandboxValues): string {
  const message = JSON.stringify(String(values['message'] ?? ''));
  const messageBold = JSON.stringify(String(values['messageBold'] ?? ''));
  const type = String(values['type'] ?? 'success');

  return `<lz-toast-container />

this.toast.show({
  message: ${message},
  messageBold: ${messageBold},
  type: '${type}',
});`;
}

export const TOAST_COMPONENT_META: DocsComponentMeta = {
  name: 'ToastContainer',
  selector: 'lz-toast-container',
  description:
    'Viewport host for ToastService notifications. Place once in the app shell, then call ToastService.show().',
  controls: [
    { name: 'message', kind: 'string', default: 'Site built from @laziar/components' },
    { name: 'messageBold', kind: 'string', default: 'Done' },
    {
      name: 'type',
      kind: 'select',
      options: ['success', 'error', 'warning', 'info'],
      default: 'success',
    },
  ],
  buildSnippet: toastShowSnippet,
  variants: [
    { label: 'success', props: { type: 'success', message: 'Saved', messageBold: 'OK' } },
    { label: 'error', props: { type: 'error', message: 'Could not save', messageBold: 'Error' } },
  ],
  inputs: [],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'App shell + service',
      code: `<!-- app.html -->
<lz-toast-container />

// component
this.toast.show({ message: 'Saved', messageBold: 'Done', type: 'success' });`,
    },
  ],
  tokens: [{ name: '--lz-z-tooltip', description: 'Toast stacking context' }],
};
