import { LzButtonVariant } from '../button/button.types';

export const AlertVariants = [
  'default',
  'gray',
  'warning',
  'error',
  'success',
  'info',
  'purple',
  'dark',
  'red',
] as const;
export type LzAlertVariant = (typeof AlertVariants)[number];

export const AlertColors = ['gray', 'yellow', 'red', 'green', 'blue', 'purple'] as const;
export type LzAlertColor = (typeof AlertColors)[number];

export type LzAlertSize = 'base' | 'sm';
export type LzAlertPadding = 'p-3' | 'p-4';

export type LzAlertCloseButtonVariant = Extract<
  LzButtonVariant,
  'primary' | 'outline' | 'secondary' | 'tertiary' | 'link'
>;

export interface LzAlertStyles {
  closeColor: LzAlertColor;
  buttonVariant: LzAlertCloseButtonVariant;
}

/** Per-variant close button styling (frontend / publikator `AlertStylesMap`). */
export const AlertStylesMap: Record<LzAlertVariant, LzAlertStyles> = {
  default: { closeColor: 'gray', buttonVariant: 'link' },
  gray: { closeColor: 'gray', buttonVariant: 'link' },
  success: { closeColor: 'green', buttonVariant: 'link' },
  error: { closeColor: 'red', buttonVariant: 'link' },
  warning: { closeColor: 'yellow', buttonVariant: 'link' },
  info: { closeColor: 'blue', buttonVariant: 'link' },
  purple: { closeColor: 'purple', buttonVariant: 'link' },
  dark: { closeColor: 'gray', buttonVariant: 'primary' },
  red: { closeColor: 'red', buttonVariant: 'primary' },
};
