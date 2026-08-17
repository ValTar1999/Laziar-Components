import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

import {
  LzAvatarSizeKey,
  LzAvatarNotificationStatus,
  LzAvatarVariant,
  buildAvatarInitials,
} from './avatar.types';

/**
 * Avatar component for `@laziar/components`.
 * Ported from publikator avatar component.
 */
@Component({
  selector: 'lz-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-avatar-host',
  },
})
export class Avatar {
  readonly firstName = input<string>('');
  readonly lastName = input<string>('');
  readonly imgUrl = input<string | SafeUrl | undefined>(undefined);
  readonly size = input<LzAvatarSizeKey>('sm');
  readonly imgNotification = input<string>('');
  readonly topNotification = input<boolean>(false);
  readonly bottomNotification = input<boolean>(false);
  readonly topNotificationStatus = input<LzAvatarNotificationStatus>('error');
  readonly bottomNotificationStatus = input<LzAvatarNotificationStatus>('info');
  readonly containerClass = input<string>('');
  readonly variant = input<LzAvatarVariant>('default');

  protected readonly initials = computed<string>(() => {
    return buildAvatarInitials(this.firstName(), this.lastName());
  });

  protected readonly showPlaceholder = computed<boolean>(() => {
    return (
      !this.hasImage() &&
      this.firstName().trim().length === 0 &&
      this.lastName().trim().length === 0
    );
  });

  protected readonly hasImage = computed<boolean>(() => {
    const url = this.imgUrl();
    if (url == null) {
      return false;
    }
    return typeof url === 'string' ? url.trim().length > 0 : true;
  });

  protected readonly avatarContainerClass = computed<string>(() => {
    const classes = ['lz-avatar__container', this.containerClass()];

    if (this.shouldApplyDefaultPlaceholderStyles()) {
      classes.push('lz-avatar__container--default-placeholder');
    }

    return classes.filter((value) => value.length > 0).join(' ');
  });

  protected readonly initialsClass = computed<string>(() => {
    return 'lz-avatar__initials';
  });

  protected readonly topNotificationClass = computed<string>(() => {
    return [
      'lz-avatar__notification-wrapper',
      'lz-avatar__notification-wrapper--top',
      'lz-avatar__notification',
      `lz-avatar__notification--${this.topNotificationStatus()}`,
    ].join(' ');
  });

  protected readonly bottomNotificationClass = computed<string>(() => {
    return [
      'lz-avatar__notification-wrapper',
      'lz-avatar__notification-wrapper--bottom',
      'lz-avatar__notification',
      `lz-avatar__notification--${this.bottomNotificationStatus()}`,
    ].join(' ');
  });

  protected readonly imgNotificationClass = computed<string>(() => {
    return 'lz-avatar__img-notification';
  });

  protected readonly imageAlt = computed<string>(() => {
    return `${this.firstName()} ${this.lastName()}`.trim();
  });

  private shouldApplyDefaultPlaceholderStyles(): boolean {
    return !this.hasImage() && this.variant() === 'default';
  }
}
