# Task 09: SEO + Polish + Design Fidelity

## Goal
SEO metadata, responsive QA, and pixel-perfect design verification against jackwatkins.co/works.

## Scope
- In: metadata, JSON-LD, sitemap/robots, responsive QA, design fidelity check vs reference
- Out: analytics setup (Phase 2), deployment

## Checklist
- [x] Per-page metadata per PRD §11 format, OpenGraph tags
- [x] Product JSON-LD on item detail pages
- [x] `sitemap.ts` + `robots.ts`
- [x] Images via `next/image` with lazy loading + alt text
- [x] Keyboard focus states on all interactive elements
- [x] Responsive QA at 375 / 768 / 1024 / 1440
- [x] Design fidelity: screenshot jackwatkins.co/works + local site at 1440/768/375, compare grid, card ratio, hover overlay, hero typography, whitespace, newsletter + footer structure
- [x] Token audit vs DESIGN_SYSTEM.md: colors, font sizes, spacing, radius, 200ms transitions
- [x] Fix all mismatches found
- [x] `npm run build` + `npm run lint` clean
