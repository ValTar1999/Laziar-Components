import { Component } from '@angular/core';
import { Avatar } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsOptStr, docsStr } from './docs-page.helpers';
import { AVATAR_COMPONENT_META } from './avatar.meta';

@Component({
  selector: 'docs-avatar-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Avatar],
  templateUrl: './avatar-page.html',
})
export class AvatarPage {
  protected readonly meta = AVATAR_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }

  protected optStr(values: DocsSandboxValues, key: string): string | undefined {
    return docsOptStr(values, key);
  }
}
