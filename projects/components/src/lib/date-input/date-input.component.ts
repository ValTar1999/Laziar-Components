import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EmbeddedViewRef,
  forwardRef,
  HostListener,
  inject,
  input,
  linkedSignal,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayModule, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { attachLzFloating } from '../floating/floating';
import { Calendar } from '../calendar/calendar.component';
import { LzCalendarWeekStart } from '../calendar/calendar.types';
import { Icon } from '../icon/icon.component';
import { LzDateInputSize } from './date-input.types';

let nextDateInputId = 0;

const POPOVER_OFFSET_PX = 8;
const VIEWPORT_PADDING_PX = 8;

/** Positioning is lz-floating's; CDK's own strategy stays inert. */
function inertPositionStrategy(): PositionStrategy {
  return {
    attach: () => undefined,
    apply: () => undefined,
    detach: () => undefined,
    dispose: () => undefined,
  };
}

/** `yyyy-mm-dd` to a local-midnight Date, or null for anything else. */
export function lzParseIsoDate(value: string | null | undefined): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.getMonth() === Number(match[2]) - 1 ? date : null;
}

/** A Date's local calendar day as `yyyy-mm-dd`. */
export function lzToIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * A date field: a trigger styled as lz-select that opens lz-calendar in a
 * popover. The value is a calendar day as an ISO `yyyy-mm-dd` string — what a
 * native `<input type="date">` holds — so it drops into forms built on one,
 * with no time zone to shift the day. `min` and `max` take the same strings.
 *
 * Works with `[value]` / `(valueChange)`, `ngModel` and form controls.
 */
@Component({
  selector: 'lz-date-input',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [OverlayModule, Calendar, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInput),
      multi: true,
    },
  ],
  host: {
    class: 'lz-date-input-host',
  },
})
export class DateInput implements ControlValueAccessor, OnDestroy {
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);

  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input('Select a date');
  readonly size = input<LzDateInputSize>('md');
  readonly helperText = input<string | undefined>(undefined);
  readonly error = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  /** The chosen day, `yyyy-mm-dd`; also settable through ngModel / formControl. */
  readonly value = input<string | null>(null);
  /** Earliest selectable day, `yyyy-mm-dd`. */
  readonly min = input<string | null>(null);
  /** Latest selectable day, `yyyy-mm-dd`. */
  readonly max = input<string | null>(null);
  /** Locale for the field text and the calendar's month and weekday names. */
  readonly locale = input('en-GB');
  readonly weekStart = input<LzCalendarWeekStart>(1);
  /** Names the field when there is no visible label. */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** The day just chosen, `yyyy-mm-dd`. */
  readonly valueChange = output<string>();

  protected readonly fieldId = `lz-date-input-${nextDateInputId++}`;
  protected readonly labelId = `${this.fieldId}-label`;
  protected readonly helperId = `${this.fieldId}-helper`;
  protected readonly valueId = `${this.fieldId}-value`;
  protected readonly dialogId = `${this.fieldId}-dialog`;
  readonly paneClass = 'lz-date-input-cdk-pane';

  @ViewChild('trigger', { static: true })
  private trigger?: ElementRef<HTMLButtonElement>;

  @ViewChild('popoverTpl', { static: true })
  private popoverTpl?: TemplateRef<unknown>;

  protected readonly isOpen = signal(false);

  /**
   * Follows the `value` input; a pick or a form write overrides it until the
   * input next changes, so a host can still reset the field through `[value]`.
   */
  protected readonly current = linkedSignal<string | null>(() => this.value());

  private readonly cvaDisabled = signal(false);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly selectedDate = computed(() => lzParseIsoDate(this.current()));
  protected readonly minDate = computed(() => lzParseIsoDate(this.min()));
  protected readonly maxDate = computed(() => lzParseIsoDate(this.max()));

  private readonly formatter = computed(
    () =>
      new Intl.DateTimeFormat(this.locale(), {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
  );
  protected readonly displayValue = computed(() => {
    const date = this.selectedDate();
    return date ? this.formatter().format(date) : '';
  });

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  private overlayRef?: OverlayRef;
  private portalView?: EmbeddedViewRef<unknown>;
  private floatingCleanup?: () => void;

  ngOnDestroy(): void {
    this.stopFloating();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  writeValue(value: string | null): void {
    this.current.set(value ?? null);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    if (isDisabled) this.close();
  }

  protected toggle(): void {
    if (this.effectiveDisabled()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /** A day picked in the calendar: commit it and hand focus back to the field. */
  protected pick(date: Date): void {
    const iso = lzToIsoDate(date);
    this.current.set(iso);
    this.close();
    this.onChange(iso);
    this.onTouched();
    this.valueChange.emit(iso);
  }

  /**
   * Claims the key with `preventDefault` so an enclosing `lz-modal`, which
   * listens further up on `window`, leaves this Escape to the calendar.
   */
  @HostListener('document:keydown.escape', ['$event'])
  protected onEscape(event?: Event): void {
    if (!this.isOpen()) return;
    event?.preventDefault();
    this.close();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    if (!this.isOpen()) return;
    const target = event.target as Node | null;
    if (!target) return;
    if (this.hostRef.nativeElement.contains(target)) return;
    if (this.overlayRef?.overlayElement.contains(target)) return;
    this.close();
    this.onTouched();
  }

  private open(): void {
    if (this.isOpen() || this.effectiveDisabled() || !this.popoverTpl) return;

    this.isOpen.set(true);
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        panelClass: this.paneClass,
        positionStrategy: inertPositionStrategy(),
        scrollStrategy: this.overlay.scrollStrategies.noop(),
      });
    }
    if (!this.overlayRef.hasAttached()) {
      this.portalView = this.overlayRef.attach(new TemplatePortal(this.popoverTpl, this.vcr));
    }
    this.startFloating();

    // The calendar lives in an overlay at the end of the document, out of the
    // tab order: render it now and move focus to its current day.
    this.portalView?.detectChanges();
    const pane = this.overlayRef.overlayElement;
    const day =
      pane.querySelector<HTMLElement>('.lz-calendar__day[tabindex="0"]') ??
      pane.querySelector<HTMLElement>('button:not([disabled])');
    day?.focus({ preventScroll: true });
  }

  /** Closes the calendar; focus inside it goes back to the field. */
  private close(): void {
    if (!this.isOpen()) return;
    const pane = this.overlayRef?.overlayElement;
    const focusInside = !!pane && pane.contains(document.activeElement);

    this.isOpen.set(false);
    this.stopFloating();
    this.overlayRef?.detach();
    this.portalView = undefined;

    if (focusInside) this.trigger?.nativeElement.focus();
    this.onTouched();
  }

  /** Focus left the field without the calendar being open: the user has been through it. */
  protected onTriggerBlur(): void {
    if (!this.isOpen()) this.onTouched();
  }

  private startFloating(): void {
    this.stopFloating();
    const reference = this.trigger?.nativeElement;
    const floating = this.overlayRef?.overlayElement;
    if (!reference || !floating) return;

    this.floatingCleanup = attachLzFloating(reference, floating, {
      placement: 'bottom-start',
      offset: POPOVER_OFFSET_PX,
      shiftPadding: VIEWPORT_PADDING_PX,
      flipPadding: VIEWPORT_PADDING_PX,
      strategy: 'fixed',
      round: false,
    });
  }

  private stopFloating(): void {
    this.floatingCleanup?.();
    this.floatingCleanup = undefined;
  }
}
