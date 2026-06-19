# CLAUDE.md

Project instructions for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).
Inherits global protocols from `~/.claude/CLAUDE.md` (output style, twelve-factor, Pike's rules).

## What this is

`www.andysamwedding.com` — Andy & Sam's wedding site. Started as an RSVP gate;
becoming the digital invitation. Static site, no build step, hosted on GitHub
Pages (custom domain via `CNAME`). Search-indexing disabled (`robots.txt`,
`noindex` meta).

## Architecture

- **Static only.** Hand-written HTML/CSS/vanilla JS. No bundler, no framework,
  no `package.json`. Edit files directly; open in a browser to test.
- **Auth gate** (`/index.html`, `/index.js`): visitor submits the bride or
  groom's last name. `index.js` POSTs the form to a Google Apps Script Web App
  (`script.google.com/macros/.../exec`), which returns `{ status, token,
  redirect, message }`. Token + redirect persisted in `localStorage`; matching
  visitors are bounced straight to their redirect on load.
- **Pages** (`home/`, `rsvp/`, `schedule/`, `travel/`, `faq/`): each a
  self-contained `index.html` + `styles.css` (+ `index.js` where interactive),
  gated by the inline token guard. `rsvp/` takes a member's last name, shows a
  party picker when several parties share it, and submits attendance to the API
  (`rsvp/index.js`, with pure helpers in `rsvp/party.js`).
- **Shared chrome**: the brass radio-dial nav is rendered by `radio-nav.js` (ES
  module; tuning math in `radio-math.js` — knob drag navigates, the mobile knob
  toggles a vertical menu). `site.js` is just the `aria-invalid` validation
  bridge. The art-deco parchment card is `.deco-card` (`styles/card.css`),
  reused by the gate, RSVP, and content pages.
- **Backend is the Apps Script**, not in this repo. Verb is passed as a hidden
  `VERB` form field (`POST` login, `GUESTS` guest-list fetch, `PUT` rsvp).

## Styling

- Shared tokens/resets in `styles/`: `root.css` (CSS custom props — brass/ink
  colors, fluid font sizes; wood background; `@view-transition` opt-in),
  `modern-normalize.css`, `nav.css` (radio dial + knob menu), `card.css`
  (`.deco-card`), plus `@font-face` files for the custom webfonts in `fonts/`
  (decomanghold, dream_orphans, lucian_schoenschrift, nickerbocker, contralto).
- Page `styles.css` files `@import "/styles/root.css"` then add page rules.
- Fluid type uses `clamp()`. `scaling.txt` is the cheatsheet for deriving the
  slope/intercept of a `clamp(min, intercept + slopevw, max)` expression — use
  it when adding responsive font sizes.

## Conventions

- Absolute root-relative paths for assets (`/styles/...`, `/images/...`) so
  pages work from any subdirectory.
- Keep the no-build, dependency-free nature unless there's a strong reason.
- `postmodern_jukebox/` is a retained legacy directory — keep it in place; do
  not flag it for removal. (The old `thankyou/` page was removed.)
- **Browser support:** target Baseline Widely Available features; use them
  without polyfills. Baseline Newly Available / limited-availability features
  (e.g. cross-document View Transitions) are fine only as progressive
  enhancements that degrade gracefully — no JS polyfills, no external deps.

## Task tracking — use beans, not TodoWrite

This project tracks work with **beans** (markdown-backed issue tracker, CLI on
PATH). Use it instead of TodoWrite / ad-hoc todo lists for all work tracking.

- Before a task: find or create a bean —
  `beans create "Title" -t <task|feature|bug|epic|milestone> -d "..." -s in-progress`
- During: keep its `- [ ]` todo items checked off as you go.
- After: only mark `-s completed` once no unchecked items remain; add a
  `## Summary of Changes` section. Commit bean file(s) alongside code.
- Find work: `beans list --json --ready`. Inspect: `beans show --json <id>`.
- Full reference: run `beans prime`.
