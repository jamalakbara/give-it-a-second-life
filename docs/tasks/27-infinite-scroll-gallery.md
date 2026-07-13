# 27 — Infinite Scroll Gallery

## Goal

Load the public gallery in batches of 8 as the user scrolls (infinite scroll, no
pagination UI) instead of rendering the whole catalog at once — keeping the initial query
and DOM light at scale. First batch server-rendered; the rest append on the client.

## Scope

**In:**
- `ItemFilters.limit` / `offset` + parsing in `parseFilters`.
- Neon + mock adapters apply limit/offset; new `getItemCount` for the search-result total.
- `/api/items` accepts `limit`/`offset` (via existing parseFilters — no route edit).
- New `components/ItemGrid.tsx` client grid: seed from SSR batch, IntersectionObserver
  sentinel appends next batch, skeleton-card placeholders while loading, remount-on-filter.
- `app/page.tsx` fetches first batch + count, mounts `ItemGrid`.
- Docs: PRD §3, TECH_SETUP §13, DESIGN_SYSTEM §2.9 (+ v2.13 note, Implementation Map).

**Out:**
- Cursor/keyset pagination (offset is fine at this scale).
- Changes to sitemap / item-detail (they call `getItems()` unpaginated — return all).
- Admin list pagination.

## Checklist

- [x] `ItemFilters` gains `limit?` / `offset?` (`lib/types.ts`)
- [x] `parseFilters` parses `limit`/`offset` (`lib/filters.ts`)
- [x] Neon adapter: shared `buildWhere`, LIMIT/OFFSET in `queryItems`, `countItems` +
      exported `getItemCount` (`lib/data/items.neon.ts`)
- [x] Mock adapter: `paginate` slice + `getItemCount` (`lib/data/items.mock.ts`)
- [x] Re-export `getItemCount` (`lib/data/items.ts`)
- [x] `components/ItemGrid.tsx` — client masonry + IntersectionObserver + `CardSkeleton`
- [x] `app/page.tsx` — SSR first batch (`limit: 8`), `getItemCount` for header, mount
      `ItemGrid` with `key={query}`
- [x] Docs updated (PRD, TECH_SETUP, DESIGN_SYSTEM + version note + Implementation Map)
- [x] `tsc --noEmit` + eslint clean
- [x] Manual verification (browser + curl): SSR first 8 (zero API on load), scroll →
      `offset=8` then `offset=16` (batch 2 → stops, no loop), `/api/items` limit/offset +
      past-end `[]`, `books` filter remounts with no sentinel/appends. Visual design-
      reference pixel audit still recommended before merge.
