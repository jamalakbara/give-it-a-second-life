# 21 — Media Gallery Picker for Admin Item Form

## Goal

Let an admin add item images either by **selecting from a gallery of
already-uploaded Cloudinary images** or by **uploading new files**, both from a
single modal picker — so previously uploaded photos can be reused instead of
re-uploaded.

## Scope

**In:**
- New admin-gated `GET /api/media` route that lists images in the Cloudinary
  `preloved` folder (via Cloudinary Admin Search API), newest first, with cursor
  pagination.
- New `MediaPicker` modal component with two tabs: **Gallery** (selectable
  thumbnail grid) and **Upload** (existing drag-drop/browse flow moved in).
- Wire the picker into `ItemForm` behind a single **+ Add images** button; keep
  `SortableImageGrid` for order/cover/remove. Dedup URLs on add.
- Doc updates: PRD §3, TECH_SETUP part, DESIGN_SYSTEM modal pattern + Implementation Map.

**Out:**
- Deleting images from Cloudinary / the folder.
- Cropping, editing, renaming, or tagging images.
- Server-side caching of the media list (single-admin MVP).
- Any change to how images are stored on items (`item_images` unchanged).

## Checklist

- [x] `app/api/media/route.ts` — GET, admin-gated, Cloudinary Search API, trimmed response, cursor pagination, 501 when unconfigured
- [x] `components/MediaPicker.tsx` — modal shell (Esc + backdrop close, scroll lock), Gallery + Upload tabs
- [x] Gallery tab — fetch `/api/media`, selectable grid, disable already-added, "Load more", "Add N images"
- [x] Upload tab — move `uploadFiles`/dropzone/shimmer logic out of `ItemForm`, auto-add uploaded URLs
- [x] `ItemForm.tsx` — replace inline dropzone with **+ Add images** button opening `MediaPicker`; `addUrls` dedups
- [x] `docs/PRD.md` §3 — add "Media gallery picker" feature (MVP)
- [x] `docs/TECH_SETUP.md` — new part documenting `GET /api/media` (§9)
- [x] `docs/DESIGN_SYSTEM.md` — modal-picker pattern + Implementation Map + version bump (v2.8)
- [x] Verify: `tsc` + `eslint` clean; production build passes. Live 401/501/browser flow needs Cloudinary env + `npm run dev` (see plan)
