/** How the options are drawn: bare radios with labels, or each option as a bordered card. */
export const LZ_RADIO_GROUP_APPEARANCES = ['plain', 'card'] as const;

export type LzRadioGroupAppearance = (typeof LZ_RADIO_GROUP_APPEARANCES)[number];

/** Which way the options run. */
export const LZ_RADIO_GROUP_ORIENTATIONS = ['vertical', 'horizontal'] as const;

export type LzRadioGroupOrientation = (typeof LZ_RADIO_GROUP_ORIENTATIONS)[number];

/** One choice in a radio group. */
export interface LzRadioOption<T = unknown> {
  /** What the group's value becomes when this option is chosen. Compared with `===`. */
  value: T;
  label: string;
  /** A muted line under the label; also read out as the option's description. */
  description?: string;
  /** An icon before the label. */
  icon?: string;
  disabled?: boolean;
}
