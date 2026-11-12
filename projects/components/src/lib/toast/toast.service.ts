import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ToastData, ToastOptions } from './toast.types';

/** A running or paused auto-dismiss countdown. */
interface DismissTimer {
  /** Milliseconds left when the countdown last started or was paused. */
  remaining: number;
  /** When the current run started; undefined while paused. */
  startedAt?: number;
  handle?: ReturnType<typeof setTimeout>;
}

/** Application-wide manager for transient toast notifications. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<readonly ToastData[]>([]);

  private readonly dismissTimers = new Map<string, DismissTimer>();
  /**
   * Countdowns run in the browser only: on the server a pending timer would
   * hold the render back for the whole duration of the toast.
   */
  private readonly canCountDown = isPlatformBrowser(inject(PLATFORM_ID));

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
    if (duration > 0 && this.canCountDown) {
      this.dismissTimers.set(id, { remaining: duration });
      this.resume(id);
    }

    return id;
  }

  /**
   * Holds a toast's countdown, for as long as the pointer or keyboard focus is
   * on it: nobody should lose a message while they are reading it.
   */
  pause(id: string): void {
    const timer = this.dismissTimers.get(id);
    if (!timer || timer.startedAt === undefined) return;

    clearTimeout(timer.handle);
    timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
    timer.startedAt = undefined;
    timer.handle = undefined;
  }

  /** Lets a paused countdown run again with the time it had left. */
  resume(id: string): void {
    const timer = this.dismissTimers.get(id);
    if (!timer || timer.startedAt !== undefined) return;

    timer.startedAt = Date.now();
    timer.handle = setTimeout(() => this.remove(id), timer.remaining);
  }

  /** Removes an active toast. */
  remove(id: string): void {
    const timer = this.dismissTimers.get(id);
    if (timer) {
      clearTimeout(timer.handle);
      this.dismissTimers.delete(id);
    }

    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
