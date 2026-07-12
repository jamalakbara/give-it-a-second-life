# 22 — Wishlist icon: heart → star

## Goal
Replace the wishlist heart glyph with a 5-point star ("favorite"/collect metaphor) across the card and nav, keeping all behavior and styling identical.

## Scope
- **In:** icon glyph swap (`HeartIcon` → `StarIcon`), imports, design-system doc sync.
- **Out:** any change to wishlist logic, accent color, glass circle, count badge, tilt/hover behavior.

## Checklist
- [x] Rename `HeartIcon` → `StarIcon` in `components/icons.tsx`, swap path to 5-point star (keep `filled`/stroke logic)
- [x] Update import + usage in `components/WishlistButton.tsx`
- [x] Update import + usage in `components/Navbar.tsx`
- [x] Sync `docs/DESIGN_SYSTEM.md` (v2.11 note, heart→star wording)
- [x] Verify no stray `HeartIcon` refs + `tsc --noEmit` passes
