---
name: laziar-library-change
description: How to change @laziar/components (laziar/frontend-components) and get the change into an app. Use whenever a Laziar app (ADS portal, LAZIAR Frontend, Publikator) needs a component, input, variant or style the library lacks, or when editing the library itself, trying unpublished library code in an app, publishing it, or bumping its version in an app.
---

# Changing @laziar/components

**Rule:** when an app needs something the library lacks, change the library, not the app. Do not hand-roll a copy of a component in the app.

## 1. Make the change in the library

- Repo: `laziar/frontend-components` on gitlab.agora.md. Push only to that GitLab remote (in local clones it is often named `gitlab`). An `origin` pointing at GitHub is a personal mirror; do not push there.
- Branch from the latest `main`: `git fetch <gitlab-remote> && git checkout -b feat/<name> <gitlab-remote>/main`.
- Components live in `projects/components/src/lib/<component>/`, docs pages in `projects/docs/src/app/pages/component-host/`.
- A new runtime export must be added to the snapshot in `projects/components/src/public-api.spec.ts`, or the public API test fails.
- Document new inputs, slots and examples in the component's `*.meta.ts` docs page.

## 2. Check it

```
npx ng test components --watch=false --browsers=ChromeHeadlessCI
npx ng test docs --watch=false --browsers=ChromeHeadlessCI
npm run lint
npx ng build components
```

The repo checks out with CRLF; check formatting with `npx prettier --check --end-of-line auto <files>`.

## 3. Try it in an app before it is published

1. `npx ng build components` in the library.
2. Replace the app's copy: delete `node_modules/@laziar/components` in the app and copy the library's `dist/components` there.
3. Delete the app's Vite prebundle, `.angular/cache/<angular version>/<project>/vite`, and restart every running `ng serve` of that app. Otherwise the old library keeps being served; dev servers on different ports share that cache. A white screen after copying is usually this.

The app's CI fails until the version is published and the app depends on it. Do not push app changes that need unpublished library code without saying so.

## 4. Publish

- Merging to library `main` runs the CI `publish` job, which publishes `0.1.<pipeline iid>`. Never publish by hand, and never bump the library's own version.
- Find the new version: `npm view @laziar/components versions --json` in an app (the registry is configured there).

## 5. Bump it in the app

- Use the npm version the app's `packageManager` field names, so the lockfile matches CI, e.g. `npx -y npm@11.6.2 install @laziar/components@^0.1.<n>`.
- Clear the app's Vite cache as in step 3, then run the app's lint, tests and build.
