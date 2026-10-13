/**
 * Modal width presets — the widths publikator and frontend actually use:
 * sm 448px (`max-w-md`, avatar upload), md 512px (`max-w-lg`, the
 * confirm/delete default), lg 800px (publikator `app-modal-layout` default),
 * xl 976px (layout and video pickers), full = viewport minus the gutter.
 * Anything else (720, 896, 1100px) goes through `--lz-modal-width`.
 */
export const LZ_MODAL_SIZES = ['sm', 'md', 'lg', 'xl', 'full'] as const;

export type LzModalSize = (typeof LZ_MODAL_SIZES)[number];

/**
 * `default` — titled header, scrolling body, footer (publikator `app-modal-layout`).
 * `confirm` — close button only in the header; icon tile, title and description
 * open the body (publikator `app-confirm-dialog`, frontend membership modals).
 */
export const LZ_MODAL_VARIANTS = ['default', 'confirm'] as const;

export type LzModalVariant = (typeof LZ_MODAL_VARIANTS)[number];

/** Colour of the confirm variant's icon. */
export const LZ_MODAL_TONES = ['danger', 'warning', 'success', 'neutral'] as const;

export type LzModalTone = (typeof LZ_MODAL_TONES)[number];

/** What caused the modal to close — surfaced on the `closed` output. */
export const LZ_MODAL_CLOSE_REASONS = [
  'backdrop',
  'escape',
  'close-button',
  'programmatic',
] as const;

export type LzModalCloseReason = (typeof LZ_MODAL_CLOSE_REASONS)[number];
