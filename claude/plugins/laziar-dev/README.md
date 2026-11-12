# laziar-dev

A Claude Code plugin for the Laziar frontend projects (ADS portal, LAZIAR Frontend, Publikator, Frontend Components).

## What it does

- **Checks before Claude finishes.** When code changed during a Claude Code turn, the project's lint and tests run before Claude may finish. A failure goes back to Claude to fix. Questions and other turns that change no code run nothing. After three failed attempts in a row Claude may stop, and is told to report the failure.
- **Skills, loaded automatically when a task matches:**
  - `laziar-library-change`: changing `@laziar/components` and getting the change into an app.
  - `laziar-browser-check`: seeing a UI change in the real app with mocked API data.
  - `gitlab-merge-without-widget`: merging an MR with push options when its GitLab page does not load.

## Install (once per person, per project)

The project's `.claude/settings.json` already registers the `laziar` marketplace and enables the plugin. Each person installs it once:

```
claude plugin install laziar-dev@laziar --scope project
```

or in Claude Code: `/plugin`, then install `laziar-dev` from the `laziar` marketplace. Claude Code fetches it from `https://gitlab.agora.md/laziar/frontend-components.git` with your stored git credentials, so `git clone` of that repository must work without a password prompt.

## Configure a project

The checks are per project, in `.claude/laziar-checks.json` at the repository root. Without it the hook does nothing.

```json
{
  "watch": ["src/", "package.json"],
  "checks": [
    { "name": "lint", "command": "npx eslint {files}", "extensions": [".ts", ".html"] },
    { "name": "tests", "command": "npx ng test --watch=false", "timeoutSeconds": 600 }
  ]
}
```

- `watch`: paths whose changes trigger the checks.
- `{files}`: replaced by the watched files changed since the session began, committed or not, filtered by `extensions`. A check with `{files}` and no matching file is skipped. Lint this way covers this session's work only, so old problems elsewhere do not block it.
- `timeoutSeconds`: per check, default 900.

The commands run from the repository root (with an upper-case drive letter on Windows) with `CI=1`.

## Change the plugin

Edit `claude/plugins/laziar-dev/` in `laziar/frontend-components` and merge to `main`. With `autoUpdate` on, Claude Code picks it up on its own; `claude plugin marketplace update laziar` fetches it at once.
