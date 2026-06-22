---
# www.andysamwedding.com-trip
title: Deepen drop shadow on nav dial text (desktop + mobile)
status: completed
type: task
priority: normal
created_at: 2026-06-22T11:49:09Z
updated_at: 2026-06-22T11:49:28Z
parent: www.andysamwedding.com-wbpd
---

Increase text-shadow on station names in both the desktop dial and the mobile drawer for more depth.

## Summary of Changes

- Desktop `.station`: text-shadow `0 1px 2px rgba(35,31,32,0.5)` -> `0 2px 4px rgba(35,31,32,0.7)`.
- Mobile `#station-menu .station`: `1px 1px 1px rgba(35,31,32,0.3)` -> `0 2px 3px rgba(35,31,32,0.65)` (switched the weak diagonal offset to a downward drop shadow matching desktop).

Verified visually on the desktop dial and the open mobile drawer.
