import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';

import { Avatar } from '../avatar/avatar.component';
import { Icon } from '../icon/icon.component';
import { Tooltip } from '../tooltip/tooltip.component';
import { LzLiveEventCardEntry, LzLiveEventCardSize } from './live-event-card.types';

/**
 * Presentational live-event / coverage card.
 * Ported from frontend `app-live-event-card` without Principal / SavedArticles services.
 */
@Component({
  selector: 'lz-live-event-card',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [Avatar, Icon, Tooltip],
  templateUrl: './live-event-card.component.html',
  styleUrl: './live-event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-live-event-card-host',
  },
})
export class LiveEventCard {
  readonly publisher = input('');
  readonly avatarFirstName = input('');
  readonly avatarLastName = input('');
  readonly avatarImgUrl = input<string | undefined>(undefined);
  readonly eventTitle = input('');
  readonly entries = input<LzLiveEventCardEntry[]>([]);
  readonly link = input('#');
  readonly articleId = input<number | null>(null);
  readonly size = input<LzLiveEventCardSize>('sm');
  readonly showBottomBorder = input(false, { transform: booleanAttribute });
  /** Icon state for watch-later; controlled by the parent. */
  readonly watchLater = input(false, { transform: booleanAttribute });
  /** Icon state for save-to-list; controlled by the parent. */
  readonly isSaved = input(false, { transform: booleanAttribute });
  /** When true, shows watch-later / save action buttons. Replaces Principal `isLoggedIn`. */
  readonly showActions = input(false, { transform: booleanAttribute });

  /** Label shown when watch-later is off; pass a locale-specific string to override the default. */
  readonly watchLaterLabel = input<string>('Watch later');
  /** Label shown when watch-later is already on. */
  readonly removeWatchLaterLabel = input<string>('Remove from Watch later');
  /** Label shown when save-to-list is off. */
  readonly saveToListLabel = input<string>('Save to list');
  /** Label shown when save-to-list is already on. */
  readonly removeFromListLabel = input<string>('Remove from list');

  readonly open = output<string>();
  readonly publisherClick = output<string>();
  readonly watchLaterToggle = output<void>();
  readonly saveToListToggle = output<void>();

  protected readonly watchLaterTooltip = computed(() =>
    this.watchLater() ? this.removeWatchLaterLabel() : this.watchLaterLabel(),
  );

  protected readonly saveToListTooltip = computed(() =>
    this.isSaved() ? this.removeFromListLabel() : this.saveToListLabel(),
  );

  protected onTitleClick(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    event.stopPropagation();
    this.open.emit(this.link());
  }

  protected onPublisherClick(): void {
    this.publisherClick.emit(this.publisher());
  }

  protected onWatchLaterToggle(): void {
    this.watchLaterToggle.emit();
  }

  protected onSaveToListToggle(): void {
    this.saveToListToggle.emit();
  }
}
