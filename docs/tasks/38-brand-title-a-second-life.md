# 38 — Fix brand title to "Give It a Second Life"

## Goal
Correct the brand title from the non-idiomatic "Give It **the** Second Life" to the
idiomatic "Give It **a** Second Life" across all public surfaces, SEO metadata, and docs.

## Scope
- In: every occurrence of the full title string "Give It a Second Life" (page titles,
  metadata, JSON-LD names, hero/H1 copy, `SITE_NAME`, and docs that quote the title).
- Out: the short wordmark `Second Life°` (navbar/footer) — unchanged.

## Checklist
- [x] `lib/seo.ts` `SITE_NAME`
- [x] `app/layout.tsx` title default + template
- [x] `app/(site)/page.tsx` metadata title + hero
- [x] `app/(site)/about/page.tsx` description, metadata, JSON-LD, H1
- [x] `app/(site)/items/[id]/page.tsx` footer/attribution copy
- [x] `app/(site)/gallery/page.tsx` metadata title + JSON-LD name
- [x] `components/Footer.tsx` wordmark
- [x] `package.json` `name` → `give-it-a-second-life`
- [x] `docs/DESIGN_SYSTEM.md`, `docs/PRD.md`, `docs/tasks/31`, `docs/tasks/37` references
- [x] Verify no "the Second Life" title string remains
