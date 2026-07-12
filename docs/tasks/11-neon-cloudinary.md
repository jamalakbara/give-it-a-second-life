# Task 11 — Wire Neon (Postgres) + Cloudinary

## Goal

Replace the two remaining mock adapters with real services: persist items in Neon
serverless Postgres, and upload item images to Cloudinary from the admin panel.
Keep the repository surface (`getItems`/`getItem`/`createItem`) unchanged so nothing
above the data layer moves.

## Scope

**In**

- Neon SQL client + schema (`items`, `item_images`)
- Data layer swaps to Neon when `DATABASE_URL` is set; mock stays as fallback
- Idempotent schema + seed script (`npm run db:setup`)
- Cloudinary signed-upload API route (secret stays server-side)
- ItemForm: file upload → Cloudinary → store `secure_url`s
- Env placeholders + docs

**Out**

- Auth hardening (still `NEXT_PUBLIC_ADMIN_PASSWORD`)
- Editing/deleting items, sold toggle UI — **now delivered in task 13**
- Wishlist/newsletter persistence (separate tasks)

## Checklist

- [x] Add `@neondatabase/serverless` dependency
- [x] `lib/db.ts` — neon client from `DATABASE_URL`, `hasDatabase` flag
- [x] `lib/db/schema.sql` — `items` + `item_images` tables (idempotent)
- [x] `lib/data/items.mock.ts` — move existing in-memory adapter + seed data
- [x] `lib/data/items.neon.ts` — SQL-backed `getItems`/`getItem`/`createItem`
- [x] `lib/data/items.ts` — delegate to neon when DB present, else mock
- [x] `scripts/db-setup.ts` — run schema + seed the 14 items; `npm run db:setup`
- [x] `app/api/upload/route.ts` — signed Cloudinary params (server-side secret)
- [x] `components/ItemForm.tsx` — file upload to Cloudinary, thumbnails, secure_url list
- [x] `.env.local` + `.env.example` placeholders (DB + Cloudinary)
- [x] Update admin mock-mode note to reflect DB-backed when configured
- [x] Update `docs/DESIGN_SYSTEM.md` (ItemForm image field → upload pattern)
- [x] `npm run build` + `npm run lint` clean
