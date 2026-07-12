# 17 — Wishlist count sync

## Goal
Fix navbar wishlist indicator showing a count while the wishlist page is empty.

## Scope
- In: reconcile the wishlist store against the live catalog so the count matches shown items.
- Out: no UI/token changes; no change to how items are marked sold.

## Root cause
Wishlist stores ids in localStorage. When a saved item becomes sold, it drops out of
the public `/api/items` response, so the wishlist page filters it out (empty), but the
navbar count still counted the stale id.

## Checklist
- [x] Prune stale ids (not in catalog) after the wishlist page fetch
- [x] Navbar count derives from same store → auto-corrects
