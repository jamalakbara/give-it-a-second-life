# 28 — About Page & SEO

## Goal

Add an `/about` page that states the site's purpose (extend the lifecycle of beautiful
things; curated, gallery-first, one-of-a-kind) plus a short seller intro from Akbar, and
wire up full SEO for it (metadata, canonical, Open Graph, JSON-LD, sitemap, nav links).

## Scope

**In**
- New `app/about/page.tsx` (static server component, mission + seller-story angle).
- Page `metadata` (title via root template, description, canonical, Open Graph).
- `AboutPage` + `Organization` JSON-LD.
- Fix `metadataBase` in root layout so OG/canonical resolve to absolute URLs.
- Register `/about` in `sitemap.ts`.
- Add "About" link to Navbar `NAV_LINKS` and Footer nav.
- Docs: PRD §3, TECH_SETUP Part 14, DESIGN_SYSTEM.

**Out**
- No data fetch / DB changes. No new design primitives (reuse existing tokens).
- No founder photo / image assets (copy only).

## Checklist

- [x] `app/about/page.tsx` — sections: hero, mission, how-it-works (3 glass cards), seller intro, CTA
- [x] `metadata` export (title "About", description, canonical `/about`, Open Graph)
- [x] `AboutPage` + `Organization` JSON-LD block
- [x] `app/layout.tsx` — add `metadataBase`
- [x] `app/sitemap.ts` — add `/about` entry
- [x] `components/Navbar.tsx` — add About to `NAV_LINKS`
- [x] `components/Footer.tsx` — add About to footer nav
- [x] `docs/PRD.md` §3 — About page feature
- [x] `docs/TECH_SETUP.md` — Part 14: About Page & SEO
- [x] `docs/DESIGN_SYSTEM.md` — About page line + Implementation Map
- [x] Verify: `/about` renders, title/canonical/OG/JSON-LD correct, sitemap includes it, `npm run build` clean
