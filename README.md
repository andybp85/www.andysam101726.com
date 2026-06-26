# Andy & Sam's Wedding

Source for [www.andysamwedding.com](https://www.andysamwedding.com) — a static
wedding site. Began as an RSVP gate; now the full digital invitation.

## Stack

Hand-written HTML/CSS/vanilla JS. No build step, no dependencies. Hosted on
GitHub Pages with a custom domain (`CNAME`); not search-indexed (`robots.txt`,
`noindex`).

The visual system is an antique-radio cabinet: a dark wood background fading to
black, a brass tuning-dial nav (a knob-activated vertical menu on mobile), and
art-deco parchment "deco cards" (`styles/card.css`) shared by the gate, RSVP,
and content pages. Same-origin navigations use cross-document View Transitions
as a progressive enhancement (instant nav where unsupported).

## How it works

### Auth gate (`/`)

`index.html` / `index.js` — visitor enters the bride or groom's last name. The
form POSTs (hidden `VERB=POST` field) to a Google Apps Script Web App, which
returns `{ status, token, redirect, message }`. The token and redirect
(`/home/`) are stored in `localStorage`; returning visitors skip straight to
their redirect.

### Pages

| Path | Content |
|------|---------|
| `/home/` | Wedding overview, B&W engagement photos (responsive `<picture>`), RSVP call-to-action |
| `/rsvp/` | Party RSVP — visitor enters a member's last name (a picker disambiguates when several parties share it), then sets attendance for each member plus open guest slots, and submits to the API |
| `/schedule/` | Weekend schedule (Fri 10/16 – Sun 10/18 2026) |
| `/travel/` | Hotel blocks, travel info |
| `/faq/` | Frequently asked questions |

Every page includes a token guard (inline `<script>` in `<head>`) that
redirects unauthenticated visitors back to `/`. The radio-dial nav is rendered
by `/radio-nav.js` (an ES module; the tuning geometry lives in `radio-math.js`),
and `/site.js` provides the `aria-invalid` validation bridge.

### API contract (Apps Script Web App)

All requests send a `VERB` field:

| `VERB` | Auth | Purpose | Response |
|--------|------|---------|----------|
| `POST` | none (last name) | Login | `{ status, token, redirect, message }` |
| `GUESTS` | `token` field | Fetch full guest list for party lookup | `{ status, guests: { "<group>": [{ first, last, slot }] } }` |
| `PUT` | `token` field | Submit party RSVP | `{ status }` |

`PUT` body includes a `responses` field — JSON array of
`[{ first, last, attending, isGuest }]` objects (one per party member/slot).

The RSVP page uses **optimistic writes**: the "Thank you" UI is shown
immediately on submit; the API call runs in the background. Guest data is
**prefetched** after login and cached in `sessionStorage` so `/rsvp/` loads
instantly.

### Guest-list generator

`tools/gen-guests.mjs` — reads `new_design/RSVP_list.csv` and regenerates
`guests.gs` (the hardcoded guest array pasted into the Apps Script). Run with:

```bash
node tools/gen-guests.mjs
```

## Layout

```
index.html, index.js, styles.css   Login gate (art-deco deco card)
home/  rsvp/  schedule/            Content pages
travel/  faq/                      Content pages (cont.)
radio-nav.js                       Radio-dial nav renderer + knob interaction (ES module)
radio-math.js                      Pure tuning-angle math for the knob (ES module, node-testable)
rsvp/party.js                      Pure party-lookup helpers (ES module, node-testable)
site.js                            aria-invalid validation bridge
styles/                            Shared CSS (root tokens, normalize, fonts, nav.css, card.css)
fonts/  images/                    Assets
tools/gen-guests.mjs               Guest-list CSV → guests.gs generator
scaling.txt                        clamp() fluid-type cheatsheet
tests/                             Unit tests (node:test) for the pure modules
package.json                       Dev-only: marks .js as ESM + `npm test` (no deps)
CNAME  robots.txt  site.webmanifest GitHub Pages / PWA config
```

## Development

No tooling required — edit files and open them in a browser. To exercise the
auth/RSVP flow against the live Apps Script, serve the directory over HTTP:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>. Clear site data in DevTools between test
runs to reset `localStorage` state.

## Testing

Unit tests cover the pure logic — `rsvp/party.js`, `radio-math.js`, and
`api.js` — with Node's built-in test runner (`node:test`). No dependencies, no
install:

```bash
npm test          # or: node --test 'tests/**/*.test.js'
```

The minimal `package.json` exists only to mark the `.js` sources as ES modules
for Node and to hold the `test` script — it carries no dependencies and is not
deployed (it sits outside `deploy.sh`'s file list). DOM-driven modules
(`index.js`, `rsvp/index.js`, `radio-nav.js`) are better exercised in a real
browser with Playwright than unit-tested.

## Working in this repo

Issues are tracked with [beans](https://github.com/) (`beans list`, `beans tui`).
Agent conventions and architecture notes live in `CLAUDE.md`.
