# Task 10: Redesign — Dark Aurora (match live reference 1:1)

## Goal
Rebuild the visual system to match the *current* jackwatkins.co/works (dark aurora
portfolio), not the light adaptation the original DESIGN_SYSTEM.md described.
Keep all PRD functionality. Update DESIGN_SYSTEM.md to reflect reality.

## Scope
- In: full reskin (tokens, aurora bg, glass nav, hero, showcase cards, filter bar,
  detail, wishlist, admin, newsletter, footer), DESIGN_SYSTEM.md rewrite
- Out: functional changes (data layer, APIs, wishlist logic unchanged)

## Checklist
- [x] Inspect live reference for exact colors/fonts/layout (browser + computed styles)
- [x] Dark tokens in `globals.css` (@theme): void/ink/cream, fg tints, glass, aurora accents
- [x] `components/Aurora.tsx` — fixed animated drifting blob background over #010008
- [x] Fix stacking (body transparent, aurora z-0, stage relative z-10) so aurora renders
- [x] `.stage` rounded panel + `.veil` darkening + `.glass` + `.tracked` utilities
- [x] Navbar → floating glass pill (serif wordmark, tracked links, search, wishlist badge)
- [x] ItemCard → portrait 3:4 showcase, hover "View Item" glass pill, staggered 2-col layout
- [x] FilterSidebar removed → FilterBar glass toolbar (chips + condition + sort + clear)
- [x] Buttons/forms/badges/newsletter/footer restyled to glass/cream on dark
- [x] Item detail, wishlist, admin, not-found restyled to dark aurora theme
- [x] Rename `text` color token → `fg` (avoided Tailwind `text-*` utility collision)
- [x] `npm run build` + `npm run lint` clean
- [x] Verified vs reference at 1440 / 768 / 390 (aurora, pill nav, hero, hover, detail, footer)
- [x] DESIGN_SYSTEM.md rewritten to v2.0 (documents the dark-aurora system as built)

## Refinement (hover + grid, matched to measured reference values)
- [x] Hover: removed image scale/zoom → dim via `filter: brightness(0.55)` over `0.4s cubic-bezier(0.39,0.575,0.565,1)` (reference uses `transition: filter 0.4s`), "View Item" glass pill fades in
- [x] Grid: two 480px-scale columns, `gap-x` up to 160px + `gap-y` 160px (`gap-40`), container `max-w-[1120px]` — reference measured `grid-template-columns: 480px 480px; gap: 160px`
- [x] Right column stagger `lg:mt-[254px]` (measured reference col-2 offset ≈ 254px)
- [x] Card image radius 6px (reference wrapper radius 6px)

## Hover fidelity fix (cursor-following pill)
- [x] Reference hover re-analysed: "VIEW WORK" pill is a **magnetic cursor-following** button
  (trails the pointer inside the image with eased lag, home = center), + subtle image dim — NOT a static centered pill
- [x] `components/CardMedia.tsx` (client): tracks `mousemove`, positions pill at cursor via
  `left/top` with `transition 400ms cubic-bezier(0.22,1,0.36,1)` for the magnetic trail; fades out + recenters on leave
- [x] Image dim softened to `brightness-0.68` (reference dim is subtle), no scale
- [x] Verified pill tracks cursor across positions on localhost

## 3D tilt fix (bottle-cap press)
- [x] Reference wrapper `.image-wrap-work` measured: `perspective: 800px`, cursor-driven
  `rotateX/rotateY` (point under cursor recedes), `transition: transform 0.6s cubic-bezier(0.16,1,0.3,1)`
- [x] CardMedia: outer `[perspective:800px]`, inner tilt div rotates from normalized cursor
  offset (`rx = -ny*8`, `ry = nx*8`), preserve-3d, eased 0.6s; resets on leave
- [x] Layered with magnetic pill + dim; verified tilt direction follows cursor on localhost
- [x] `MAX_TILT = 5°` (within reference's subtle 2–6° range; tunable in components/CardMedia.tsx)
- [x] Confirmed no GSAP/Framer/WebGL needed — reference uses plain CSS matrix3d + transition; ours matches

## Notes
- Reference custom fonts (JW Serif / JW Sans) substituted with Playfair Display / Inter.
- Gold accent dropped — reference has no accent color; emphasis via contrast + aurora.
- Reference redesigned since original docs were written; v1 light spec preserved in git history.
