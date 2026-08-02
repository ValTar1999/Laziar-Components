/** Textarea resize behavior options. */
export const LZ_TEXTAREA_RESIZE = ['none', 'vertical', 'horizontal', 'both'] as const;

export type LzTextareaResize = (typeof LZ_TEXTAREA_RESIZE)[number];
