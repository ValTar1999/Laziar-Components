import { DocsComponentMeta, DocsSandboxValues } from '../../core/component-doc.model';

/** Sandbox dates: `yyyy-mm-dd`, optionally followed by ` hh:mm`. */
export const CALENDAR_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{1,2}):(\d{2}))?$/;

function dateExpr(value: unknown): string | null {
  const match = CALENDAR_DATE_PATTERN.exec(String(value ?? '').trim());
  if (!match) return null;
  const parts = [Number(match[1]), Number(match[2]) - 1, Number(match[3])];
  if (match[4] !== undefined) parts.push(Number(match[4]), Number(match[5]));
  return `new Date(${parts.join(', ')})`;
}

function calendarSnippet(values: DocsSandboxValues): string {
  const lines = [`<lz-calendar`];
  const value = dateExpr(values['value']);
  const min = dateExpr(values['min']);
  const max = dateExpr(values['max']);

  if (value) lines.push(`  [value]="${value}"`);
  if (min) lines.push(`  [min]="${min}"`);
  if (max) lines.push(`  [max]="${max}"`);
  if (values['locale'] && values['locale'] !== 'ro') lines.push(`  locale="${values['locale']}"`);
  if (values['withTime']) lines.push(`  withTime`);
  if (values['withActions']) lines.push(`  withActions`);
  if (values['disabled']) lines.push(`  disabled`);
  lines.push(`  (valueChange)="date = $event"`);
  if (values['withActions']) lines.push(`  (cancelled)="close()"`);
  lines.push(`/>`);
  return lines.join('\n');
}

const BASE = {
  value: '2026-08-29',
  min: '',
  max: '',
  locale: 'ro',
  withTime: false,
  withActions: false,
  disabled: false,
};

export const CALENDAR_COMPONENT_META: DocsComponentMeta = {
  name: 'Calendar',
  selector: 'lz-calendar',
  description:
    'Month grid for picking a day, with optional date / time fields and cancel / save. Days outside min/max are muted; labels come from Intl for the locale.',
  controls: [
    {
      name: 'value',
      kind: 'string',
      default: '2026-08-29',
      description: 'yyyy-mm-dd or yyyy-mm-dd hh:mm',
    },
    { name: 'min', kind: 'string', default: '', description: 'yyyy-mm-dd' },
    { name: 'max', kind: 'string', default: '', description: 'yyyy-mm-dd' },
    { name: 'locale', kind: 'select', options: ['ro', 'en', 'ru'], default: 'ro' },
    { name: 'withTime', kind: 'boolean', default: false },
    { name: 'withActions', kind: 'boolean', default: false },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  buildSnippet: calendarSnippet,
  variants: [
    { label: 'default', props: { ...BASE } },
    { label: 'min · past days muted', props: { ...BASE, min: '2026-08-29' } },
    {
      label: 'date, time and actions',
      props: {
        ...BASE,
        value: '2025-10-15 15:00',
        min: '2025-10-15',
        withTime: true,
        withActions: true,
      },
    },
    { label: 'en', props: { ...BASE, value: '2025-10-15', locale: 'en' } },
  ],
  inputs: [
    {
      name: 'value',
      type: 'Date | null',
      default: 'null',
      description: 'Selected date; time is kept with withTime',
    },
    { name: 'min', type: 'Date | null', default: 'null', description: 'Earliest selectable day' },
    { name: 'max', type: 'Date | null', default: 'null', description: 'Latest selectable day' },
    {
      name: 'locale',
      type: 'string',
      default: `'ro'`,
      description: 'Locale for month and weekday names',
    },
    {
      name: 'weekStart',
      type: '0 | 1 | 2 | 3 | 4 | 5 | 6',
      default: '1',
      description: 'First column, 0 = Sunday',
    },
    {
      name: 'withTime',
      type: 'boolean',
      default: 'false',
      description: 'Date (dd.mm.yyyy) and time (HH:mm) fields under the grid',
    },
    {
      name: 'withActions',
      type: 'boolean',
      default: 'false',
      description: 'Cancel / save footer; the value is emitted only on save',
    },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables picking' },
    { name: 'dateLabel', type: 'string', default: `'Data'`, description: 'Date field label' },
    { name: 'timeLabel', type: 'string', default: `'Ora'`, description: 'Time field label' },
    {
      name: 'datePlaceholder',
      type: 'string',
      default: `'zz.ll.aaaa'`,
      description: 'Date field placeholder',
    },
    {
      name: 'timePlaceholder',
      type: 'string',
      default: `'hh:mm'`,
      description: 'Time field placeholder',
    },
    {
      name: 'cancelLabel',
      type: 'string',
      default: `'Anulează'`,
      description: 'Cancel button text',
    },
    { name: 'saveLabel', type: 'string', default: `'Salvează'`, description: 'Save button text' },
    {
      name: 'previousLabel',
      type: 'string',
      default: `'Previous month'`,
      description: 'Accessible label of the left arrow',
    },
    {
      name: 'nextLabel',
      type: 'string',
      default: `'Next month'`,
      description: 'Accessible label of the right arrow',
    },
  ],
  outputs: [
    {
      name: 'valueChange',
      type: 'OutputEmitterRef<Date>',
      description: 'Picked date; on save when withActions is set',
    },
    {
      name: 'cancelled',
      type: 'OutputEmitterRef<void>',
      description: 'Cancel pressed; the draft is already reset',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'No past dates',
      code: `<lz-calendar [value]="date" [min]="today" (valueChange)="date = $event" />`,
    },
    {
      title: 'Date and time with save',
      code: `<lz-calendar
  withTime
  withActions
  [value]="publishAt"
  [min]="today"
  (valueChange)="publishAt = $event; close()"
  (cancelled)="close()"
/>`,
    },
    {
      title: 'Reactive form',
      code: `<lz-calendar withTime [formControl]="publishAt" />`,
    },
  ],
  tokens: [
    { name: '--lz-color-background', description: 'Panel background (#FFFFFA)' },
    { name: '--lz-shadow-dropdown', description: 'Panel shadow' },
    { name: '--lz-color-neutral-900', description: 'Selected day circle' },
    { name: '--lz-color-text-muted', description: 'Weekdays and unavailable days' },
    { name: '--lz-color-border-subtle', description: 'Line above the actions' },
  ],
};
