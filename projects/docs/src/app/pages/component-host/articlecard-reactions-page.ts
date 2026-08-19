import { Component } from '@angular/core';
import { ArticlecardReactions } from '@laziar/components';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { ARTICLECARD_REACTIONS_COMPONENT_META } from './articlecard-reactions.meta';

@Component({
  selector: 'docs-articlecard-reactions-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, ArticlecardReactions],
  templateUrl: './articlecard-reactions-page.html',
})
export class ArticlecardReactionsPage {
  protected readonly meta = ARTICLECARD_REACTIONS_COMPONENT_META;
  protected readonly metrics = { '❤️': 12, '🔥': 4, '👏': 3, '😮': 1 };
}
