---
# www.andysamwedding.com-4ip8
title: Replace placeholder hero photo
status: completed
type: task
priority: normal
created_at: 2026-06-18T10:59:59Z
updated_at: 2026-06-19T04:05:36Z
parent: www.andysamwedding.com-wbpd
---

home/ references /images/hero.jpg, currently a generated 1200x800 placeholder. Replace with the real engagement photo (keep the same path/filename, or update home/index.html if renamed).



## Summary of Changes
Done in Task 11 (commit 74759c4), redesign plan. Home hero replaced with B&W engagement photos via responsive <picture> (AVIF→WebP, landscape desktop 1600x1067 / portrait mobile 900x1350), per-breakpoint aspect-ratio (no CLS), fetchpriority high. Reviewed clean.
