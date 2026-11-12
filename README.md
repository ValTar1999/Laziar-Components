# Laziar Components

The shared Angular UI library for the Laziar apps, `@laziar/components`, together with the docs site that shows every component.

| Part         | Where                                        | What it is                                             |
| ------------ | -------------------------------------------- | ------------------------------------------------------ |
| Library      | [`projects/components`](projects/components) | The published package: components, theme tokens, icons |
| Docs site    | [`projects/docs`](projects/docs)             | A page per component with live examples and its inputs |
| Claude tools | [`claude/plugins`](claude/plugins)           | The `laziar-dev` plugin used across the Laziar repos   |

To **use** the library in an app (registry setup, install, theme styles), see the [library README](projects/components/README.md).

## Getting started

You need Node 22 and npm.

```bash
npm ci
npm start          # docs site on http://localhost:4200
```

## Commands

| Command                | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm start`            | Serves the docs site and rebuilds on change               |
| `npm run build:lib`    | Builds the library into `dist/components`                 |
| `npm run build:docs`   | Builds the docs site into `dist/docs`                     |
| `npm run test:ci`      | Runs the library and docs tests once, in headless Chrome  |
| `npm test`             | Runs the tests in watch mode                              |
| `npm run lint`         | Lints both projects, including template accessibility     |
| `npm run format`       | Formats the repo with Prettier                            |
| `npm run format:check` | Fails if anything is not formatted; CI runs this          |

A pre-commit hook lints and formats the files you staged.

## Making a change

1. Branch from the latest `main`.
2. Change the component under `projects/components/src/lib/<component>/`, with a test beside it.
3. Document new inputs and examples on the component's docs page, `projects/docs/src/app/pages/component-host/<component>.meta.ts`.
4. Run `npm run lint`, `npm run test:ci` and `npm run build:lib`.
5. Open a merge request against `main`.

[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) has the full checklist for adding a component, and [docs/THEMING.md](docs/THEMING.md) lists the design tokens and the rules for styles.

## Releases

Merging to `main` on GitLab publishes the library to the project's package registry as `0.1.<pipeline number>`. Do not publish by hand and do not edit the version in `projects/components/package.json`.

The docs site is deployed to GitHub Pages from the `master` branch of the GitHub mirror.

## Repositories

- **GitLab** — `gitlab.agora.md/laziar/frontend-components`. The source of truth: merge requests, CI and publishing happen here.
- **GitHub** — `ValTar1999/Laziar-Components`. A mirror that hosts the docs site.
