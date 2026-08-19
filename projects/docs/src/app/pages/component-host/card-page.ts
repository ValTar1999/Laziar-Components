import { Component, signal } from '@angular/core';
import {
  CardComponent,
  LzCardRowImageAspect,
  LzCardRowImageHeightMode,
  LzCardRowIdentityPosition,
  LzCardRowMetaLayout,
  LzCardRowSubtitleLayout,
  LzCardSize,
  LzCardVariant,
} from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { CARD_COMPONENT_META } from './card.meta';

const SAMPLE_METRICS = { '❤️': 12, '🔥': 4, '👏': 3, '😮': 1 };

@Component({
  selector: 'docs-card-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, CardComponent],
  templateUrl: './card-page.html',
  styleUrl: './card-page.scss',
})
export class CardPage {
  protected readonly meta = CARD_COMPONENT_META;
  protected readonly isWatchLater = signal(false);
  protected readonly isSavedToList = signal(false);

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string, fallback = false): boolean {
    if (!(key in values)) {
      return fallback;
    }

    return docsBool(values, key);
  }

  protected variant(values: DocsSandboxValues): LzCardVariant {
    return this.str(values, 'variant', 'row') as LzCardVariant;
  }

  protected size(values: DocsSandboxValues): LzCardSize {
    return this.str(values, 'size', 'md') as LzCardSize;
  }

  protected rowImageHeightMode(values: DocsSandboxValues): LzCardRowImageHeightMode {
    return this.str(values, 'rowImageHeightMode', 'fixed') as LzCardRowImageHeightMode;
  }

  protected rowIdentityPosition(values: DocsSandboxValues): LzCardRowIdentityPosition {
    return this.str(values, 'rowIdentityPosition', 'top') as LzCardRowIdentityPosition;
  }

  protected rowMetaLayout(values: DocsSandboxValues): LzCardRowMetaLayout {
    return this.str(values, 'rowMetaLayout', 'inline') as LzCardRowMetaLayout;
  }

  protected rowSubtitleLayout(values: DocsSandboxValues): LzCardRowSubtitleLayout {
    return this.str(values, 'rowSubtitleLayout', 'below') as LzCardRowSubtitleLayout;
  }

  protected rowImageAspect(values: DocsSandboxValues): LzCardRowImageAspect {
    return this.str(values, 'rowImageAspect', '1/1') as LzCardRowImageAspect;
  }

  protected rowImageAspectMd(values: DocsSandboxValues): LzCardRowImageAspect {
    return this.str(values, 'rowImageAspectMd', '3/2') as LzCardRowImageAspect;
  }

  protected metrics(values: DocsSandboxValues): Record<string, unknown> | undefined {
    return this.bool(values, 'metricsType') ? SAMPLE_METRICS : undefined;
  }

  protected onWatchLater(): void {
    this.isWatchLater.update((value) => !value);
  }

  protected onSaveToList(): void {
    this.isSavedToList.update((value) => !value);
  }
}
