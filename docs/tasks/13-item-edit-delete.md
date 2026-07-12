# Task 13 — Item Edit, Delete & Sold Toggle

## Goal

Let the admin **edit** and **delete** existing items (not just create), and **mark items
sold/available**, with server-side auth on the mutating endpoints. Also add a
Requirement-Intake rule so future requirements land in `docs/` first.

## Scope

**In**

- Data layer: `getAllItems`, `updateItem`, `deleteItem` (mock + Neon), adapter exports
- `UpdateItemInput` type (`CreateItemInput` + optional `isSold`)
- Shared payload validation (`lib/validateItem.ts`) reused by POST + PATCH
- Server auth (`lib/adminAuth.ts`) on `POST`/`PATCH`/`DELETE` via `x-admin-password`
- API: `PATCH` + `DELETE` on `/api/items/[id]`; `?includeSold=true` on `GET /api/items`
- Admin UI: dual-mode `ItemForm` (edit + sold toggle), new `AdminItemList`
- New `.claude/rules/requirement-intake.md`
- Docs: PRD § 3.1 + § 12, TECH_SETUP Part 4.4, DESIGN_SYSTEM § 2.6 + map

**Out**

- Real auth (Clerk) — still shared password (Phase 2)
- Deleting Cloudinary assets on item delete (orphaned, harmless)
- Multi-quantity inventory / restocks

## Checklist

- [x] `lib/types.ts` — `UpdateItemInput`
- [x] `lib/data/items.mock.ts` — `getAllItems`, `updateItem`, `deleteItem`
- [x] `lib/data/items.neon.ts` — `getAllItems`, `updateItem`, `deleteItem` (image-set replace, cascade delete)
- [x] `lib/data/items.ts` — export the three new functions
- [x] `lib/adminAuth.ts` — `isAuthorized(req)` shared-secret check
- [x] `lib/validateItem.ts` — `parseItemInput` shared by POST + PATCH
- [x] `app/api/items/route.ts` — auth on POST, `?includeSold=true` on GET
- [x] `app/api/items/[id]/route.ts` — `PATCH` + `DELETE` (auth, validation, 404s)
- [x] `components/ItemForm.tsx` — dual create/edit, sold toggle, `x-admin-password` header
- [x] `components/AdminItemList.tsx` — list, edit expander, inline delete confirm
- [x] `app/admin/page.tsx` — render `<AdminItemList />`
- [x] `.claude/rules/requirement-intake.md` — new rule
- [x] Docs updated: PRD, TECH_SETUP, DESIGN_SYSTEM (per design-system-sync rule)
- [x] `npm run lint` + `npm run build` clean
- [x] Verified end-to-end vs Neon dev server: 401 no-auth, 400 bad-data, create → edit+sold → public-excludes/admin-includes → delete → 404, test item cleaned up
