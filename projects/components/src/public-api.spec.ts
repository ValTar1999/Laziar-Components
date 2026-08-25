import * as publicApi from './public-api';

/**
 * Snapshot of the runtime export surface of `@laziar/components`.
 *
 * Why this exists: `Logo` was deleted as "unused" in ef1b3fc and published as 0.1.21, but
 * `../business-frontend` imports it, so the portal's build broke with NG1010. Lint, tests
 * and both builds stayed green here, because no library code references what a consumer
 * imports. This list is the only thing that turns such a removal into a failure in this
 * repo instead of in someone else's.
 *
 * Scope, stated plainly so this is not over-trusted: runtime value exports, by *name*.
 * Interfaces and type aliases are erased by the compiler and never reach the module object.
 * Nothing here checks shape, so renaming an `input()`, renaming a component selector, or
 * dropping a member from an `LZ_*` tuple all keep the name and pass green - the failure mode
 * this catches is deletion, not redefinition. A per-component template test is what catches
 * a rename; today only `Logo` has one. The packaged surface consumers also depend on -
 * `@laziar/components/styles/*`, `assets/icons`, and the peer ranges in the library's
 * package.json - is outside this file entirely.
 *
 * Adding an export is routine - add its name below, keeping the array sorted. A failure in
 * the `removed` direction is a breaking change for every consumer: restore the export, or
 * treat it as a deliberate major.
 */
const EXPECTED_PUBLIC_API: readonly string[] = [
  'Alert',
  'AlertColors',
  'AlertStylesMap',
  'AlertVariants',
  'ArticlecardReactions',
  'AuthFooter',
  'Avatar',
  'AvatarGroup',
  'Badge',
  'Button',
  'ButtonGroup',
  'CardComponent',
  'Checkbox',
  'DropdownComponent',
  'Icon',
  'InputComponent',
  'LZ_BADGE_COLORS',
  'LZ_BADGE_SIZES',
  'LZ_BADGE_VARIANTS',
  'LZ_BUTTON_COLORS',
  'LZ_BUTTON_SIZES',
  'LZ_BUTTON_VARIANTS',
  'LZ_CARD_ARTICLE_SIZES',
  'LZ_CARD_ROW_IDENTITY_POSITIONS',
  'LZ_CARD_ROW_IMAGE_ASPECTS',
  'LZ_CARD_ROW_IMAGE_HEIGHT_MODES',
  'LZ_CARD_ROW_META_LAYOUTS',
  'LZ_CARD_ROW_SUBTITLE_LAYOUTS',
  'LZ_CARD_SIZES',
  'LZ_CARD_VARIANTS',
  'LZ_CHECKBOX_TYPES',
  'LZ_CHECKBOX_VARIANTS',
  'LZ_DROPDOWN_SIZES',
  'LZ_INPUT_APPEARANCES',
  'LZ_INPUT_BUTTON_POSITIONS',
  'LZ_INPUT_SIZES',
  'LZ_INPUT_TYPES',
  'LZ_MODAL_CLOSE_REASONS',
  'LZ_MODAL_SIZES',
  'LZ_PAGINATION_SIZES',
  'LZ_SELECT_SIZES',
  'LZ_SWITCH_TOGGLE_SIZES',
  'LZ_TEXTAREA_RESIZE',
  'LZ_THEME_STORAGE_KEY',
  'LanguageDropdown',
  'LiveEventCard',
  'Loading',
  'LoginPromptBanner',
  'Logo',
  'LzInputFlush',
  'ModalComponent',
  'MoreActionsMenu',
  'PaginationComponent',
  'ProgressCircle',
  'PulseDot',
  'SelectComponent',
  'SwiperComponent',
  'SwitchToggle',
  'TabButton',
  'Table',
  'Tabs',
  'TextareaComponent',
  'ThemeService',
  'ToastContainer',
  'ToastNotification',
  'ToastService',
  'Tooltip',
  'TooltipHover',
  'VideoPlayer',
  'buildAvatarInitials',
  'lzSelectOptionDate',
  'lzSelectOptionLabel',
  'lzTableUtilityToCss',
];

describe('@laziar/components public API', () => {
  it('exports exactly the snapshotted surface', () => {
    const actual = Object.keys(publicApi).sort();
    const removed = EXPECTED_PUBLIC_API.filter((name) => !actual.includes(name));
    const added = actual.filter((name) => !EXPECTED_PUBLIC_API.includes(name));

    expect(removed)
      .withContext('exports dropped since the snapshot - this breaks consumers')
      .toEqual([]);
    expect(added)
      .withContext('new exports - add them to EXPECTED_PUBLIC_API in this file')
      .toEqual([]);
  });
});
