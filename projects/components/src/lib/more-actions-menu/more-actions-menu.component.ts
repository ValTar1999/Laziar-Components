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

  readonly publisherFollow = output<void>();
  readonly authorFollow = output<void>();
  readonly watchLater = output<void>();
  readonly saveToList = output<void>();
  readonly share = output<void>();
  readonly copyLink = output<void>();
  readonly report = output<void>();

  protected readonly isDesktop = computed(() => this.layout() === 'desktop');

  protected readonly watchLaterLabel = computed(() =>
    this.isWatchLater() ? 'Elimina din Vizioneaza mai tarziu' : 'Vizioneaza mai tarziu',
  );

  protected readonly saveToListLabel = computed(() =>
    this.isSavedToList() ? 'Elimina din lista' : 'Salveaza in lista',
  );

  protected readonly publisherFollowLabel = computed(() =>
    this.isPublisherFollowed() ? 'Nu mai urmaresti Publisherul' : 'Urmareste Publisherul',
  );

  protected readonly authorFollowLabel = computed(() =>
    this.isAuthorFollowed() ? 'Nu mai urmaresti Autorul' : 'Urmareste Autorul',
  );
}
