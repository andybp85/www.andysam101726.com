---
# www.andysamwedding.com-36sf
title: Site title links to home page
status: completed
type: feature
priority: normal
created_at: 2026-06-26T09:09:25Z
updated_at: 2026-06-26T09:10:50Z
parent: www.andysamwedding.com-wbpd
---

Make the h1 site title (Andy & Sam's Wedding) a link to /home/ on the gated content pages. Keep the brass gradient text styling; drop default link chrome. Leave the gate (index.html) title unlinked.

## Summary of Changes
Wrapped the h1 site title in <a href="/home/"> on the five gated content pages (home, rsvp, schedule, travel, faq). Left the gate (index.html) title unlinked — it shouldn't point into the authenticated site.
styles/root.css: added 'h1 a { color: inherit; text-decoration: none; }' so the link inherits the h1's transparent fill (brass gradient still shows via background-clip:text) and drops the default underline/blue.
Verified headless: href=/home/, computed color transparent, text-decoration none, background-clip:text intact, click navigates to /home/.
