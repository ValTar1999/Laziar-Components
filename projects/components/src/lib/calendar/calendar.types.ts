/** 0 = Sunday … 6 = Saturday, same as `Date.prototype.getDay()`. */
export type LzCalendarWeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** One rendered cell of the month grid. */
export interface LzCalendarDay {
  date: Date;
  /** `yyyy-mm-dd`, stable track key and comparison value. */
  key: string;
  day: number;
  inMonth: boolean;
  disabled: boolean;
  selected: boolean;
  today: boolean;
}
