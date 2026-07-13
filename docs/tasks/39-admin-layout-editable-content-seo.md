# 39 — Admin layout + editable site content & SEO

## Goal

Give `/admin` its own chrome (no public navbar/newsletter/footer), and let the admin
edit high-value marketing copy and per-page SEO (title/description/OG image) from the
admin panel, backed by a code-defaulted content store.

## Scope

**In**
- Part A: route-group refactor (`app/(site)/`) so public chrome no longer wraps `/admin`;
  dedicated `app/admin/layout.tsx` with a slim top bar + Items/Content/SEO tabs.
- Part B: `site_content` table + `lib/content` defaults/merge + `lib/data/siteContent`
  adapter; `/api/site-content` GET/PATCH (admin-guarded); wire home hero, about copy,
  item seller bio to content; per-page SEO override for home/gallery/about/item; admin
  Content + SEO forms.

**Out**
- Editing nav labels, button text, footer copyright, empty states, 404 (stay in code).
- Rich text / markdown editing (plain text fields only).
- Versioning / draft-preview of content.

## Checklist

### Part A — admin layout
- [x] Create `app/(site)/layout.tsx` holding `<Navbar/>` + `<main>` + `<Footer/>` and the transition template scope
- [x] Move public routes into `app/(site)/` (page, gallery, about, items, wishlist, template, not-found)
- [x] Slim `app/layout.tsx` to html/body/ClerkProvider/fonts/AuroraGL only
- [x] Add `app/admin/layout.tsx` — slim top bar (logo, tabs, UserButton), noindex
- [x] Verify all public URLs unchanged (build route table) + `/admin` 307→sign-in. Visual "no public chrome" confirmed by code (admin sits outside `(site)` group); a signed-in visual pass is left to the owner.
- [x] Update `docs/DESIGN_SYSTEM.md` (admin layout pattern §2.11)

### Part B — editable content + SEO
- [x] Add `site_content` table to `lib/db/schema.sql` (applied via `npm run db:setup`)
- [x] `lib/content/defaults.ts` — typed content + SEO defaults seeded from current strings
- [x] `lib/content/merge.ts` deep-merge helper
- [x] `lib/data/siteContent.ts` + `.neon.ts` + `.mock.ts` adapter (getContent/updateContent)
- [x] `app/api/site-content/route.ts` — GET + PATCH, `isAdmin()` guard, revalidatePath
- [x] Wire home hero + arrivals labels to `getContent()`
- [x] Wire about page copy (hero/mission/steps/curator/CTA) to `getContent()`
- [x] Wire item seller bio to `getContent()`
- [x] Per-page SEO override: home/gallery/about `generateMetadata`, item metadata, About JSON-LD (mission)
- [x] `components/AdminContentPanel.tsx` + `components/AdminSeoPanel.tsx` (named as panels, not Form/SeoForm)
- [x] AdminDashboard: Items/Content/SEO tab panels (`components/AdminTabs.tsx`)
- [x] Update `docs/PRD.md` (§3.6) + `docs/TECH_SETUP.md` (Part 16)
- [x] Verify: typecheck + lint (no new issues) + `npm run build` green; dev smoke — home/about copy renders, GET/PATCH 401 unauth, `/admin` 307. Signed-in edit→save visual pass left to owner.

### Part C — top bar refinement (v2.26)
- [x] Narrow admin bar width (`max-w-[760px]`); height kept at public navbar's `h-14`/`md:h-16`
- [x] Center tabs via 3-col grid (`grid-cols-[1fr_auto_1fr]`), equal side columns
- [x] Vertically center Clerk `<UserButton>` (`flex h-full items-center` wrapper)
- [x] SEO OG image reuses item form's dashed dropzone + preview thumbnail (consistent picker)
- [x] Sync `docs/DESIGN_SYSTEM.md` (v2.26 note)
