# Task 02: Data Layer (Mock Adapter)

## Goal
Typed data layer with repository interface + in-memory mock adapter, so the future Neon swap only touches one file.

## Scope
- In: types, mock seed data (IDR prices), repository functions, format helpers, API routes
- Out: real database connection (future task), Cloudinary

## Checklist
- [x] `lib/types.ts` — `Item`, `ItemImage`, category/condition enums per TECH_SETUP schema
- [x] `lib/data/items.ts` — repository (`getItems(filters)`, `getItem(id)`, `createItem(input)`) with in-memory mock adapter
- [x] Seed ~12–15 items with square placeholder images
- [x] `lib/format.ts` — `formatPrice` (IDR, `Rp 450.000` style)
- [x] `app/api/items/route.ts` — GET (category/condition/price/search/sort) + POST
- [x] `app/api/items/[id]/route.ts` — GET single item
