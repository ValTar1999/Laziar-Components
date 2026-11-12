---
name: laziar-browser-check
description: How to see a change working in a Laziar Angular app's real UI with mocked API data, using headless Chrome. Use after changing a screen, layout, styles or a user flow in the ADS portal, LAZIAR Frontend, Publikator or the library docs, when asked to check that nothing broke, or before saying a UI change is done.
---

# Checking a Laziar app in the browser

Unit tests prove logic; they do not show a broken layout, an overlay error or a white screen. After a UI change, open the real app and look.

## Run the app against mocked data

1. Start the app with its default configuration on a free port, e.g. `npx ng serve --port 4311`. The default `environment.ts` points the API at a local URL (the ADS portal uses `http://localhost:3000`), which the browser script answers itself, so no backend or sign-in is needed.
2. Drive it with `puppeteer-core` and the installed Chrome (`C:/Program Files/Google/Chrome/Application/chrome.exe` on Windows). Install `puppeteer-core` in a scratch folder, not in the app.
3. In the script:
   - `page.setRequestInterception(true)`: answer requests to the API origin with fixture JSON and CORS headers (`Access-Control-Allow-Origin` set to the app origin, `Access-Control-Allow-Credentials: true`); answer `OPTIONS` with 204; let everything else through.
   - `page.evaluateOnNewDocument` to put the signed-in user and active organization into `localStorage` under the keys the app reads (in the ADS portal: `USER_DATA`, `ACTIVE_ORGANIZATION`).
   - Log `pageerror`, console errors (evaluate the arguments to get the message), and responses with status >= 400.
4. Take screenshots of the pages and states you changed (menus open, dialogs, errors, a phone width such as 390×844), then look at them.

## What to look for

- Angular's red error overlay (NG0xxx / NG8xxx). One that appears right after editing files can be a stale rebuild: reload and check again before treating it as real.
- Console errors. Errors caused by your own fixture data (wrong types) are not app bugs; say which is which.
- Layout against the neighbouring screens: spacing, sizes, the shared components (`lz-*`) rather than native controls.
- Element screenshots of fixed or overlay elements can come out tinted or clipped. Confirm with a full-viewport screenshot before reporting a visual bug.

## After library changes

If the app uses a locally copied library build, clear the app's `.angular/cache/*/<project>/vite` and restart `ng serve` first, or the old library is what you will see.

Report what was checked, what was not (anything needing the real backend: payments, saving to the server), and attach nothing secret.
