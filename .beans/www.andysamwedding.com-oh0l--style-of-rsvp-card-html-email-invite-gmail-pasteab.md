---
# www.andysamwedding.com-oh0l
title: Style-of-RSVP-card HTML email invite (Gmail-pasteable)
status: in-progress
type: feature
priority: normal
created_at: 2026-06-26T01:04:54Z
updated_at: 2026-07-01T00:51:26Z
parent: www.andysamwedding.com-wbpd
---

Build an HTML email inviting guests to the invite/gate page, styled like the RSVP/deco card. Constraints: email clients drop @font-face (custom fonts won't render as live text) and don't support SVG border-image, so decorative frame+script title become baked PNG assets rendered from the live card; body copy is live inline-styled text on parchment; CTA is a bulletproof table-cell button linking to the gate. Table-based, fully inlined, hosted absolute image URLs, Outlook fallback.

## Build (done)
- images/email/invite-hero.png — full framed deco card rendered from a real HTML page via Playwright @2x (1200x1204, palette-reduced to 37KB). Real deco-frame.svg + lucian_schoenschrift script names + contralto body + parchment/ink, on #2a1a14 to blend with the email bg.
- email/invite.html — table-based, fully inline-styled. Hero img (links to gate) + live intro line + bulletproof brass button (#c9a253 solid, links to gate) + plaintext fallback link. Preheader text included.
- Copy: 'Together with their families / Andy & Sam / request the pleasure of your company at the celebration of their wedding / October 17, 2026 / The Madison Hotel - Morristown, NJ'.

## Before sending
- [x] Deploy so the absolute image URL is live: images/email/invite-hero.png -> https://www.andysamwedding.com/images/email/invite-hero.png (deployed).
- [ ] Pick send method (DevTools paste is the WORST — Gmail re-sanitizes on send). Better: open invite.html in browser, select-all/copy, paste into compose, test to self. Best for the guest list: send via the existing Apps Script MailApp.sendEmail({bcc, htmlBody}).
- [x] Confirm/tweak wording.
