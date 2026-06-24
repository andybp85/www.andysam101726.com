---
# www.andysamwedding.com-rvkm
title: 'Knob tooltips: Spin me! + per-station hover hints'
status: completed
type: feature
priority: normal
created_at: 2026-06-24T11:42:19Z
updated_at: 2026-06-24T11:48:03Z
---

Desktop knob tooltips. (1) First-visit 'Spin me!' bubble, dismissed on any interaction incl scroll, shown once via localStorage. (2) Hover tooltips over the knob naming the page each clickable angle would tune to. Cream/brass dial styling, rounded, standard CSS only.

## Summary of Changes

- `radio-nav.js`: added module-scope `isPhone()`, `SPIN_TIP_SEEN` key, and
  `makeTip()` (builds a `position:fixed` `.knob-tip` appended to `<body>`).
- Hover tooltip (`initDesktopKnob`): a `pointermove` listener on the knob names
  the station the current pointer angle would tune to (`NAV[...][0]`) and follows
  the cursor; hidden on `pointerleave`/`pointerdown` and while dragging.
- Click-to-tune fix: `pointerdown` now resolves the target from the grabbed
  angle (via extracted `degAt`), so a plain click selects that wedge's station —
  making the hover tooltip's promise truthful (was previously a no-op nav).
- "Spin me!" onboarding (`initSpinTip`, called from `document.fonts.ready`):
  shows once ever (localStorage), pinned under the knob with an up-arrow; an
  `AbortController` wires dismissal on scroll (capture), wheel, pointerdown,
  keydown, touchstart, and knob `pointerenter`; repositions on resize.
- `styles/nav.css`: `.knob-tip` (cream padding-box + `--brass-frame` border-box,
  rounded, nickerbocker font, dark-edge + drop shadow), `--hover` (cursor
  offset), `--spin` (centered + CSS up-arrow). Hidden `!important` on mobile.
- Standard, Baseline-widely-available CSS/JS only — no popover/anchor-positioning
  or polyfills, per project browser policy.

Verified with Playwright at 1200px: spin bubble shows on load and dismisses on
knob enter; hover reads HOME/RSVP/TRAVEL across angles; both match the dial.
