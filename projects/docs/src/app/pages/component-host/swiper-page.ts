import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SwiperComponent } from '@laziar/components';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { SWIPER_COMPONENT_META } from './swiper.meta';

@Component({
  selector: 'docs-swiper-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, SwiperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './swiper-page.html',
  styles: `
    .docs-swiper-slide {
      display: grid;
      place-items: center;
      min-height: 8rem;
      border-radius: 8px;
      background: var(--lz-color-neutral-50);
      color: var(--lz-color-text-secondary);
      font-weight: 600;
    }
  `,
})
export class SwiperPage {
  protected readonly meta = SWIPER_COMPONENT_META;
}
