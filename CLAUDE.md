# worm.bas

A browser port of WORM.BAS from the Zenith Z-100, running a BASIC interpreter in JavaScript.

## Deployment

Production: https://worm-bas.pages.dev/
Hosted on Cloudflare Pages, auto-deploys from the main branch.

## Structure

- `index.html` — entry point, CSS, touch controls, game bootstrap
- `worm.js` — BASIC interpreter, Z-100 font ROM, Screen class, WORM.BAS source
- `dist/` — copy of index.html + worm.js (keep in sync)
