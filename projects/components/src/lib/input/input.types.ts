/** Input component size options. */
export const LZ_INPUT_SIZES = ['sm', 'md', 'lg'] as const;

export type LzInputSize = (typeof LZ_INPUT_SIZES)[number];

/** Input types supported. */
export const LZ_INPUT_TYPES = ['text', 'email', 'password', 'search'] as const;

export type LzInputType = (typeof LZ_INPUT_TYPES)[number];

/** Button position for input with button. */
export const LZ_INPUT_BUTTON_POSITIONS = ['left', 'right'] as const;

export type LzInputButtonPosition = (typeof LZ_INPUT_BUTTON_POSITIONS)[number];

/** Visual appearance variants. */
export const LZ_INPUT_APPEARANCES = ['default', 'laziarPanel'] as const;

export type LzInputAppearance = (typeof LZ_INPUT_APPEARANCES)[number];
