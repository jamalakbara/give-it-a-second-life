# 30 — Home "Latest Arrivals" scattered carousel

## Goal

Replace the home page "Latest arrivals" static grid with a Gucci-Beauty-style scattered
carousel: a horizontal scroll-snap row of rotated, vertically-staggered cards where the
centered card is emphasized (upright, larger, bright) and neighbors recede and dim, with
a single centered caption for the active card, progress dashes, and a "swipe to discover"
hint.

## Scope

**In**
- New client component `components/ArrivalsCarousel.tsx` (CSS transforms + rAF, no lib).
- Swap the grid block in `app/page.tsx` for the carousel (home stays a server component).
- Reuse `CardMedia` unchanged (hover 3D-tilt + pill + wishlist keep working on top).
- Reduced-motion fallback → upright horizontal scroll row.
- Doc updates: `docs/DESIGN_SYSTEM.md` pattern + Implementation Map.

**Out**
- Gallery masonry (`ItemGrid`) — untouched.
- `ItemCard` — still used by gallery, left as-is.
- No new dependency, no route/metadata change.

## SEO note

No SEO surface change: home keeps its single `<h1>` ("A living gallery"), cards still link
to `/items/[id]`, images keep `alt` via `SmoothImage`. No sitemap/robots change.

## Checklist

- [x] Create `components/ArrivalsCarousel.tsx` (scroll-snap track, rAF scatter math, active caption, dashes, hint)
- [x] Edge peek + fixed card width so first/last snap-center and middles bleed off edges
- [x] Active-index state drives caption + active dash; per-frame transforms stay off React state
- [x] `prefers-reduced-motion` fallback to upright scroll row (matchMedia guard keeps scatter off; upright scroll row remains)
- [x] Dash click smooth-scrolls target card to center (verified: dash 0 → centers card 0)
- [x] Swap grid block in `app/page.tsx` for `<ArrivalsCarousel items={featured} />`
- [x] Update `docs/DESIGN_SYSTEM.md` (carousel pattern §2.10 + Implementation Map + v2.15 note)
- [x] Verify: fan renders, swipe re-fans live (caption + dashes follow center), hover tilt/sold veil compose, dash-click nav, tsc clean. Reduced-motion + mobile via code guard; not exercised in browser
