/** Visual style for a toast notification. */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/** A toast managed by {@link ToastService}. */
export interface ToastData {
  id: string;
  message: string;
  messageBold?: string;
  type: ToastType;
}

/** Options accepted by {@link ToastService.show}. */
export interface ToastOptions {
  message: string;
  messageBold?: string;
  type?: ToastType;
  /** Time before automatic dismissal, in milliseconds. Set to `0` to keep visible. */
  duration?: number;
}
