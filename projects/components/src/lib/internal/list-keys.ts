/**
 * Arrow-key navigation for a popup list (a menu or a listbox): ArrowDown and
 * ArrowUp move focus to the next and previous item, wrapping at the ends, and
 * Home and End jump to the first and last.
 *
 * Returns true when the key was one of these and focus moved, so the caller
 * can stop there.
 */
export function moveFocusWithKeys(event: KeyboardEvent, items: readonly HTMLElement[]): boolean {
  if (!items.length) return false;

  const current = items.findIndex(
    (item) => item === event.target || item.contains(event.target as Node),
  );
  let next: number;
  switch (event.key) {
    case 'ArrowDown':
      next = current < 0 ? 0 : (current + 1) % items.length;
      break;
    case 'ArrowUp':
      next = current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = items.length - 1;
      break;
    default:
      return false;
  }

  event.preventDefault();
  items[next].focus();
  return true;
}
