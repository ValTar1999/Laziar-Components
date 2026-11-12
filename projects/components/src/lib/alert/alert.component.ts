import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button.component';
import { Icon } from '../icon/icon.component';
import {
  AlertStylesMap,
  LzAlertVariant,
  LzAlertColor,
  LzAlertSize,
  LzAlertPadding,
  LzAlertCloseButtonVariant,
} from './alert.types';
import { LzIconVariant } from '../icon/icon.types';

/**
 * Alert `@laziar/components`.
 * Эталон: Laziar System (Figma Alert / Alert Playground).
 */
@Component({
  selector: 'lz-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [CommonModule, Button, Icon],
  host: {
    class: 'lz-alert-host',
  },
})
export class Alert {
  readonly title = input<string>('Alert title');
  readonly text = input<string>('');
  readonly iconName = input<string>('check-circle');
  readonly iconVariant = input<LzIconVariant>('outline');
  readonly variant = input<LzAlertVariant>('default');
  readonly isRow = input<boolean>(false);
  readonly isRowtext = input<boolean>(false);
  readonly showCloseButton = input<boolean>(true);
  /**
   * How assistive tech treats the alert when it appears: `status` is read out
   * at the next pause, `alert` interrupts (errors that block the user), and
   * `null` leaves it as plain content.
   */
  readonly role = input<'status' | 'alert' | null>('status');
  /** Accessible name of the close button; consumers pass a localized string. */
  readonly closeLabel = input('Close alert');
  /** Override close button color; defaults to variant style map. */
  readonly closeColor = input<LzAlertColor | undefined>(undefined);
  /** Override close button variant; defaults to variant style map. */
  readonly buttonVariant = input<LzAlertCloseButtonVariant | undefined>(undefined);
  readonly size = input<LzAlertSize>('sm');
  readonly padding = input<LzAlertPadding>('p-4');

  readonly closed = output<void>();

  protected readonly alertStyles = computed(() => AlertStylesMap[this.variant()]);

  protected readonly resolvedCloseColor = computed(
    () => this.closeColor() ?? this.alertStyles().closeColor,
  );

  protected readonly resolvedCloseVariant = computed(
    () => this.buttonVariant() ?? this.alertStyles().buttonVariant,
  );

  protected readonly alertClass = computed<string>(() => {
    const classes = ['lz-alert'];

    classes.push(`lz-alert--${this.variant()}`);
    classes.push(`lz-alert--${this.size()}`);
    classes.push(`lz-alert--${this.padding()}`);

    if (this.isRow()) {
      classes.push('lz-alert--row');
    }

    if (this.isRowtext()) {
      classes.push('lz-alert--row-text');
    }

    return classes.join(' ');
  });

  protected onCloseClick(): void {
    this.closed.emit();
  }
}
