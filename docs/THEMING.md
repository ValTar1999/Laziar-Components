# Themization — `@laziar/components`

Design tokens are CSS custom properties with **semantic** names (`--lz-color-primary`, not `--lz-blue`). Values are taken from `docs/analysis/design-audit.md`, preferring shared brand scales and publikator’s standard breakpoints / spacing.

Runtime stylesheet: `projects/components/src/styles/theme.css`  
(published as `@laziar/components/styles/theme.css`)

Sass helpers: `projects/components/src/styles/_mixins.scss`, `_breakpoints.scss`

---

## Quick start

### 1. Import tokens once (app global styles)

```scss
/* styles.scss / styles.css — or list in angular.json "styles" */
@import '@laziar/components/styles/theme.css';
/* workspace source: projects/components/src/styles/theme.css */
```

### 2. Wire `ThemeService`

`ThemeService` is `providedIn: 'root'`. On the browser it initializes automatically (reads `localStorage`, sets `data-theme` on `<html>`, listens to `prefers-color-scheme`).

```ts
import { Component, inject } from '@angular/core';
import { ThemeService, LzThemeMode } from '@laziar/components';

@Component({
  /* ... */
})
export class ShellComponent {
  private readonly theme = inject(ThemeService);

  setTheme(mode: LzThemeMode): void {
    this.theme.setMode(mode); // 'light' | 'dark' | 'auto'
  }
}
```

Optional signals: `theme.mode()`, `theme.resolved()`, `theme.isDark()`, `theme.toggleLightDark()`.

Storage key: `lz-theme` (`LZ_THEME_STORAGE_KEY`).

### 3. How themes apply

| Preference | DOM | Styles used |
|------------|-----|-------------|
| `light` | `html[data-theme="light"]` + `data-theme-mode="light"` | Light `:root` / `[data-theme="light"]` |
| `dark` | `html[data-theme="dark"]` + `data-theme-mode="dark"` | `[data-theme="dark"]` overrides |
| `auto` | `html[data-theme="light\|dark"]` (resolved) + `data-theme-mode="auto"` | Same as light/dark; preference stays in `mode` / storage |

`ThemeService` writes the **resolved** theme to `data-theme` so components only need `[data-theme="dark"]` (no duplicated `@media` / `auto` host styles). The user preference is kept on `data-theme-mode` and in `localStorage`.

Components must use **only** `var(--lz-*)` in styles — never raw hex/rgb.

### 4. Override tokens in a host app

```css
:root {
  --lz-color-primary-500: #c40000;
  --lz-color-primary: var(--lz-color-primary-500);
  --lz-font-sans: 'Inter', system-ui, sans-serif;
}

[data-theme='dark'] {
  --lz-color-background: #0a0a0a;
}
```

Overrides cascade normally; keep semantic names.

### 5. Sass mixins (library / advanced apps)

```scss
@use '@laziar/components/styles' as lz;
// or relative: @use '../styles/mixins' as lz;

.card {
  @include lz.lz-surface($elevated: true);
  @include lz.lz-text(sm);
  padding: var(--lz-space-4);

  @include lz.lz-media-up(md) {
    padding: var(--lz-space-6);
  }
}
```

---

## Token reference

Defaults below: **Light** / **Dark** (dark = `[data-theme="dark"]` and system-auto dark).

### Palette — primary (brand red)

| Token | Description | Light | Dark |
|-------|-------------|-------|------|
| `--lz-color-primary` | Main primary (alias of 500) | `#d50b0b` | `#ec3131` |
| `--lz-color-primary-surface` | Tinted surface | `#fff5f5` | `#2a0303` |
| `--lz-color-primary-50` | Lightest | `#ffebeb` | `#140304` |
| `--lz-color-primary-100` | | `#ffd6d6` | `#2a0303` |
| `--lz-color-primary-200` | | `#ffa8a8` | `#570303` |
| `--lz-color-primary-300` | | `#ff5c5c` | `#880707` |
| `--lz-color-primary-400` | | `#ec3131` | `#d50b0b` |
| `--lz-color-primary-500` | Base | `#d50b0b` | `#ec3131` |
| `--lz-color-primary-600` | | `#880707` | `#ff5c5c` |
| `--lz-color-primary-700` | | `#570303` | `#ffa8a8` |
| `--lz-color-primary-800` | | `#2a0303` | `#ffd6d6` |
| `--lz-color-primary-900` | Darkest | `#140304` | `#ffebeb` |

### Palette — secondary (blue)

| Token | Description | Light | Dark |
|-------|-------------|-------|------|
| `--lz-color-secondary` | Main secondary | `#0d56e7` | `#2277f7` |
| `--lz-color-secondary-surface` | | `#f5f9ff` | `#000f38` |
| `--lz-color-secondary-50` | | `#ebf3ff` | `#000614` |
| `--lz-color-secondary-100` | | `#d4e5fe` | `#000f38` |
| `--lz-color-secondary-200` | | `#84b4fb` | `#002a69` |
| `--lz-color-secondary-300` | | `#4d93fc` | `#003ab2` |
| `--lz-color-secondary-400` | | `#2277f7` | `#0d56e7` |
| `--lz-color-secondary-500` | | `#0d56e7` | `#2277f7` |
| `--lz-color-secondary-600` | | `#003ab2` | `#4d93fc` |
| `--lz-color-secondary-700` | | `#002a69` | `#84b4fb` |
| `--lz-color-secondary-800` | | `#000f38` | `#d4e5fe` |
| `--lz-color-secondary-900` | | `#000614` | `#ebf3ff` |

### Palette — success (green)

| Token | Description | Light | Dark |
|-------|-------------|-------|------|
| `--lz-color-success` | | `#20882e` | `#3cc14e` |
| `--lz-color-success-surface` | | `#f6fef6` | `#051f06` |
| `--lz-color-success-50` | | `#edfeed` | `#061406` |
| `--lz-color-success-100` | | `#d7f9d7` | `#051f06` |
| `--lz-color-success-200` | | `#a6f0a5` | `#0c310d` |
| `--lz-color-success-300` | | `#50dd63` | `#1b561a` |
| `--lz-color-success-400` | | `#3cc14e` | `#20882e` |
| `--lz-color-success-500` | | `#20882e` | `#3cc14e` |
| `--lz-color-success-600` | | `#1b561a` | `#50dd63` |
| `--lz-color-success-700` | | `#0c310d` | `#a6f0a5` |
| `--lz-color-success-800` | | `#051f06` | `#d7f9d7` |
| `--lz-color-success-900` | | `#061406` | `#edfeed` |

### Palette — warning (yellow)

| Token | Description | Light | Dark |
|-------|-------------|-------|------|
| `--lz-color-warning` | | `#d1a400` | `#f8c716` |
| `--lz-color-warning-surface` | | `#fffdf5` | `#241b00` |
| `--lz-color-warning-50` | | `#fffceb` | `#131001` |
| `--lz-color-warning-100` | | `#fff7cc` | `#241b00` |
| `--lz-color-warning-200` | | `#ffe58a` | `#372906` |
| `--lz-color-warning-300` | | `#fad84c` | `#554406` |
| `--lz-color-warning-400` | | `#f8c716` | `#d1a400` |
| `--lz-color-warning-500` | | `#d1a400` | `#f8c716` |
| `--lz-color-warning-600` | | `#554406` | `#fad84c` |
| `--lz-color-warning-700` | | `#372906` | `#ffe58a` |
| `--lz-color-warning-800` | | `#241b00` | `#fff7cc` |
| `--lz-color-warning-900` | | `#131001` | `#fffceb` |

### Palette — danger

| Token | Description | Light | Dark |
|-------|-------------|-------|------|
| `--lz-color-danger` | Destructive / error | `#d50b0b` | `#ec3131` |
| `--lz-color-danger-surface` … `-900` | Same scale as primary (brand is red) | (see primary) | (see primary) |

### Palette — neutral (gray)

| Token | Description | Light | Dark |
|-------|-------------|-------|------|
| `--lz-color-neutral` | | `#6b6f73` | `#6b6f73` |
| `--lz-color-neutral-surface` | | `#fafafa` | `#1a1b1c` |
| `--lz-color-neutral-50` | | `#f4f5f5` | `#121212` |
| `--lz-color-neutral-100` | | `#e4e6e7` | `#1a1b1c` |
| `--lz-color-neutral-200` | | `#c4c6c8` | `#242628` |
| `--lz-color-neutral-300` | | `#a5a8ab` | `#37393b` |
| `--lz-color-neutral-400` | | `#898d92` | `#4f5255` |
| `--lz-color-neutral-500` | | `#6b6f73` | `#6b6f73` |
| `--lz-color-neutral-600` | | `#4f5255` | `#898d92` |
| `--lz-color-neutral-700` | | `#37393b` | `#a5a8ab` |
| `--lz-color-neutral-800` | | `#242628` | `#c4c6c8` |
| `--lz-color-neutral-900` | | `#121212` | `#f4f5f5` |

### Surfaces & text

| Token | Description | Light | Dark |
|-------|-------------|-------|------|
| `--lz-color-background` | Page canvas (`cFFFFFA` / inverted) | `#fffffa` | `#121212` |
| `--lz-color-surface` | Cards / panels | `#fafafa` | `#1a1b1c` |
| `--lz-color-surface-elevated` | Raised surfaces | `#ffffff` | `#242628` |
| `--lz-color-border` | Default border | `#c4c6c8` | `#37393b` |
| `--lz-color-border-subtle` | Hairline | `#e4e6e7` | `#242628` |
| `--lz-color-text-primary` | Body / titles | `#121212` | `#fffffa` |
| `--lz-color-text-secondary` | Supporting | `#4f5255` | `#c4c6c8` |
| `--lz-color-text-muted` | Hints / placeholders | `#898d92` | `#898d92` |
| `--lz-color-text-inverse` | On filled primary | `#fffffa` | `#121212` |
| `--lz-color-disabled` | Disabled fill (pub gray-900/30) | `color-mix(… neutral-900 30%)` | same pattern |
| `--lz-color-focus-ring` | Focus outline color | mix 10% | mix 20% |

### Spacing

| Token | Description | Value |
|-------|-------------|-------|
| `--lz-space-0` | | `0` |
| `--lz-space-1` | | `0.25rem` (4px) |
| `--lz-space-2` | | `0.5rem` (8px) |
| `--lz-space-2-5` | publikator `2.5` | `0.625rem` (10px) |
| `--lz-space-3` | | `0.75rem` |
| `--lz-space-4` | | `1rem` |
| `--lz-space-5` | | `1.25rem` |
| `--lz-space-6` | | `1.5rem` |
| `--lz-space-8` | | `2rem` |
| `--lz-space-10` | | `2.5rem` |
| `--lz-space-12` | | `3rem` |
| `--lz-space-16` | | `4rem` |
| `--lz-space-18` | shared extend | `4.5rem` |
| `--lz-space-20` | | `5rem` |

(Spacing is theme-invariant.)

### Radii

| Token | Description | Value |
|-------|-------------|-------|
| `--lz-radius-none` | | `0` |
| `--lz-radius-sm` | | `0.25rem` |
| `--lz-radius-md` | `rounded-md` (xs buttons) | `0.375rem` |
| `--lz-radius-lg` | `rounded-lg` / 8px video | `0.5rem` |
| `--lz-radius-xl` | | `0.75rem` |
| `--lz-radius-2xl` | | `1rem` |
| `--lz-radius-full` | Pill | `9999px` |

### Shadows

| Token | Description | Light | Dark |
|-------|-------------|-------|------|
| `--lz-shadow-xs` | Subtle / Tailwind xs | soft neutral | black 35% |
| `--lz-shadow-sm` | | | |
| `--lz-shadow-md` | | | |
| `--lz-shadow-lg` | | | |
| `--lz-shadow-focus` | Ring + offset | uses background + focus-ring | same |
| `--lz-shadow-sticky` | Table sticky edge | pub table shadow | darker |

### Typography

| Token | Description | Value |
|-------|-------------|-------|
| `--lz-font-sans` | UI (Onest) | `'Onest', system-ui, sans-serif` |
| `--lz-font-serif` | Display | `'Lora', 'Bitter', Georgia, serif` |
| `--lz-font-mono` | Code | system mono stack |
| `--lz-font-weight-regular` | | `400` |
| `--lz-font-weight-medium` | | `500` |
| `--lz-font-weight-mediumbold` | | `570` |
| `--lz-font-weight-semibold` | | `600` |
| `--lz-font-weight-bold` | | `700` |
| `--lz-font-size-xs` … `-10xl` | rem scale from frontend | `0.75rem` … `8rem` (+ `3-1xl`, `6-1xl`) |
| `--lz-font-size-s*` | px / content scale from frontend | `s7px` … `s56-l140` |
| `--lz-line-height-*` | paired with fontSize | see `theme.css` |
| `--lz-line-height-tight/snug/normal` | unitless | `1.25` / `1.375` / `1.5` |
| `--lz-letter-spacing-*` | from frontend fontSize | paired tracking |

### Breakpoints (CSS vars for docs/JS; media mixins use the same px)

| Token | Value | Notes |
|-------|-------|-------|
| `--lz-breakpoint-sm` | `640px` | publikator / Tailwind |
| `--lz-breakpoint-md` | `768px` | |
| `--lz-breakpoint-lg` | `1024px` | not agora `dxl` |
| `--lz-breakpoint-xl` | `1280px` | |
| `--lz-breakpoint-2xl` | `1536px` | |

Agora demo breakpoints (`dsm`…) are **out of scope** for the library.

### Motion

| Token | Description | Value |
|-------|-------------|-------|
| `--lz-duration-instant` | | `0ms` |
| `--lz-duration-fast` | inputs | `150ms` |
| `--lz-duration-normal` | buttons (`duration-300`) | `300ms` |
| `--lz-duration-slow` | | `500ms` |
| `--lz-easing-standard` | | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--lz-easing-emphasized` | | `cubic-bezier(0.2, 0, 0, 1)` |

### Z-index

| Token | Description | Value |
|-------|-------------|-------|
| `--lz-z-base` | | `0` |
| `--lz-z-dropdown` | | `1000` |
| `--lz-z-sticky` | | `1100` |
| `--lz-z-overlay` | | `1200` |
| `--lz-z-modal` | | `1300` |
| `--lz-z-toast` | | `1400` |
| `--lz-z-tooltip` | | `1500` |

---

## Rules for component authors

1. Styles may only reference `var(--lz-…)` (or mixins that expand to those vars).
2. No hardcoded `#hex`, `rgb()`, or raw `px` for colors/radii/spacing that exist as tokens.
3. Prefer mixins (`lz-focus-ring`, `lz-transition-colors`, `lz-media-up`) for repeated patterns.
4. Ship new tokens in `theme.css` + document them here before using in components.

---

## Related

- `docs/analysis/design-audit.md` — source comparison
- `docs/DECISIONS.md` — Angular 20 workspace decision
