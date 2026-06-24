---
# www.andysamwedding.com-a218
title: 'FAQ: collapsible questions with chevron, default closed'
status: completed
type: feature
created_at: 2026-06-24T02:04:43Z
updated_at: 2026-06-24T02:04:43Z
parent: www.andysamwedding.com-wbpd
---

Make FAQ questions accordion-style:
- [x] Each Q/A collapses; closed by default
- [x] Open/closed chevron indicator
- [x] Keyboard + a11y friendly (native details/summary preferred)

## Summary of Changes

- `faq/index.html`: converted the `<dl>/<dt>/<dd>` list to nine
  `<details class="faq"><summary>Q</summary><p class="answer">A</p></details>`
  blocks. Native `<details>` → collapsible, closed by default (no `open`
  attr), full keyboard + a11y for free. Answer text/markup unchanged.
- `faq/styles.css`: hid the native marker (`list-style: none` +
  `::-webkit-details-marker`), kept the question/answer type from the old
  `dt`/`dd`, added thin brass separators, a `:focus-visible` ring, and a
  CSS-border chevron on `summary::after` — ">" closed, rotates to "v" on
  `details[open]` (transition removed under `prefers-reduced-motion`).
- Applies at all widths (collapsible on desktop too). Verified default-closed,
  open rotation + answer reveal, and desktop layout.
