import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Button } from '../button/button.component';
import { Icon } from '../icon/icon.component';
import { InputComponent } from '../input/input.component';
import { LzCalendarDay, LzCalendarWeekStart } from './calendar.types';

/**
 * Calendar `@laziar/components`.
 * Styles follow the Publikator reference (Figma Calendar): one month grid with
 * a month/year header, weekday row and 30px day cells.
 *
 * Usable declaratively (`[value]` + `(valueChange)`) or as a form control.
 * Days outside `min`/`max` render muted and cannot be picked; the previous /
 * next arrow is hidden when that whole month is out of range.
 *
 * Labels come from `Intl` for `locale`, so `ro` gives `Lu Ma Mi …` and
 * `August 2026` without any translation table.
 *
 * `withTime` adds the `Data` / `Ora` fields (dd.mm.yyyy, HH:mm) and keeps the
 * time in the value. `withActions` adds `Anulează` / `Salvează`: picks become a
 * draft that is only emitted on save, and cancel restores the last value.
 */
@Component({
  selector: 'lz-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, InputComponent, Button, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Calendar),
      multi: true,
    },
  ],
  host: {
    class: 'lz-calendar-host',
  },
})
export class Calendar implements ControlValueAccessor {
  /** Selected date; the time part is kept only with `withTime`. */
  readonly value = input<Date | null>(null);
  /** Earliest selectable day, inclusive. */
  readonly min = input<Date | null>(null);
  /** Latest selectable day, inclusive. */
  readonly max = input<Date | null>(null);
  /** BCP 47 locale for the month and weekday names. */
  readonly locale = input('ro');
  /** First column of the grid; Monday by default. */
  readonly weekStart = input<LzCalendarWeekStart>(1);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly previousLabel = input('Previous month');
  readonly nextLabel = input('Next month');
  /** Shows the date and time fields under the grid. */
  readonly withTime = input(false, { transform: booleanAttribute });
  /** Shows cancel / save; the value is only emitted on save. */
  readonly withActions = input(false, { transform: booleanAttribute });
  readonly dateLabel = input('Data');
  readonly timeLabel = input('Ora');
  readonly datePlaceholder = input('zz.ll.aaaa');
  readonly timePlaceholder = input('hh:mm');
  readonly cancelLabel = input('Anulează');
  readonly saveLabel = input('Salvează');

  /** Emitted with the picked date: local midnight, or the chosen time with `withTime`. */
  readonly valueChange = output<Date>();
  /** Emitted when cancel is pressed, after the draft is reset. */
  readonly cancelled = output<void>();

  private readonly injector = inject(Injector);
  private readonly grid = viewChild<ElementRef<HTMLElement>>('grid');

  private readonly today = startOfDay(new Date());

  /**
   * Compared by time value, so a parent that builds a fresh `Date` for the same
   * moment on every change detection does not wipe the user's pick.
   */
  private readonly valueDate = computed(() => toValidDate(this.value()), { equal: sameTime });
  private readonly minDay = computed(() => toDay(this.min()), { equal: sameTime });
  private readonly maxDay = computed(() => toDay(this.max()), { equal: sameTime });

  /** Last emitted (or written) value — what cancel goes back to. */
  private readonly committed = linkedSignal(() => this.valueDate());

  /** Draft day shown in the grid. */
  protected readonly selected = linkedSignal(() => toDay(this.committed()));
  /** Draft time, `HH:mm` or empty. */
  private readonly time = linkedSignal(() => {
    const committed = this.committed();
    return committed ? formatTime(committed) : '';
  });

  /** Field texts; they hold what is typed until it is committed on blur / Enter. */
  protected readonly dateText = linkedSignal(() => {
    const selected = this.selected();
    return selected ? formatDate(selected) : '';
  });
  protected readonly timeText = linkedSignal(() => this.time());

  /** The selected day with the draft time applied. */
  protected readonly draft = computed(() => {
    const day = this.selected();
    if (!day) return null;
    if (!this.withTime()) return day;
    const [hours, minutes] = (this.time() || '00:00').split(':').map(Number);
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes);
  });

  /** First day of the month on screen. */
  protected readonly viewMonth = linkedSignal(() =>
    startOfMonth(this.selected() ?? clampDay(this.today, this.minDay(), this.maxDay())),
  );

  /** Day holding the roving tab stop inside the grid. */
  protected readonly activeKey = linkedSignal(() => {
    const month = this.viewMonth();
    const selected = this.selected();
    const base = selected && sameMonth(selected, month) ? selected : month;
    return dayKey(clampDay(base, this.minDay(), this.maxDay()));
  });

  private readonly cvaDisabled = signal(false);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (value: Date | null) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected readonly title = computed(() => {
    const month = this.viewMonth();
    const name = new Intl.DateTimeFormat(this.locale(), { month: 'long' }).format(month);
    return `${capitalize(name)} ${month.getFullYear()}`;
  });

  protected readonly weekdays = computed(() => {
    const short = new Intl.DateTimeFormat(this.locale(), { weekday: 'short' });
    const long = new Intl.DateTimeFormat(this.locale(), { weekday: 'long' });
    // 4 Jan 2026 is a Sunday, so index i lands on getDay() === i.
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2026, 0, 4 + ((this.weekStart() + i) % 7));
      return {
        short: capitalize(short.format(date).replace('.', '').slice(0, 2)),
        long: capitalize(long.format(date)),
      };
    });
  });

  protected readonly weeks = computed<LzCalendarDay[][]>(() => {
    const month = this.viewMonth();
    const year = month.getFullYear();
    const index = month.getMonth();
    const offset = (month.getDay() - this.weekStart() + 7) % 7;
    const daysInMonth = new Date(year, index + 1, 0).getDate();
    const weekCount = Math.ceil((offset + daysInMonth) / 7);
    const selectedKey = this.selected() ? dayKey(this.selected()!) : null;
    const todayKey = dayKey(this.today);

    return Array.from({ length: weekCount }, (_, week) =>
      Array.from({ length: 7 }, (_, weekday) => {
        const date = new Date(year, index, 1 - offset + week * 7 + weekday);
        const key = dayKey(date);
        return {
          date,
          key,
          day: date.getDate(),
          inMonth: date.getMonth() === index,
          disabled: !this.inRange(date),
          selected: key === selectedKey,
          today: key === todayKey,
        };
      }),
    );
  });

  protected readonly canGoPrevious = computed(() => {
    const min = this.minDay();
    const month = this.viewMonth();
    return !min || new Date(month.getFullYear(), month.getMonth(), 0) >= min;
  });

  protected readonly canGoNext = computed(() => {
    const max = this.maxDay();
    const month = this.viewMonth();
    return !max || new Date(month.getFullYear(), month.getMonth() + 1, 1) <= max;
  });

  private readonly dayLabel = computed(
    () => new Intl.DateTimeFormat(this.locale(), { dateStyle: 'full' }),
  );

  protected ariaLabel(day: LzCalendarDay): string {
    return this.dayLabel().format(day.date);
  }

  protected previousMonth(): void {
    if (this.canGoPrevious()) this.shiftMonth(-1);
  }

  protected nextMonth(): void {
    if (this.canGoNext()) this.shiftMonth(1);
  }

  protected select(day: LzCalendarDay): void {
    if (this.effectiveDisabled() || day.disabled) return;

    this.selected.set(day.date);
    if (!day.inMonth) this.viewMonth.set(startOfMonth(day.date));
    this.activeKey.set(day.key);
    this.commitUnlessActions();
  }

  /** Applies a typed `dd.mm.yyyy`; anything unparsable or out of range is reverted. */
  protected commitDateText(): void {
    const day = parseDate(this.dateText());
    const selected = this.selected();

    if (!day || !this.inRange(day)) {
      this.dateText.set(selected ? formatDate(selected) : '');
      return;
    }
    if (selected && sameTime(day, selected)) {
      this.dateText.set(formatDate(day));
      return;
    }

    this.selected.set(day);
    this.viewMonth.set(startOfMonth(day));
    this.commitUnlessActions();
  }

  /** Applies a typed `HH:mm`; anything unparsable is reverted. */
  protected commitTimeText(): void {
    const time = parseTime(this.timeText());

    if (time === null) {
      this.timeText.set(this.time());
      return;
    }
    if (time === this.time()) {
      this.timeText.set(time);
      return;
    }

    this.time.set(time);
    this.commitUnlessActions();
  }

  protected save(): void {
    if (this.effectiveDisabled()) return;
    this.commit();
  }

  protected cancel(): void {
    const committed = this.committed();
    const day = toDay(committed);

    this.selected.set(day);
    this.time.set(committed ? formatTime(committed) : '');
    this.viewMonth.set(startOfMonth(day ?? clampDay(this.today, this.minDay(), this.maxDay())));
    this.onTouched();
    this.cancelled.emit();
  }

  /** Grid keyboard model from the WAI-ARIA date picker pattern. */
  protected onDayKeydown(event: KeyboardEvent): void {
    const current = parseKey(this.activeKey());
    let next: Date;

    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(current, -1);
        break;
      case 'ArrowRight':
        next = addDays(current, 1);
        break;
      case 'ArrowUp':
        next = addDays(current, -7);
        break;
      case 'ArrowDown':
        next = addDays(current, 7);
        break;
      case 'Home':
        next = addDays(current, -((current.getDay() - this.weekStart() + 7) % 7));
        break;
      case 'End':
        next = addDays(current, 6 - ((current.getDay() - this.weekStart() + 7) % 7));
        break;
      case 'PageUp':
        next = addMonths(current, event.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        next = addMonths(current, event.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }

    event.preventDefault();
    next = clampDay(next, this.minDay(), this.maxDay());
    if (!sameMonth(next, this.viewMonth())) this.viewMonth.set(startOfMonth(next));
    this.activeKey.set(dayKey(next));
    this.focusActive();
  }

  writeValue(value: Date | null): void {
    const date = toValidDate(value);
    this.committed.set(date);
    if (date) this.viewMonth.set(startOfMonth(date));
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  private commitUnlessActions(): void {
    if (!this.withActions()) this.commit();
  }

  private commit(): void {
    const draft = this.draft();
    if (!draft) return;

    this.committed.set(draft);
    this.valueChange.emit(draft);
    this.onChange(draft);
    this.onTouched();
  }

  private shiftMonth(delta: number): void {
    const month = this.viewMonth();
    this.viewMonth.set(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  }

  private inRange(day: Date): boolean {
    const min = this.minDay();
    const max = this.maxDay();
    return (!min || day >= min) && (!max || day <= max);
  }

  private focusActive(): void {
    afterNextRender(
      () => {
        this.grid()
          ?.nativeElement.querySelector<HTMLElement>(`[data-key="${this.activeKey()}"]`)
          ?.focus();
      },
      { injector: this.injector },
    );
  }
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toValidDate(date: Date | null | undefined): Date | null {
  return date instanceof Date && !Number.isNaN(date.getTime()) ? new Date(date) : null;
}

function toDay(date: Date | null | undefined): Date | null {
  const valid = toValidDate(date);
  return valid ? startOfDay(valid) : null;
}

function sameTime(a: Date | null, b: Date | null): boolean {
  return a === b || (!!a && !!b && a.getTime() === b.getTime());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Keeps the day of month, clamped to the target month's length (31 Jan → 28 Feb). */
function addMonths(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), last));
}

function clampDay(date: Date, min: Date | null, max: Date | null): Date {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
}

function dayKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function formatDate(date: Date): string {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** `d.m.yyyy`, with `.`, `/` or `-` between parts; rejects 31.02 and the like. */
function parseDate(text: string): Date | null {
  const match = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(text.trim());
  if (!match) return null;
  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  return date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

/** `H:mm` or `H.mm`, normalised to `HH:mm`. */
function parseTime(text: string): string | null {
  const match = /^(\d{1,2})[:.](\d{2})$/.exec(text.trim());
  if (!match) return null;
  const [hours, minutes] = [Number(match[1]), Number(match[2])];
  return hours < 24 && minutes < 60 ? `${pad(hours)}:${pad(minutes)}` : null;
}

function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}
