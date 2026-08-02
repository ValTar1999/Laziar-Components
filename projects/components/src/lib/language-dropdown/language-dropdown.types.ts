export interface LzLanguageOption {
  code: string;
  name: string;
  /** URL or path to flag image. */
  flag: string;
  /** Short label shown on the trigger (e.g. `EN`). Falls back to uppercased `code`. */
  initials?: string;
}
