import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MessageChatTheme } from './message-chat.types';

@Component({
  selector: 'lz-message-chat',
  standalone: true,
  templateUrl: './message-chat.component.html',
  styleUrl: './message-chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'lz-message-chat-host' },
})
export class MessageChat {
  readonly text = input('');
  readonly time = input('');
  readonly theme = input<MessageChatTheme>('light');
  readonly hasOnlyText = input(true, { transform: booleanAttribute });

  protected isSingleLine = false;
  protected isReady = false;

  private readonly textElement = viewChild<ElementRef<HTMLElement>>('textElement');
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);
  private animationFrameId?: number;

  constructor() {
    effect(() => {
      this.text();
      this.isReady = false;
      afterNextRender(() => this.checkTextLines());
    });
  }

  protected getRoundedStyle(): 'pill' | 'rounded' {
    return this.hasOnlyText() && this.isSingleLine ? 'pill' : 'rounded';
  }

  protected processTextWithLinks(): SafeHtml {
    const text = this.text();
    if (!text) return '';

    const urlRegex =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/g;
    const linkClass =
      this.theme() === 'dark'
        ? 'lz-message-chat__link lz-message-chat__link--dark'
        : 'lz-message-chat__link';
    let linkedText = '';
    let cursor = 0;
    for (const match of text.matchAll(urlRegex)) {
      const url = match[0];
      const index = match.index ?? 0;
      linkedText += this.escapeHtml(text.slice(cursor, index)).replace(/\r\n|\n|\r/g, '<br>');
      const href = url.startsWith('http') ? url : `https://${url}`;
      linkedText += `<a href="${this.escapeAttribute(href)}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${this.escapeHtml(url)}</a>`;
      cursor = index + url.length;
    }
    linkedText += this.escapeHtml(text.slice(cursor)).replace(/\r\n|\n|\r/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(linkedText);
  }

  private checkTextLines(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.animationFrameId ?? 0);
    this.animationFrameId = requestAnimationFrame(() => {
      const element = this.textElement()?.nativeElement;
      if (!element) return;
      const lineHeight = Number.parseFloat(window.getComputedStyle(element).lineHeight);
      this.isSingleLine = element.offsetHeight <= lineHeight;
      this.isReady = true;
    });
  }

  private escapeHtml(value: string): string {
    return value.replace(
      /[&<>"']/g,
      (character) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[character]!,
    );
  }

  private escapeAttribute(value: string): string {
    return this.escapeHtml(value);
  }
}
