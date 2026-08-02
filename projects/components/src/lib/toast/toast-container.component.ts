import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastNotification } from './toast-notification.component';
import { ToastService } from './toast.service';

/** Fixed viewport host that renders notifications from {@link ToastService}. */
@Component({
  selector: 'lz-toast-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastNotification],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
  host: {
    class: 'lz-toast-container-host',
  },
})
export class ToastContainer {
  private readonly toastService = inject(ToastService);

  protected readonly toasts = this.toastService.toasts;

  protected dismiss(id: string): void {
    this.toastService.remove(id);
  }
}
