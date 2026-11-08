/** Input component size options. */
export const LZ_INPUT_SIZES = ['sm', 'md', 'lg'] as const;

export type LzInputSize = (typeof LZ_INPUT_SIZES)[number];

/** Input types supported. */
export const LZ_INPUT_TYPES = ['text', 'email', 'password', 'search', 'number'] as const;

export type LzInputType = (typeof LZ_INPUT_TYPES)[number];

/** Native `autocorrect` (Safari): whether the keyboard may correct what is typed. */
export const LZ_INPUT_AUTOCORRECT = ['on', 'off'] as const;

export type LzInputAutocorrect = (typeof LZ_INPUT_AUTOCORRECT)[number];

/** Native `autocapitalize`: how mobile keyboards capitalise what is typed. */
export const LZ_INPUT_AUTOCAPITALIZE = [
  'off',
  'none',
  'on',
  'sentences',
  'words',
  'characters',
] as const;

export type LzInputAutocapitalize = (typeof LZ_INPUT_AUTOCAPITALIZE)[number];

/** What a form control bound to an lz-input holds: text, or for `type="number"` a number. */
export type LzInputValue = string | number | null;

/** Button position for input with button. */
export const LZ_INPUT_BUTTON_POSITIONS = ['left', 'right'] as const;

export type LzInputButtonPosition = (typeof LZ_INPUT_BUTTON_POSITIONS)[number];

/** Visual appearance variants. */
export const LZ_INPUT_APPEARANCES = ['default', 'laziarPanel'] as const;

export type LzInputAppearance = (typeof LZ_INPUT_APPEARANCES)[number];
