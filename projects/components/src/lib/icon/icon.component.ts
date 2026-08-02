import { Component, computed, input } from '@angular/core';
import { LzIconName, LzIconVariant } from './icon.types';

/**
 * SVG sprite icon (frontend / publikator `app-icon`).
 * Sprites: `/assets/icons/icons-{outline|solid|mini|micro|custom}.svg`
 */
@Component({
  selector: 'lz-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  host: {
    class: 'lz-icon-host',
    '[class.lz-icon-host--sized]': 'useDefaultSize()',
    '[attr.data-type]': 'type()',
  },
})
export class Icon {
  readonly name = input.required<LzIconName>();
  readonly type = input<LzIconVariant>('outline');
  /** Extra classes on the SVG (e.g. size override). */
  readonly iconClass = input<string | undefined>(undefined);

  /** Base path to sprite folder (apps may override). */
  readonly assetsPath = input('/assets/icons');

  protected readonly href = computed(
    () => `${this.assetsPath()}/icons-${this.type()}.svg#${this.name()}`,
  );

  /** Heroicons: outline/solid 24, mini 20, micro 16. */
  protected readonly viewBox = computed(() => {
    switch (this.type()) {
      case 'micro':
        return '0 0 16 16';
      case 'mini':
        return '0 0 20 20';
      default:
        return '0 0 24 24';
    }
  });

  protected readonly useDefaultSize = computed(() => {
    const extra = this.iconClass() ?? '';
    return !/(^|\s)w-/.test(extra);
  });

  /** Always keep `lz-icon` — `[class]` replaces the whole class attr. */
  protected readonly rootClass = computed(() => {
    const extra = this.iconClass() ?? '';
    return ['lz-icon', extra].filter(Boolean).join(' ');
  });
}
