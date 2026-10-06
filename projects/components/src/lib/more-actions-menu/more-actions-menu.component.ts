import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { Icon } from '../icon/icon.component';
import { Tooltip } from '../tooltip/tooltip.component';
import { LzMoreActionsMenuLayout } from './more-actions-menu.types';

/**
 * More-actions context menu for `@laziar/components`.
 * Ported from frontend `app-more-actions-menu`.
 */
@Component({
  selector: 'lz-more-actions-menu',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [Icon, Tooltip],
  templateUrl: './more-actions-menu.component.html',
  styleUrl: './more-actions-menu.component.scss',
  host: {
    class: 'lz-more-actions-menu-host',
  },
})
export class MoreActionsMenu {
  readonly layout = input<LzMoreActionsMenuLayout>('desktop');

  readonly isWatchLater = input(false, { transform: booleanAttribute });
  readonly isSavedToList = input(false, { transform: booleanAttribute });
  /** Controls whether the watch-later/save-to-list rows are rendered. */
  readonly showSavedActions = input(true, { transform: booleanAttribute });
  readonly isPublisherFollowed = input(false, { transform: booleanAttribute });
  readonly isAuthorFollowed = input(false, { transform: booleanAttribute });

  readonly disableSaveToList = input(true, { transform: booleanAttribute });
  readonly disablePublisherFollow = input(true, { transform: booleanAttribute });
  readonly disableAuthorFollow = input(true, { transform: booleanAttribute });
  readonly disableReport = input(true, { transform: booleanAttribute });

  /** Label shown when watch-later is off; pass a locale-specific string to override the default. */
  readonly watchLaterLabel = input<string>('Watch later');
  /** Label shown when watch-later is already on. */
  readonly removeWatchLaterLabel = input<string>('Remove from Watch later');
  /** Label shown when save-to-list is off. */
  readonly saveToListLabel = input<string>('Save to list');
  /** Label shown when save-to-list is already on. */
  readonly removeFromListLabel = input<string>('Remove from list');
  /** Label shown when the publisher is not yet followed. */
  readonly publisherFollowLabel = input<string>('Follow publisher');
  /** Label shown when the publisher is already followed. */
  readonly unfollowPublisherLabel = input<string>('Unfollow publisher');
  /** Label shown when the author is not yet followed. */
  readonly authorFollowLabel = input<string>('Follow author');
  /** Label shown when the author is already followed. */
  readonly unfollowAuthorLabel = input<string>('Unfollow author');
  readonly shareLabel = input<string>('Share');
  readonly copyLinkLabel = input<string>('Copy link...');
  readonly reportLabel = input<string>('Report');
  /** Tooltip shown over rows disabled pending launch. */
  readonly comingSoonLabel = input<string>('Coming soon');

  readonly publisherFollow = output<void>();
  readonly authorFollow = output<void>();
  readonly watchLater = output<void>();
  readonly saveToList = output<void>();
  readonly share = output<void>();
  readonly copyLink = output<void>();
  readonly report = output<void>();

  protected readonly isDesktop = computed(() => this.layout() === 'desktop');

  protected readonly watchLaterDisplayLabel = computed(() =>
    this.isWatchLater() ? this.removeWatchLaterLabel() : this.watchLaterLabel(),
  );

  protected readonly saveToListDisplayLabel = computed(() =>
    this.isSavedToList() ? this.removeFromListLabel() : this.saveToListLabel(),
  );

  protected readonly publisherFollowDisplayLabel = computed(() =>
    this.isPublisherFollowed() ? this.unfollowPublisherLabel() : this.publisherFollowLabel(),
  );

  protected readonly authorFollowDisplayLabel = computed(() =>
    this.isAuthorFollowed() ? this.unfollowAuthorLabel() : this.authorFollowLabel(),
  );
}
