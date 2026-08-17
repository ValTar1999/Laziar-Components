# @laziar/components

Shared Angular UI library for Laziar (publikator & frontend).

## Install

The package is **not** on [npmjs.org](https://www.npmjs.com). It is published to the **GitLab Package Registry** of [laziar/frontend-components](https://gitlab.agora.md/laziar/frontend-components).

### 1. Configure npm registry

Copy [`.npmrc.example`](../../.npmrc.example) to `.npmrc` in your app (or add the same lines to your user `~/.npmrc`):

```ini
@laziar:registry=https://gitlab.agora.md/api/v4/projects/laziar%2Ffrontend-components/packages/npm/
//gitlab.agora.md/api/v4/projects/laziar%2Ffrontend-components/packages/npm/:_authToken=<your-gitlab-token>
```

Create a GitLab **Personal Access Token** (Preferences → Access Tokens) with scopes `read_api` and `read_registry`, or use a **Deploy Token** with `read_package_registry`.

You must have access to the `laziar/frontend-components` project on GitLab.

### 2. Install the package

```bash
npm install @laziar/components
```

### 3. Include theme styles

```css
@import '@laziar/components/styles/theme.css';
```

`npm install` copies icon sprites into `public/assets/icons` (Angular 17+) or `src/assets/icons`. If that did not run (pnpm without scripts, CI cache, etc.), add this to `angular.json` `architect.build.options.assets`:

```json
{
  "glob": "**/*",
  "input": "node_modules/@laziar/components/assets/icons",
  "output": "assets/icons"
}
```

See [docs/THEMING.md](../../docs/THEMING.md) for tokens and `ThemeService`.

### Angular version

The app must use **Angular 20.3** (`@angular/core`, `common`, `compiler`, `compiler-cli`, `forms`, … all the same minor). Mixing 20.0/20.1 with 20.3, or installing this library via a `file:` **symlink** into another repo, causes:

`TS2551: Property '__@ɵINPUT_SIGNAL_BRAND_WRITE_TYPE@…' does not exist`

That means TypeScript sees two copies of `@angular/core`. Install from the GitLab registry (a real copy in `node_modules`), or for a local `dist/` path add `install-links=true` to `.npmrc` so npm copies the package instead of linking it.

## Development (this monorepo)

```bash
npm ci
npm run build:lib    # output: dist/components
npm test             # Karma
```

## Publish (maintainers)

On every push to `main`, GitLab CI builds and publishes `@laziar/components` as `0.1.<pipeline-id>`.

Manual publish (requires `write_registry` token):

```bash
set GITLAB_NPM_TOKEN=<token>   # Windows
export GITLAB_NPM_TOKEN=<token> # Linux/macOS
npm run publish:lib
```
