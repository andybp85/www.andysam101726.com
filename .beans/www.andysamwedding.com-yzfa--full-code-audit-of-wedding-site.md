---
# www.andysamwedding.com-yzfa
title: Full code audit of wedding site
status: completed
type: task
priority: normal
created_at: 2026-07-02T16:17:41Z
updated_at: 2026-07-02T16:21:32Z
---

Audit HTML/CSS/JS across security, correctness, accessibility, performance, and conventions. Deliver findings report.

## Summary of Changes

Audit-only task; no code changed. Read all served HTML/JS/CSS, tests, deploy.sh, manifest, repo/remote state. Findings delivered in chat: 3 security items (unscoped RSVP writes via shared token, client-only gate on a public repo, innerHTML XSS surface in rsvp render), dead error-msg code on the gate, pointercancel gap + keyboard gap on the knob, 128KB favicon.svg, login-latency and misc nits. Positives: PII CSV gitignored, solid tests, good a11y groundwork.
