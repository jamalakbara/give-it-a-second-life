# SEO Rule

Every public-facing surface of this site must be search-engine ready. SEO is not a
finishing pass — it is part of "done" for any page, route, or content change. If a
change adds or alters something crawlers can see, keep its SEO metadata, structured
data, and sitemap/robots in sync **in the same task**.

## When this applies

Whenever a change touches something search engines index:

- A new public page or route (`app/**/page.tsx`) — home, gallery, item, about, etc.
- A change to a route path (moving, renaming, or removing a page)
- New indexable content or a new content type users and crawlers can reach
- A change to a page's title, description, canonical URL, or social preview
- A change to headings (`<h1>`/`<h2>`) or images (which need `alt` text)
- Anything that affects `app/sitemap.ts`, `app/robots.ts`, or `metadataBase`

If you are unsure whether a change is "SEO-relevant," it is — err toward updating.

## What to do

1. **Page metadata** — every public, indexable page exports `metadata` (or
   `generateMetadata` for dynamic routes) with, at minimum:
   - a unique `title` (root layout in `app/layout.tsx` provides the `%s` template)
   - a `description` written for humans and keywords
   - `alternates.canonical` (path form, e.g. `"/gallery"` — `metadataBase` makes it absolute)
   - `openGraph` (title, description, url, type; images where a page has a hero/cover)
2. **Structured data (JSON-LD)** — add the right schema per page type via a
   `<script type="application/ld+json">` block:
   - Item detail → `Product` (with `Offer`, price, currency, condition)
   - Gallery → `CollectionPage`
   - Home → `WebSite` (+ `SearchAction`) and `Organization`
   - About → `AboutPage` and `Organization`
3. **Headings & images** — exactly one `<h1>` per page, unique and keyword-bearing
   even when the visual is minimal (a one-line hero still gets a meaningful `<h1>`).
   Every `<Image>`/`<img>` carries descriptive `alt` text.
4. **Routes → sitemap & robots** — when a route is added, renamed, or removed, update
   `app/sitemap.ts` (and `app/robots.ts` if crawlability changes) in the same task.
   Non-public routes (`/admin`) stay disallowed.
5. **Absolute URLs come from one place** — use the helpers/constants in `lib/seo.ts`
   (`SITE_NAME`, `SITE_URL`, `canonical()`, `websiteJsonLd`, `organizationJsonLd`),
   which read `NEXT_PUBLIC_SITE_URL`. Do not hardcode the base URL or site name per file.
6. Follow the [[requirement-intake]] and [[task-workflow]] rules; if the change is
   visual, follow [[design-system-sync]] too.

## What does NOT apply

- Non-indexed routes (`/admin`), API routes (`app/api/**`), and anything behind auth
- Pure logic, data, or refactor changes with no crawlable/visual outcome
- One-off copy tweaks that change no title, description, heading, or structured data

A change is not "done" until its metadata, structured data, and — for route changes —
`app/sitemap.ts`/`app/robots.ts` reflect the new reality.
