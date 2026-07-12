# Task 14 — Admin Product Ordering & Enhanced Image Uploader

## Goal

Let the admin **drag products into a custom catalog order** (persisted, drives the public
gallery) and give the item form an **awwwards-worthy drag-and-drop image uploader** with
**multi-upload** and **drag-to-reorder thumbnails** (first image = cover).

## Scope

**In**

- Schema: `items.sort_order` column + backfill + index (`lib/db/schema.sql`, `scripts/db-setup.ts`)
- Data layer: `sortOrder` on `Item`, default sort by `sort_order`, new items to top, `reorderItems()` (mock + Neon + dispatcher)
- API: `PATCH /api/items/reorder` (admin-auth, `{ orderedIds }`)
- Admin UI: drag-to-reorder product rows with auto-save (`components/AdminItemList.tsx`)
- Image UI: drag-drop dropzone + reorderable thumbnail grid + cover badge + upload placeholders (`components/ItemForm.tsx`, new `components/SortableImageGrid.tsx`)
- Dependency: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- Docs: PRD §3, TECH_SETUP Part 8, DESIGN_SYSTEM v2.3

**Out**

- Real auth (still shared password — Phase 2 / Clerk)
- Per-image alt-text editing, bulk image delete
- Reordering within price-sorted views (price sort intentionally overrides custom order)
- Cross-page paginated reorder / virtualized lists

## Checklist

- [x] `lib/types.ts` — `Item.sortOrder`, `ReorderInput`
- [x] `lib/db/schema.sql` — `sort_order` column, backfill, `idx_items_sort_order`
- [x] `scripts/db-setup.ts` — seed `sort_order`
- [x] `lib/data/items.mock.ts` — seed sortOrder, default sort, create-to-top, `reorderItems`
- [x] `lib/data/items.neon.ts` — select/map `sort_order`, orderBy, create-to-top, `reorderItems`
- [x] `lib/data/items.ts` — export `reorderItems`
- [x] `app/api/items/reorder/route.ts` — PATCH, admin-gated
- [x] `components/SortableImageGrid.tsx` — @dnd-kit sortable thumbnails + cover badge
- [x] `components/ItemForm.tsx` — dropzone, multi-upload, reorder, placeholders
- [x] `components/AdminItemList.tsx` — @dnd-kit sortable rows, auto-save on drop
- [x] Migration applied to Neon (`npm run db:setup`)
- [x] Docs updated: PRD, TECH_SETUP, DESIGN_SYSTEM (per design-system-sync rule)
- [x] `npm run lint` + `npm run build` clean
- [x] Browser verify: dropzone + grips render; `PATCH /api/items/reorder` persists sort_order, public gallery honors custom order, price sort overrides, order restored; auth 401 (no pw) / 400 (bad body). Note: literal drag gesture needs a real pointer stream (dnd-kit) — synthetic `left_click_drag` in the test harness doesn't trigger it; the drop→fetch data path was verified directly.
