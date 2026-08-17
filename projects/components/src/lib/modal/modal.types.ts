/** Modal width presets. */
export const LZ_MODAL_SIZES = ['sm', 'md', 'lg', 'xl', 'full'] as const;

export type LzModalSize = (typeof LZ_MODAL_SIZES)[number];

/** What caused the modal to close — surfaced on the `closed` output. */
export const LZ_MODAL_CLOSE_REASONS = [
  'backdrop',
  'escape',
  'close-button',
  'programmatic',
] as const;

export type LzModalCloseReason = (typeof LZ_MODAL_CLOSE_REASONS)[number];
