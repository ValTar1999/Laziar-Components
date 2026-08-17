export interface LzLanguageOption {
  code: string;
  name: string;
  /** URL or path to flag image. Omit or leave empty to show initials only. */
  flag?: string;
  /** Short label shown on the trigger (e.g. `EN`). Falls back to uppercased `code`. */
  initials?: string;
}
