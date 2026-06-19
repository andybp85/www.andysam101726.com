# Radio Front-End Redesign — Design Spec

**Date:** 2026-06-18
**Status:** Approved (brainstorming), pending implementation plan
**Branch:** `claude`

## Goal

Re-skin the wedding site into a cohesive **antique-radio** aesthetic from the
mockups in `new_design/assets_and_mockups/`: a dark wood cabinet fading to
black, a brass **tuning-dial** nav on desktop and a **knob-activated vertical
station selector** on mobile, art-deco parchment cards for the gate + RSVP
flow, and the two B&W engagement photos as the home content.

The site stays **static, no-build, dependency-free** and **non-SPA**. The
existing localStorage gate, `site.js` nav-injection pattern, and the deployed
RSVP API are preserved; this is a visual + navigation redesign layered on the
current behavior.

## Design Assets (reference, not shipped)

In `new_design/assets_and_mockups/` (gitignored; reference only):

- `full_page_updated_with_knob_desktop.svg` — desktop page shell: title,
  horizontal brass tuning dial, knob at left, red needle on current station,
  wood→black gradient background.
- `full_page_updated_with_knob_mobile.svg` — mobile shell: title, MENU knob,
  vertical station selector with red arrow on current station.
- `knob_menu_notch.svg` — knob + MENU notch/arrow assets.
- `updated_vertical_menu.svg` — the vertical station selector (mobile menu).
- `password_page.svg` — gate form, deco parchment card.
- `rsvp_page_1.svg` / `rsvp_page_2.svg` / `rsvp_page_3.svg` — RSVP find-party /
  form / thank-you.
- `Sam+Andy-ES-11.16.25-98.jpg` — landscape engagement photo (desktop home).
- `Sam+Andy-ES-11.16.25-96.jpg` — portrait engagement photo (mobile home).

## Key Decisions

1. **Navigation: separate pages + View Transitions + sync-on-load.** No SPA, no
   iframe. Stations are real `<a>` links (work with no JS); the knob and the
   cross-document View Transitions (already enabled in `root.css`) are pure
   enhancement that make real navigations *feel* like continuous tuning.
2. **Duplicate last names: party picker by member first names.** When a
   last-name lookup matches multiple parties, show selectable cards labeled with
   each party's member first names. Pure frontend — the client already loads the
   full guest map. Closes bean `nq7u`.
3. **One plan, staged tasks.** A single coherent design built in sequence
   (shell → gate → RSVP → home → content), reviewed as stages land, merged when
   complete.
4. **One reusable deco-card component** for gate + RSVP + content pages.

## Architecture

### Shared chrome

Rendered on every in-app page (home/rsvp/schedule/travel/faq) following the
current `site.js` → `#site-nav` injection pattern. Components:

- **Background** (`styles/root.css`): existing wood `image-set()` (AVIF/WebP)
  with a `linear-gradient(to bottom, transparent → #000)` layered on top for
  the cabinet-fading-to-black effect.
- **Title:** "Andy & Sam's Wedding" in lucian_schoenschrift, brass gradient
  fill via `linear-gradient` + `background-clip: text`, top-center.
- **Desktop nav — tuning dial:** brass plaque with the five stations laid out
  along the dial, geometry traced precisely from
  `full_page_updated_with_knob_desktop.svg`; a red needle marks the current
  page; the knob sits to its left.
- **Mobile nav — knob menu:** title, then the brass MENU knob (non-rotating);
  tapping toggles the vertical station selector (`updated_vertical_menu.svg`
  styling) with the red arrow on the current page. Hidden by default.

### Navigation mechanism

- **Stations are `<a>` links.** Keyboard-accessible; functional with JS
  disabled (progressive enhancement baseline).
- **Desktop knob** — pointer-drag rotation layered on top. Dragging rotates the
  knob and moves the needle to the nearest station; on pointer release, if the
  targeted station differs from the current page, the corresponding link's
  navigation fires. Navigation is a normal `location` change (one navigation per
  release, never per station crossed). Clicking a station label also navigates.
- **View Transitions** — already enabled behind `prefers-reduced-motion`. The
  persistent chrome (title/dial/knob) gets a `view-transition-name` so the VT
  morphs it in place while only the screen content cross-fades — this sells the
  continuous-tuning feel. Falls back to instant nav where VT is unsupported
  (e.g. Firefox).
- **Sync-on-load** — on every page load, JS reads `location.pathname`, resolves
  the current station, and snaps the knob angle + needle/arrow to it (no
  animation).
- **Mobile knob** — toggles the menu open/closed; no rotation, no drag.

### Deco-card component

The art-deco parchment card (cream background, double-line border with corner
flourishes) used by gate + RSVP + content pages. The deco frame is extracted
from the mockup SVGs into **one** reusable optimized SVG, applied via
`border-image` (or a positioned background) so all cards share one source of
truth and match exactly.

### Pages

- **Gate (`/index.html`):** deco card, "Please enter the last name of the bride
  or groom.", underlined input, "submit". Existing gate JS/flow preserved;
  restyled. Real HTML text in Contralto fixes the mockup's kerning artifact.
- **RSVP (`/rsvp/`), three steps over the existing `rsvp/index.js` logic:**
  1. **Find party (`rsvp_page_1`):** intro copy + "RSVP deadline is September
     26, 2026" + last-name field + continue. On submit, find matching parties;
     if more than one shares the last name, show picker cards labeled by member
     first names; visitor selects theirs.
  2. **Form (`rsvp_page_2`):** "RSVP" title; each member with attending / not
     attending (mutually exclusive → radio semantics styled as the deco
     checkboxes; "not atending" typo corrected to "not attending"); "Guest:"
     fill-in line for guest slots; submit → existing PUT.
  3. **Thank you (`rsvp_page_3`):** "Thank you for your RSVP! If you need to
     change your response, the deadline to do so is September 26, 2026."
- **Home (`/home/`):** title + chrome, then the engagement photo as main
  content — landscape `…-98` on desktop, portrait `…-96` on mobile, via
  `<picture>` with a `media` source. Photos optimized to responsive WebP/AVIF,
  dimensions set, `fetchpriority="high"` (LCP).
- **Content pages (`/schedule/`, `/travel/`, `/faq/`):** no mockups; inherit
  the shell + the same deco card. Styling only; TBD copy is tracked separately
  (`vivt`).

## Asset Pipeline

- **SVG sub-asset extraction** (one-time): pull standalone optimized SVGs into
  `/images/` — knob (brass), dial plaque, deco card frame/corners, red needle
  (desktop), red arrow + MENU notch (mobile). The full-page mockup SVGs are
  never shipped.
- **Photos:** optimize the two JPGs → responsive WebP/AVIF at sensible widths
  via the existing `rsvg-convert`/`cwebp`/`avifenc` tooling; originals stay in
  `new_design/`.
- **Brass/gold lettering:** CSS `linear-gradient` + `background-clip: text`; no
  image text (stays crisp and accessible).

## Fonts

- **Have:** lucian_schoenschrift (title), Nickerbocker (nav/dial labels —
  "match exactly" is satisfied), one Contralto weight.
- **Gap — Contralto Light / DemiBold / BoldItalic:** the form text uses three
  Contralto weights; only one ships today. Resolve before the RSVP/gate stage:
  either (a) source the weight files and wire `@font-face` per weight, or
  (b) approximate with the single Contralto + CSS `font-weight`/`font-style`,
  accepting minor drift on form text. Nav fidelity is unaffected.

## Implementation Staging (for the plan)

1. **Asset prep** — extract SVG sub-assets, optimize photos, wire fonts.
2. **Shell foundation** — gradient background, title, desktop dial + mobile
   knob-menu, knob nav JS (rotate desktop / tap mobile), VT persistent chrome,
   sync-on-load. *(Hardest; trace dial geometry from the desktop SVG.)*
3. **Gate restyle** — deco card.
4. **RSVP flow restyle + multi-party picker** — closes `nq7u`.
5. **Home page** — responsive photos.
6. **Content pages** — deco cards for schedule/travel/faq.
7. **Verify** — responsive + cross-browser (VT fallback, knob on touch vs
   pointer, reduced-motion, no-JS link fallback).

## Testing

No-build static site: per-stage manual browser verification at desktop and
mobile widths, covering no-JS link fallback, reduced-motion, and the VT
fallback path. No test framework is added.

## Constraints & Non-Goals

- Stay static, no-build, dependency-free, non-SPA.
- Preserve the localStorage gate, the `site.js` nav-injection pattern, and the
  deployed RSVP API contract (login/GUESTS/PUT) unchanged.
- Search-indexing stays disabled (`robots.txt`, `noindex`).
- Not in scope: filling TBD content (`vivt`), backend/API changes, the real
  hero-photo swap beyond using the supplied engagement photos.

## Open Items (carried into implementation)

- Contralto weight files vs approximation — **RESOLVED 2026-06-18: approximation.**
  Use the single existing Contralto family + CSS `font-weight`/`font-style`; no
  new weight files are sourced. Minor drift on form text accepted.
- Exact dial geometry — traced from `full_page_updated_with_knob_desktop.svg`
  during stage 2.
