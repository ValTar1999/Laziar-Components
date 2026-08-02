import { Injectable, signal } from '@angular/core';
import { ToastData, ToastOptions } from './toast.types';

/** Application-wide manager for transient toast notifications. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<readonly ToastData[]>([]);

  private readonly dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();

  /** Returns a snapshot of all active notifications. */
  getToasts(): readonly ToastData[] {
    return this.toasts();
  }

  /** Shows a toast and returns its generated identifier. */
  show(options: ToastOptions): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const toast: ToastData = {
      id,
      message: options.message,
      messageBold: options.messageBold,
      type: options.type ?? 'success',
    };

    this.toasts.update((toasts) => [...toasts, toast]);

    const duration = options.duration ?? 5_000;
    if (duration > 0) {
      this.dismissTimers.set(
        id,
        setTimeout(() => this.remove(id), duration),
      );
    }

    return id;
  }

  /** Removes an active toast. */
  remove(id: string): void {
    const dismissTimer = this.dismissTimers.get(id);
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      this.dismissTimers.delete(id);
    }

    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
