export type LzAvatarSizeKey =
  'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'xxl';

/** `neutral` — Figma notification (gray-900), `success` — Figma status (green + check). */
export type LzAvatarNotificationStatus = 'neutral' | 'success' | 'error' | 'warning' | 'info';

export type LzAvatarVariant = 'default' | 'plain';

/** Two-letter fallback when no avatar image: "AGORA" → "AG", "John Doe" → "JD". */
export function buildAvatarInitials(firstName: string, lastName = ''): string {
  const last = lastName.trim();
  if (last.length > 0) {
    const first = firstName.trim();

    return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
  }

  const parts = firstName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}
