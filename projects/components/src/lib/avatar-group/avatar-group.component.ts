import { Component, computed, input } from '@angular/core';
import { LzAvatarGroupItem, LzAvatarGroupSize } from './avatar-group.types';
import { buildAvatarInitials } from '../avatar/avatar.types';

/**
 * Stacked avatar group (`@laziar/components`).
 * Эталон: Laziar System (Figma Avatars) — overlap, cream ring, +N.
 */
@Component({
  selector: 'lz-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrl: './avatar-group.component.scss',
  standalone: true,
  host: {
    class: 'lz-avatar-group-host',
  },
})
export class AvatarGroup {
  readonly avatars = input<LzAvatarGroupItem[]>([]);
  readonly max = input<number>(4);
  readonly size = input<LzAvatarGroupSize>('md');
  readonly reverse = input<boolean>(false);

  protected readonly displayedAvatars = computed(() => this.avatars().slice(0, this.max()));

  protected readonly remainingCount = computed(() =>
    Math.max(this.avatars().length - this.max(), 0),
  );

  protected getAvatarInitials(avatar: LzAvatarGroupItem): string {
    if (this.size() === 'xxs' || this.size() === 'xs') {
      return (avatar.firstName?.[0] || '').toUpperCase();
    }

    return buildAvatarInitials(avatar.firstName, avatar.lastName);
  }
}
