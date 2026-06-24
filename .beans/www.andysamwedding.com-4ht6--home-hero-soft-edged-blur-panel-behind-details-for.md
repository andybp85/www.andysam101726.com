---
# www.andysamwedding.com-4ht6
title: 'Home hero: soft-edged blur panel behind details for legibility'
status: completed
type: feature
priority: normal
created_at: 2026-06-24T09:12:52Z
updated_at: 2026-06-24T11:14:30Z
parent: www.andysamwedding.com-wbpd
---

Details box on the home hero is hard to read over the busy photo. Add a subtle backdrop-filter blur panel behind it, feathered (no hard rectangle edges). On mobile the box currently spans the full image height; wrap it to its content so only the text is blurred.

## Summary of Changes

`home/styles.css` only.

- **Feathered blur panel** (`.details::before`): absolutely-positioned pseudo with
  `backdrop-filter: blur(4px)` + a faint dark tint (`rgba(18,9,5,0.22)`), masked
  with `radial-gradient(ellipse ... #000 52%, transparent 92%)` so the blur fades
  out at the edges — no hard rectangle. `z-index:-1` keeps it behind the text;
  `.details` gets `isolation: isolate` so that negative z-index can't slip behind
  the hero photo. Added base padding (0.7rem 1.1rem) for breathing room.
- **Mobile wrap-to-content**: replaced `inset:0` (which spanned the whole portrait
  photo) with a top-anchored, `width:max-content` card (`top:6%; left:50%;
  transform:translateX(-50%); max-width:88%; padding:1rem 1.5rem`). Now only the
  date/place/RSVP text is blurred, not the entire image. Dropped the inert
  `top/left` on `.rsvp-btn.big`.
- `-webkit-` prefixes on backdrop-filter + mask for Safari. Verified desktop +
  mobile (390px) screenshots: soft feathered panel, legible gold, compact mobile card.

## Follow-up: softer edges + clear the people (desktop)

- Fixed the still-hard edge: the radial mask used `ellipse 100% 100%`, which sized
  the gradient radii to the *full* box dimensions so the fade landed outside the
  visible box (effectively unmasked). Switched to `ellipse closest-side` (inscribes
  the box) with `#000 48% -> transparent 100%`, and extended the pseudo past the
  text (`inset: -0.6rem -1rem`) so the feather falls in the margin, not across the
  letters. Dropped `border-radius` (the mask shapes it now).
- Desktop: moved the panel to the far right (`right: 6% -> 1%`) and trimmed the
  date font (`clamp(1.8rem,4.3vw,3.4rem) -> clamp(1.7rem,3.7vw,2.95rem)`) so the
  whole panel narrows off the couple. Measured: date left now ~66% of the image
  with a ~33px gap to the woman's hair (was overlapping at ~60%). Mobile date is a
  separate clamp, unaffected.

## Follow-up: strengthen the panel (it vanished over the bright windows)

Shifting the panel to the far right placed it over the washed-out window area of
the photo, where the faint 0.22 tint + 4px blur was invisible (it only read over
the darker people). Strengthened so it holds up over any background: tint
`rgba(14,7,4,0.5)`, `blur(7px)`, solid mask core out to 55%, slightly wider
extend. Still feathered, still clears the couple.

## Follow-up: keep the mobile card off the couple at all sizes

At 320px the date wrapped to two lines, making the card tall enough for the RSVP
button to overlap the couple's heads (card bottom ~59% of the image). Widened the
card (max-width 88%->94%), trimmed padding (1rem 1.5rem -> 0.9rem 1.2rem), and
lowered the mobile date min (clamp(2.2rem,9vw,3.7rem) -> clamp(1.9rem,8.6vw,3.7rem))
so "October 17, 2026" stays on one line down to 320px. Verified 320-375px: date
one line, card bottom 42-48% of the image (was up to 59%), clear gap to the couple
at every width.

## Follow-up: RSVP button must clear the couple (375px)

A zoomed check showed the RSVP button + its panel were sitting on the couple's
heads (~38% down the portrait) at 375px and below. Raised the card (top 3% -> 1%),
tightened internal spacing (gap 0.4->0.25rem, padding 0.9->0.7rem vertical, dropped
the place's bottom margin on mobile), and trimmed the panel's vertical feather
(inset -1rem -> -0.7rem). Button bottom now ~31% at 375px (was ~36%) with a clear
gap; verified 320-414px via zoomed crops — clears at every width incl. the 320px
worst case.

## Follow-up: bigger white panel + constant-percentage desktop text

- Enlarged the white panel on both: base extent -0.7/-1.7rem -> -1.1/-2rem, solid
  mask core 66% -> 80%, opacity 0.55 -> 0.62. Mobile keeps a tighter vertical
  reach (`::before { inset: -0.55rem -1.6rem }`) so the stronger white still
  clears the couple (verified zoomed at 320/375px).
- Desktop text now a constant fraction of the image: made `.hero` a
  `container-type: inline-size` size container and sized `.date` (4.6cqw),
  `.place` (2.9cqw) and `.rsvp-btn.big` (2.34cqw) in cqw (% of image width), with
  the prior clamps kept as graceful fallback. Measured date at a constant 4.60%
  of the image from 701px to 1400px+ (image and text both cap at the 66rem main).
