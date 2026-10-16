import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { Icon } from '../icon/icon.component';

/**
 * Collapsible article block.
 * Ported from frontend `app-block-expand` without `ArticleRenderBlock`.
 * The trigger toggles the body like an accordion and turns the chevron.
 */
@Component({
  selector: 'lz-expand',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [Icon],
  templateUrl: './expand.component.html',
  styleUrl: './expand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-expand-host',
  },
})
export class Expand {
  /** Heading. CMS HTML, same as frontend `expandTitle`. */
  readonly title = input('');
  /** Body shown when open. CMS HTML, same as frontend `expandContent`. */
  readonly content = input('');

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly opened = signal(true);
  /** While true, height is a pixel value so it can transition. */
  protected readonly animating = signal(false);

  protected toggle(): void {
    const el = this.panel()?.nativeElement;
    if (!el) {
      this.opened.update((open) => !open);
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.opened()) {
      el.style.height = `${el.getBoundingClientRect().height}px`;
      this.animating.set(true);
      this.opened.set(false);
      this.cdr.detectChanges();
      if (reduceMotion) {
        el.style.height = '0px';
        this.finish(el);
        return;
      }
      void el.offsetHeight;
      el.style.height = '0px';
      return;
    }

    const clip = el.querySelector('.lz-expand__clip');
    const target = clip instanceof HTMLElement ? clip.scrollHeight : el.scrollHeight;
    const current = el.getBoundingClientRect().height;
    el.style.height = `${current}px`;
    this.animating.set(true);
    this.opened.set(true);
    this.cdr.detectChanges();
    if (reduceMotion) {
      this.finish(el);
      return;
    }
    void el.offsetHeight;
    el.style.height = `${target}px`;
  }

  private finish(el: HTMLElement): void {
    el.style.height = '';
    this.animating.set(false);
  }

  protected onTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName !== 'height' || event.target !== this.panel()?.nativeElement) {
      return;
    }
    const el = this.panel()?.nativeElement;
    if (el) {
      this.finish(el);
    }
  }
}
