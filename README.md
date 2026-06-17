# Andy &amp; Sam's Wedding

Source for [www.andysamwedding.com](https://www.andysamwedding.com) — a static
wedding site. Began as an RSVP gate; evolving into the digital invitation.

## Stack

Hand-written HTML/CSS/vanilla JS. No build step, no dependencies. Hosted on
GitHub Pages with a custom domain (`CNAME`); not search-indexed (`robots.txt`,
`noindex`).

## How it works

1. **Login** (`index.html` / `index.js`) — visitor enters the bride or groom's
   last name. The form POSTs to a Google Apps Script Web App, which returns a
   token and a redirect URL. Both are stored in `localStorage`; returning
   visitors skip straight to their redirect.
2. **Save the date** (`savethedate/`) — RSVP form (attending yes/no, email,
   name). PUTs to the same Apps Script.
3. **Thank you** (`thankyou/`) and **Postmodern Jukebox** (`postmodern_jukebox/`)
   — additional content pages.

The backend (the Apps Script) lives outside this repo. The HTTP verb is sent as
a hidden `VERB` form field (`POST` to log in, `PUT` to RSVP).

## Layout

```
index.html, index.js, styles.css   Login gate
savethedate/                        RSVP form
thankyou/  postmodern_jukebox/      Content pages
styles/                             Shared CSS (root tokens, normalize, fonts)
fonts/  images/                     Assets
scaling.txt                         clamp() fluid-type cheatsheet
CNAME  robots.txt  site.webmanifest GitHub Pages / PWA config
```

## Development

No tooling required — edit files and open them in a browser. To exercise the
auth/RSVP flow against the live Apps Script, serve the directory over HTTP, e.g.:

```bash
python3 -m http.server 8000
```

then visit <http://localhost:8000>.

## Working in this repo

Issues are tracked with [beans](https://github.com/) (`beans list`, `beans tui`).
Agent conventions and architecture notes live in `CLAUDE.md`.
