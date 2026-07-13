# 37 — Surface full brand title (footer + About H1)

## Goal
The navbar can't carry the long real title "Give It a Second Life", so keep the
short `Second Life°` wordmark in the nav but give the full title two prominent,
human-visible homes: the footer wordmark and the About page H1.

## Scope
**In:**
- Footer wordmark → full title `Give It a Second Life°`; drop the now-redundant
  full name from the copyright line.
- About hero H1 → `Give It a Second Life`; move "Why preloved" to the kicker so the
  `preloved` keyword stays above the fold.
- Sync `docs/DESIGN_SYSTEM.md` (footer wordmark + About H1).

**Out:**
- Navbar wordmark stays short (`Second Life°`) — that's the width problem being solved.
- Home hero unchanged (already surfaces the full title as its eyebrow).
- `SITE_NAME` / SEO constants / JSON-LD unchanged (already the full title).

## Checklist
- [x] Footer wordmark → `Give It a Second Life°` (`components/Footer.tsx`)
- [x] Footer copyright drops redundant full name → `© YEAR — curated with care…`
- [x] About eyebrow → "Why preloved" kicker (`app/about/page.tsx`)
- [x] About H1 → `Give It a Second Life` (one H1, keyword kept in kicker)
- [x] `docs/DESIGN_SYSTEM.md` v2.24 note (footer + About H1)
- [x] SEO check: About metadata/canonical/AboutPage JSON-LD still valid; no route/sitemap change
