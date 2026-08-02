import { Component } from '@angular/core';
import { AvatarGroup, LzAvatarGroupItem } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsNum, docsStr } from './docs-page.helpers';
import { AVATAR_GROUP_COMPONENT_META } from './avatar-group.meta';

@Component({
  selector: 'docs-avatar-group-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, AvatarGroup],
  templateUrl: './avatar-group-page.html',
})
export class AvatarGroupPage {
  protected readonly meta = AVATAR_GROUP_COMPONENT_META;

  protected readonly avatars: LzAvatarGroupItem[] = [
    { firstName: 'Anna', lastName: 'Ivanova' },
    { firstName: 'Boris', lastName: 'Petrov' },
    { firstName: 'Vera', lastName: 'Sidorova' },
    { firstName: 'Gleb', lastName: 'Kozlov' },
    { firstName: 'Daria', lastName: 'Novikova' },
  ];

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }

  protected num(values: DocsSandboxValues, key: string, fallback = 0): number {
    return docsNum(values, key, fallback);
  }
}
