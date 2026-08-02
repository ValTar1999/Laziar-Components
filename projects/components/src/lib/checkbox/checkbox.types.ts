/** Input type for checkbox component. */
export const LZ_CHECKBOX_TYPES = ['checkbox', 'radio'] as const;

export type LzCheckboxType = (typeof LZ_CHECKBOX_TYPES)[number];

/** Visual variants for checkbox component. */
export const LZ_CHECKBOX_VARIANTS = ['default', 'error'] as const;

export type LzCheckboxVariant = (typeof LZ_CHECKBOX_VARIANTS)[number];
