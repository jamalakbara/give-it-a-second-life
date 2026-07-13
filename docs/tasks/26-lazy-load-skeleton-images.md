# Task 26 — Lazy-load + skeleton for all images

## Goal

Give every content image on the site a consistent loading experience: native
lazy-loading plus a shimmer skeleton placeholder that fades into the loaded
image. Centralize the behavior in one reusable primitive.

## Scope

**In:**
- New `components/SmoothImage.tsx` — wraps `next/image` (`fill`) with the
  existing `.skeleton` shimmer + opacity fade-in.
- Apply it to storefront images (`CardMedia`, `ImageGallery`) and admin images
  (`MediaPicker`, `SortableImageGrid`, `AdminItemList`), converting the plain
  `<img>` tags to optimized `next/image`.
- Docs: `docs/DESIGN_SYSTEM.md` sync.

**Out:**
- Decorative backgrounds (`Aurora`, `AuroraGL`).
- Cloudinary transform-param helper (`w=/q=auto`).

## Checklist

- [x] Create `components/SmoothImage.tsx` (skeleton + fade + lazy, `fill` mode, `objectFit` prop)
- [x] `CardMedia.tsx` — use `SmoothImage`
- [x] `ImageGallery.tsx` — refactor main + lightbox + thumbnails to `SmoothImage`; keep `priority` on main
- [x] `MediaPicker.tsx` — `<img>` → `SmoothImage`, drop eslint-disable
- [x] `SortableImageGrid.tsx` — `<img>` → `SmoothImage`, add `relative` to inner div
- [x] `AdminItemList.tsx` — `<img>` → `SmoothImage`, add `relative` to cover box
- [x] `docs/DESIGN_SYSTEM.md` — document `SmoothImage` (§2.8 + §2.7.1), update Implementation Map, bump to v2.12
- [x] Verify: `npm run lint` (clean — only pre-existing AuroraGL warning) + `npm run build` pass. Browser skeleton→fade / lazy check deferred to user.
