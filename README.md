# Andy & Sam's Wedding

Source for [www.andysamwedding.com](https://www.andysamwedding.com) — a static
wedding site. Began as an RSVP gate; now the full digital invitation.

## Stack

Hand-written HTML/CSS/vanilla JS. No build step, no dependencies. Hosted on
GitHub Pages with a custom domain (`CNAME`); not search-indexed (`robots.txt`,
`noindex`).

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
| `/home/` | Wedding overview, hero image, RSVP call-to-action |
| `/rsvp/` | Party RSVP — looks up the guest's party, collects attendance for each member plus open slots, submits to the API |
| `/schedule/` | Weekend schedule (Fri 10/16 – Sun 10/18 2026) |
| `/travel/` | Hotel blocks, travel info |
| `/faq/` | Frequently asked questions |

Every page includes a token guard (inline `<script>` in `<head>`) that
redirects unauthenticated visitors back to `/`. Shared nav is injected by
`/site.js`.

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
index.html, index.js, styles.css   Login gate
home/  rsvp/  schedule/            Content pages
travel/  faq/                      Content pages (cont.)
site.js                            Shared nav + token guard helpers
styles/                            Shared CSS (root tokens, normalize, fonts)
fonts/  images/                    Assets
tools/gen-guests.mjs               Guest-list CSV → guests.gs generator
scaling.txt                        clamp() fluid-type cheatsheet
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

## Working in this repo

Issues are tracked with [beans](https://github.com/) (`beans list`, `beans tui`).
Agent conventions and architecture notes live in `CLAUDE.md`.
