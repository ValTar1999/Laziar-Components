# Contributing to `@laziar/components`

This guide describes the **reference pattern** established by `lz-button`. Follow it for every new library component.

## Checklist: add a component

### 1. API design

- [ ] Read the pair in `docs/analysis/components-comparison.md` (and detailed inventories if needed).
- [ ] Ship the **unified** surface: all shared inputs/outputs **plus** one-sided features that are safe/optional (a11y, explicit events, etc.).
- [ ] Choose **canonical** input/output names (clear, consistent with the rest of the library).
- [ ] Keep old project names as **`@deprecated` aliases**:
  - Separate `@Input() set oldName(...)` setters (not the primary `input()`).
  - JSDoc: `/** @deprecated Use \`newName\` instead. */`
  - Alias writes into an internal signal / computed that the template reads.
  - Document aliases in the docs page **Deprecated** section (collapsed).
- [ ] Export public types from `button.types.ts`-style modules and re-export via `public-api.ts`.

### 2. Implementation

- [ ] Standalone component, selector `lz-*`, prefix `lz`.
- [ ] Prefer Angular signal `input()` / `output()` for the canonical API.
- [ ] Native interactive element when applicable (`<button>`, `<a>`, `<input>`, …) — do not fake clicks on `<div>`.
- [ ] Accessibility: correct roles/attributes, `aria-*`, `focus-visible`, keyboard behavior of the native control.
- [ ] Host layout via classes / host bindings (`fullWidth`, etc.) without breaking semantics.

### 3. Styles & theming

- [ ] **Only** CSS variables (`var(--lz-…)`) — no raw hex/rgb in component styles.
- [ ] Support light + dark through existing semantic tokens (`theme.css`); add new scales to `:root` **and** dark overrides if needed.
- [ ] Prefer component-scoped tokens (`--lz-button-bg`) that alias semantic ones so hosts can override one component without breaking the system.
- [ ] Use shared SCSS mixins from `styles/_mixins.scss` when helpful (`lz-focus-ring`, `lz-transition-colors`, …).

### 4. Tests

- [ ] Unit specs next to the component (`*.spec.ts`).
- [ ] Cover: default render, **every variant**, **every size** (or parameterized loops), key states (`disabled`, …), outputs/events, a11y attributes, **deprecated aliases**.
- [ ] Prefer querying the **native** control, not only the host.

### 5. Docs site

- [ ] Add a meta object (`*.meta.ts`) conforming to `DocsComponentMeta`.
- [ ] Add a page under `projects/docs/.../component-host/` using `docs-component-page` + `docsPreview`.
- [ ] Register the route name in `component-host-page` `@switch` and in `docs-nav.ts`.
- [ ] Fill all sections: preview, sandbox, synced code, variant gallery (`variant × size`), API tables, examples, component tokens, deprecated block.
- [ ] Sandbox controls must match input kinds (select / boolean / string / number / color).

### 6. Public API & quality gates

- [ ] Export from `projects/components/src/public-api.ts`.
- [ ] `npm run build:lib` and `npm run build:docs` succeed.
- [ ] `npx ng lint` clean.
- [ ] Library unit tests for the new component pass.

### 7. Commit

- [ ] One focused commit (or PR) per component when possible.
- [ ] Message focuses on **why** (e.g. `feat(button): add lz-button as reference component`).

## Reference files

| Concern | Path |
|--------|------|
| Component | `projects/components/src/lib/button/` |
| Tokens | `projects/components/src/styles/theme.css` |
| Docs page | `projects/docs/src/app/pages/component-host/button-page.*` |
| Docs meta | `projects/docs/src/app/pages/component-host/button.meta.ts` |
| Layout template | `projects/docs/src/app/shared/component-page/` |
| Comparison source | `docs/analysis/components-comparison.md` |
| Theming | `docs/THEMING.md` |

## Deprecated alias pattern (copy/paste)

```ts
readonly pill = input(false, { transform: booleanAttribute });
private readonly pillAlias = signal<boolean | undefined>(undefined);

protected readonly resolvedPill = computed(() => this.pillAlias() ?? this.pill());

/**
 * @deprecated Use `pill` instead.
 */
@Input()
set rounded(value: boolean) {
  this.pillAlias.set(value);
}
```

Template/bindings must read `resolvedPill()`, never only the alias or only the canonical input.
