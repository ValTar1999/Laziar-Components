import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { Button } from '../button/button.component';
import { Icon } from '../icon/icon.component';
import { ToastType } from './toast.types';

/** A single, dismissible toast notification. */
@Component({
  selector: 'lz-toast-notification',
  standalone: true,
  hostDirectives: [LzInputFlush],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.scss',
  host: {
    class: 'lz-toast-notification-host',
  },
})
export class ToastNotification {
  readonly message = input('');
  readonly messageBold = input<string | undefined>(undefined);
  readonly type = input<ToastType>('success');
  readonly closed = output<void>();

  protected readonly iconName = computed(() => {
    const icons: Record<ToastType, string> = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'information-circle',
    };

    return icons[this.type()];
  });

  protected readonly messageParts = computed(() => {
    const message = this.message();
    const bold = this.messageBold();

    if (!bold || !message.includes(bold)) {
      return { before: message, bold: '', after: '' };
    }

    const boldStart = message.indexOf(bold);
    return {
      before: message.slice(0, boldStart),
      bold,
      after: message.slice(boldStart + bold.length),
    };
  });

  protected onClose(): void {
    this.closed.emit();
  }
}
