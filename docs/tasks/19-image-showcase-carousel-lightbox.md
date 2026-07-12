# 19 — Image Showcase: Carousel + Lightbox + Loading Skeleton

## Goal
Upgrade the item-detail image showcase (`components/ImageGallery.tsx`) with themed
prev/next carousel arrows, a full-screen click-to-preview lightbox, and a shimmer
skeleton so switching photos never shows a blank/laggy pop.

## Scope
**In:**
- Prev/next arrow buttons on the main showcase (themed glass pill + chevron SVG).
- Click-to-preview full-screen lightbox (arrows, thumbnails, keyboard, scroll lock).
- Shimmer skeleton + fade-in while each image decodes.
- Zero new dependencies (hand-rolled, matches aurora/glass theme).
- Docs: DESIGN_SYSTEM §2.7.1, PRD §3.1, this task file.

**Out:**
- Pinch/scroll zoom inside the lightbox.
- Swipe/touch-drag gestures.
- Changes to the gallery grid / card hover.

## Checklist
- [x] Add `shimmer` keyframe + `.skeleton` utility in `app/globals.css` (reduced-motion safe)
- [x] Rewrite `ImageGallery.tsx`: carousel arrows (wrap-around, themed)
- [x] Add `loaded` state + skeleton overlay + `onLoad` fade-in (key by url)
- [x] Add click-to-preview full-screen lightbox (backdrop, contained `object-contain`)
- [x] Lightbox: themed arrows, close button, bottom thumbnail row
- [x] Lightbox keyboard (Esc, ←/→) + body scroll lock via `useEffect`
- [x] Use `onLoad` (not deprecated `onLoadingComplete`) — confirmed vs next 16 image docs
- [x] Update `docs/DESIGN_SYSTEM.md` §2.7.1 + bump version note (v2.6)
- [x] Update `docs/PRD.md` §3.1 Item Detail View bullets
- [ ] Manual verify: carousel, skeleton (throttled), lightbox, reduced-motion, single-image
      _(pending — run dev server + browser check)_
