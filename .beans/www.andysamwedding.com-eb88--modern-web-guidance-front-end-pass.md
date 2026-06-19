---
# www.andysamwedding.com-eb88
title: Modern-web-guidance front-end pass
status: completed
type: task
created_at: 2026-06-19T00:16:22Z
updated_at: 2026-06-19T00:16:22Z
parent: www.andysamwedding.com-wbpd
---

Apply modern-web-guidance review: hero LCP/CLS, ARIA live errors, :user-invalid validation, guest input labels, AVIF+image-set backgrounds, cross-document view transitions, head cleanup, browser-support policy

## Summary of Changes
Grounded in retrieved modern-web-guidance guides (optimize-image-priority, required-field-feedback, deliver-optimized-decorative-images, cross-document-transitions). Browser-support target: Baseline Widely Available, enhancements degrade gracefully.

P1 (correctness / a11y)
- home/index.html hero img: added width=1200 height=800 + fetchpriority="high" (kills CLS, prioritizes LCP).
- role="alert" live regions on gate #error-msg, rsvp #name-error, rsvp #submit-error so JS-set errors are announced.
- input:user-invalid CSS in root.css (border + outline) for interaction-timed native validation; aria-invalid sync bridge added to site.js (rsvp + content pages) and index.js (gate, which doesn't load site.js).
- rsvp/index.js: aria-label on generated guest-name inputs (placeholder is not a label).

P2 (progressive enhancement)
- AVIF backgrounds generated from new_design SVGs (rsvg-convert -> avifenc q60): wood-desktop.avif 81KB, wood-mobile.avif 63KB (~31-33% under webp). root.css serves via image-set() AVIF->WebP with a plain url() fallback line first.
- @view-transition { navigation: auto } in root.css, gated behind prefers-reduced-motion. Cross-document VT not in Firefox -> falls back to instant nav.

P3 (cleanup)
- Removed dead X-UA-Compatible meta (index.html, thankyou).
- Removed dead @-moz-document Firefox legend hack from root.css (no page has a <legend>).
- Added full favicon set + manifest + apple-touch-icon to the 5 content pages (home/rsvp/schedule/travel/faq); all 7 pages now consistent.
- theme-color black -> #2a1a14 across all 7 pages.

Also: documented a Browser Support policy in CLAUDE.md Conventions.

Not done (deliberately): content-visibility — guide targets long content-heavy pages; these are short, no gain.
