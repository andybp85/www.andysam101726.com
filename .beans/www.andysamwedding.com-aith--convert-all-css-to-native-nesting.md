---
# www.andysamwedding.com-aith
title: Convert all CSS to native nesting
status: completed
type: task
priority: normal
created_at: 2026-06-22T01:56:47Z
updated_at: 2026-06-22T02:07:14Z
parent: www.andysamwedding.com-wbpd
---

Refactor hand-written flat CSS to use native CSS nesting (Baseline Widely Available). No behavior change; verify with headless screenshots.

## Summary of Changes

Converted all hand-written flat CSS to native CSS nesting (Baseline Widely Available; already in use in `schedule/styles.css` and `styles.css`).

**Converted:**
- `styles/nav.css` — folded the `@media (max-width: 700px)` block into each selector (no more duplicated `#radio`/`#knob`/`#dial`/`#station-menu` declarations); pseudo-elements/states nested under their parents; `body.menu-open #X` rewritten as `body.menu-open &`.
- `styles/root.css` — `body`/`h1`/`.title-break` media nested; `.no-card a` hover/focus nested.
- `styles/card.css` — all `.deco-card` descendants/states/pseudos nested under the base rule.
- `home/styles.css` — `.hero`/`.details` children + per-element media nested.
- `rsvp/styles.css` — inputs/checkboxes/states/placeholders nested under `.member`/`.guest-flag`/`.party-pick`/`#last`.

**Unchanged:** `schedule/styles.css`, `styles.css` (already nested); `faq/`, `travel/` (flat single-element rules); font-face files + vendored `modern-normalize.css` (nothing to nest).

**Verification:** headless-Chrome screenshots of all pages (gate, home, rsvp, schedule, travel, faq) at desktop (1280) and mobile (430), before (flat) vs after (nested) — all **pixel-identical**. Mobile drawer open state also diffed (ImageMagick AE=0). Pure syntactic refactor, zero behavior change.
