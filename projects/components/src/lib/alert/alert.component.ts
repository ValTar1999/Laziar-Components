import { Component, computed, input, output } from '@angular/core';
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
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  standalone: true,
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
