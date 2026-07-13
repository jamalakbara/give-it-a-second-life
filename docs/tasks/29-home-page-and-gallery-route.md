# 29 — Home Page + Gallery Route Split + SEO Rule

## Goal

Add a simple, funnel-focused **home page** at `/`, move the full gallery to `/gallery`
with a stripped-down single-line hero (matching the reference), and establish a standing
**SEO rule** so every surface stays search-ready.

## Scope

**In:**
- New home page at `/` (minimal hero + CTA + 6-item "Latest arrivals" preview strip).
- Move gallery to `/gallery`; simplify its hero to eyebrow + single serif `<h1>`.
- Repoint all gallery-bound links + navbar search to `/gallery`.
- Shared `lib/seo.ts` (constants, `canonical()`, WebSite/Organization JSON-LD).
- Per-page SEO: metadata + JSON-LD on home (`WebSite`+`Organization`) and gallery (`CollectionPage`).
- Update `sitemap.ts` (+`/gallery`) and `robots.ts` to use the shared module.
- New `.claude/rules/seo.md`; update PRD, TECH_SETUP, DESIGN_SYSTEM.

**Out:**
- OG image generation (`opengraph-image.tsx`), breadcrumb schema, Twitter cards.
- Any change to item detail / wishlist / admin behavior.
- Redirects (old `/` still resolves — now as home; no inbound `/gallery` links to preserve).

## Checklist

- [x] `lib/seo.ts` — `SITE_NAME`/`SITE_URL`/`SITE_DESCRIPTION`, `canonical()`, `websiteJsonLd`, `organizationJsonLd`
- [x] `app/gallery/page.tsx` — moved gallery, simplified hero, metadata + `CollectionPage` JSON-LD
- [x] `app/page.tsx` — new home (hero + CTA + preview strip), metadata + `WebSite`/`Organization` JSON-LD
- [x] `components/Navbar.tsx` — Gallery link → `/gallery`; search pushes to `/gallery`
- [x] `components/FilterBar.tsx` — `usePathname()` for push target + Clear link
- [x] `components/Footer.tsx` — Gallery link → `/gallery`
- [x] `app/about/page.tsx` — CTA → `/gallery`
- [x] `app/layout.tsx` — reuse `lib/seo` (`metadataBase`, description)
- [x] `app/sitemap.ts` — add `/gallery`, use `canonical()`
- [x] `app/robots.ts` — use `canonical()`
- [x] `.claude/rules/seo.md` — new standing SEO rule
- [x] Docs: PRD §3 + §11 SEO, TECH_SETUP Part 15, DESIGN_SYSTEM v2.14 + Implementation Map
- [x] Verify: `/`+`/gallery`+`/about` 200; home has `WebSite`+`SearchAction`+`Organization` JSON-LD, canonical, OG, `<h1>` "A living gallery.", CTA, 6 preview cards; gallery has `CollectionPage`, canonical, `<h1>` "Preloved treasures."; sitemap lists `/`,`/gallery`,`/about`,`/wishlist`,items; robots blocks `/admin`,`/api/`; tsc + eslint clean
- [ ] Design fidelity: 1:1 compare simplified gallery hero vs jackwatkins.co/works — deferred (needs live reference-site browser session; hero change is a copy/structure simplification reusing existing tokens only)
