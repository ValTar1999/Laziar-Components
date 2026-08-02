/** Size variants for switch toggle component. */
export const LZ_SWITCH_TOGGLE_SIZES = ['sm', 'md'] as const;

export type LzSwitchToggleSize = (typeof LZ_SWITCH_TOGGLE_SIZES)[number];
