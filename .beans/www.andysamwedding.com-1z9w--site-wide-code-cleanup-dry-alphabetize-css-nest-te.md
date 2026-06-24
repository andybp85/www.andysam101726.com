---
# www.andysamwedding.com-1z9w
title: 'Site-wide code cleanup: DRY, alphabetize CSS, nest, terse JS, 140col'
status: completed
type: task
priority: normal
created_at: 2026-06-24T12:11:37Z
updated_at: 2026-06-24T12:31:52Z
---

Whole-site format/quality pass per owner spec: DRY (no redundant/vestigial CSS), nest all nestable CSS, alphabetical property order where possible, class/rule order follows DOM order, 140-char lines, 4-space indents, terse JS (optional parens/braces/semicolons only when needed). Verify zero visual regression via before/after screenshot diffs.

## Summary of Changes

Reformatted every active CSS file (alphabetized properties within each block,
nested all states/pseudo-elements/media queries, rule order follows DOM order,
4-space indent, ≤140-col). JS was already in the terse no-semicolon style; only
minor tightening was possible.

**DRY / vestigial removals**
- Deleted `styles/decomanghold-regular.css` + `styles/dream_orphansregular.css`
  and their `root.css` @imports — those families are never referenced anywhere.
  (Their `fonts/*.woff*` binaries are now orphaned too — left in place, flagged.)
- `card.css`: dropped `max-width: 50rem` (redundant with `width: min(50rem,92vw)`),
  `border-radius: 0` (default), the `&::before/&::after { display:none; content:none }`
  reset (never renders — no content is ever set), and the redundant `main.deco-card`
  half of the selector (`.deco-card` alone already out-specifies the base `main`).
- `travel/styles.css`: collapsed the `ol,ul` margin/padding longhand pile-up
  (`margin:.6rem 0` + `margin-block-*:0` → `margin:0`; `padding-left` overridden by
  `padding-inline-start` → `padding-inline:2em 0`).
- `home/styles.css`: removed the mobile `main { padding }` that duplicated the base.
- `schedule/styles.css`: fixed a dead selector — `:first-child` (descendant, matched
  nothing) → `&:first-child` (the intended first `.times` span). Behavior-neutral
  here because that margin collapses through the `<p>`.

**JS**
- `radio-nav.js`: dropped braces on the one-statement `for` loop and `hideHover`;
  reflowed the 469-char knob render template (breaks placed inside tags / SVG path
  data, so the rendered DOM is byte-identical).
- `index.js`: `submitButton` now derived from the captured `loginForm`, not a second
  `document.forms['login']` lookup.

**Alphabetical-order exceptions ("unless they can't be")**
- `root.css h1`: `background` shorthand kept before `-webkit-background-clip` /
  `background-clip` (the shorthand resets clip).
- `home .date`: the two `font-size` declarations (clamp fallback then `cqw`) keep
  their override order.
- The `border` shorthand sorts before its `border-*-color` longhand naturally.

**Verification** — before/after Playwright screenshots of all 6 pages × {desktop
1280, mobile 390}, compared with `odiff`: ALL 12 PIXEL-IDENTICAL. Functional knob
check passed (5 stations, SVG arrow, "Spin me!" tip, hover hints HOME/RSVP, no
console errors).

**Left as-is (judgment calls, flagged for owner)**
- Repeated `font-family: contralto` in rsvp/card: technically redundant (modern-
  normalize gives form controls `font-family: inherit`), kept as defensive — the
  RSVP party/thanks steps are `hidden` and outside screenshot coverage.
- `card.css .deco-card a`: no carded page currently has an in-card link; kept as a
  sensible default rather than deleted.
- Orphaned `fonts/decomanghold-*`, `fonts/dream_orphans-*` binaries (unreferenced
  after the @font-face removals).
