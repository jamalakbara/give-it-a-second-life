# 31 — Rebrand to "Give It the Second Life"

## Goal
Rebrand the storefront from "Selling Preloved Items" to **"Give It the Second Life"** —
name, wordmark, and all marketing copy — with a `Second Life°` logo and brand-only voice
(curator's personal name removed).

## Scope
**In**
- `SITE_NAME` + `SITE_DESCRIPTION` and JSON-LD in `lib/seo.ts` (drop `founder` "Akbar").
- Navbar + footer wordmark → `Second Life°`; footer copyright reworded (no "Akbar").
- Root metadata title/template (`app/layout.tsx`); home eyebrow + OG (`app/page.tsx`).
- Gallery + About + item-detail copy and JSON-LD names; "Akbar" removed from user-facing copy.
- `package.json` name → `give-it-the-second-life`.
- Docs: PRD (rebrand note + name refs), DESIGN_SYSTEM (wordmark, v2.16), this task file.

**Out**
- No route changes → `app/sitemap.ts` / `app/robots.ts` untouched.
- No new logo image/favicon asset (keep `app/favicon.ico`); `SITE_URL`/domain unchanged.
- Internal `seller_akbar` data id (schema + mock) left as-is — not user-facing.

## Checklist
- [x] `lib/seo.ts` — SITE_NAME, SITE_DESCRIPTION, drop Organization `founder`
- [x] `components/Navbar.tsx` — wordmark `Second Life°`
- [x] `components/Footer.tsx` — wordmark `Second Life°` + reworded copyright
- [x] `app/layout.tsx` — title default + template
- [x] `app/page.tsx` — hero eyebrow + OG title
- [x] `app/gallery/page.tsx` — OG title + CollectionPage JSON-LD name
- [x] `app/about/page.tsx` — MISSION, OG/AboutPage/Org names, step 02, curator section, drop `founder`
- [x] `app/items/[id]/page.tsx` — seller block brand-only (no "Akbar")
- [x] `package.json` — name
- [x] `docs/PRD.md` — rebrand note + name references
- [x] `docs/DESIGN_SYSTEM.md` — wordmark + v2.16 note
- [x] Verify: `grep` "selling preloved" / user-facing "akbar" = zero hits
- [x] Verify: `npm run build` passes (33/33 pages). Browser spot-check of tab titles + JSON-LD deferred to reviewer.
