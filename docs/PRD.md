# Product Requirements Document: Give It a Second Life

**Project:** Give It a Second Life — Preloved Items Platform  
**Version:** 1.1  
**Date:** July 2026  
**Author:** Akbar  

> **Rebrand (v1.1):** The product was renamed from "Selling Preloved Items" to
> **"Give It a Second Life"**. Public wordmark is `Second Life°` (navbar/footer).
> All user-facing copy is brand-only — the curator's personal name ("Akbar") was
> removed from the storefront (About, footer, item detail, JSON-LD `founder`).
> Akbar remains the internal author/single seller (see `seller_akbar` data id).

---

## 1. Executive Summary

A curated, visually-stunning marketplace for buying and selling preloved items. The MVP launches as a single-seller gallery showcasing Akbar's preloved collection with a foundation built for future multi-seller expansion. Design inspiration: Jack Watkins' portfolio site (jackwatkins.co/works) — clean grid layouts, minimal aesthetic, high-impact imagery.

**Target Market:** Sustainability-conscious consumers, collectors & enthusiasts across categories (fashion, tech, homeware, and more), bargain hunters  
**MVP Timeline:** Single-seller phase  
**Future Vision:** Multi-seller marketplace with commission-based revenue

---

## 2. Business Model

### Phase 1: MVP (No Revenue)
- **User Base:** Akbar as sole seller
- **Revenue:** None (community building phase)
- **Buyer Interaction:** Items showcase only; contact via WhatsApp for purchases
- **Goal:** Build audience, validate product-market fit

### Phase 2: Future (Monetization TBD)
The platform will transition to a revenue model once multi-seller functionality launches. **Three options under consideration:**

| Model | Buyer Cost | Seller Cost | Best For |
|-------|-----------|-----------|----------|
| **Buyer Pays** (Vinted-style) | 3-8% buyer protection fee | 0% commission | Large volume, price-sensitive buyers |
| **Seller Pays** (Depop-style) | Free | 3-5% commission | Seller experience, quality curation |
| **Hybrid** | Small buyer fee | Small seller fee | Balanced ecosystem |

**Decision Point:** Revenue model will be finalized before multi-seller launch based on user feedback and market data.

---

## 3. Product Scope

### MVP Features (Phase 1)

#### 3.1 Core Functionality
- **Home Page** (`/`)
  - A deliberately simple landing page that funnels visitors toward the gallery
  - Minimal hero (eyebrow + single serif line + one-line subhead) with a single
    **"Enter the gallery"** CTA
  - A small **"Latest arrivals"** preview strip — the 6 newest items as cards, with a
    "View the full gallery →" link (real content + internal links for SEO, without the
    weight of the full gallery)
  - SEO: page description, canonical `/`, Open Graph, and `WebSite` (+ `SearchAction`)
    plus `Organization` JSON-LD; registered in the sitemap at priority 1

- **Item Showcase Gallery** (moved to `/gallery`; `/` is now the home page)
  - Grid layout (inspired by Jack Watkins portfolio)
  - Minimal single-line hero (eyebrow + serif `<h1>`), matching the reference
  - 2-4 columns responsive design
  - High-resolution images with hover overlays
  - Item metadata: title, description, category, price, condition
  - **Infinite scroll** — the gallery loads in batches of 8 as the user scrolls (no
    pagination UI). The first batch is server-rendered; subsequent batches append on
    the client via `/api/items?limit&offset`, with skeleton-card placeholders while a
    batch loads. Keeps the DOM and initial query light at catalog scale (see
    TECH_SETUP § 13)

- **Search & Filtering**
  - Search by item name/keywords
  - Filter by: category, price range, condition (new, like-new, good, fair)
  - Sort by: newest, price (low-high, high-low)

- **Wishlist / Favorites**
  - Users can save items to personal wishlist
  - Wishlist persists with browser localStorage
  - Quick view wishlist page

- **Item Detail View**
  - Image showcase with **prev/next carousel arrows** + thumbnail strip
  - **Click any image to open a full-screen lightbox** (arrows, thumbnails, keyboard
    ←/→, Esc/click-outside close)
  - Shimmer **skeleton** while an image decodes so switching photos never shows a
    blank/laggy pop
  - Complete item description, rendered with structure — blank-line paragraphs,
    `HEADER:` section titles, and `•`/`-`/`*` bullet lists parsed from the stored
    plain text (no run-on flattening); long descriptions collapse behind a fade
    with a "Read full description" toggle
  - Condition notes
  - Size/dimensions if applicable
  - "Contact via WhatsApp" button
  - Seller info (Akbar's name, bio)

- **Admin Item Management** (Clerk-gated `/admin`, single owner)
  - Create items (title, price, category, condition, size/color/material, image uploads)
  - **Multi-image upload with reordering** — drag-and-drop uploader; drag thumbnails to
    reorder; the first image is the catalog cover (see TECH_SETUP § 8.4)
  - **Media gallery picker** — a single **+ Add images** button opens a modal with two
    tabs: **Gallery** (grid of images already uploaded to Cloudinary, select to reuse
    without re-uploading) and **Upload** (drag-drop / browse new files). Reuses avoid
    duplicate uploads; the gallery lists the Cloudinary folder newest-first with
    pagination (see TECH_SETUP § 9)
  - **Edit** any existing item — update fields and replace its image set
  - **Delete** any existing item — removes it and its images
  - **Reorder products** — drag items in the admin list to set the catalog order; this
    order drives the public gallery's default view (price sort still overrides). Persisted
    via `PATCH /api/items/reorder` (see TECH_SETUP § 8)
  - **Mark Sold / Available** — a sold item stays visible in the public catalog with a
    centered **Sold out** tag on its card, and remains in the admin list for management
    (see § 12 inventory)
  - **Admin auth via Clerk** — `/admin` and every mutating endpoint
    (`POST`/`PATCH`/`DELETE`, plus `GET /api/media`) require a signed-in Clerk user
    whose `publicMetadata.role === "admin"` (the single owner). No shared password;
    the browser sends no auth header (Clerk session cookie). See TECH_SETUP § 7.

#### 3.2 Contact Flow (MVP)
- WhatsApp contact button on each item
- Pre-filled message template: "Hi! I'm interested in [Item Name]. Is it still available?"
- Direct link to WhatsApp chat

#### 3.3 Newsletter Signup
- Optional email subscription (inspired by Jack Watkins site)
- "Get notified when new items drop"
- No algorithm-driven emails; curated notifications only

#### 3.4 About Page (MVP)
A static `/about` page that states the product's purpose and the seller's story, so
visitors landing from search or an item link understand *why* the gallery exists.
- **Mission** — "extend the lifecycle of beautiful things"; curated, gallery-first,
  one-of-a-kind (speaks to all three audience segments: sustainability, value, discovery)
- **How it works** — browse the gallery → message the seller on WhatsApp → give it a
  second life
- **Seller intro** — short first-person bio from Akbar, the curator
- **SEO** — page metadata (title via root template, description, canonical), Open Graph,
  and `AboutPage` + `Organization` JSON-LD; registered in the sitemap
- Linked from both the Navbar and the Footer

#### 3.5 Animated Page Transitions (MVP)
Route changes are choreographed instead of hard-swapping, so navigation reads as one
continuous motion (removes the brief "load pop" between pages). Built on React 19's
native `<ViewTransition>` — no animation library.
- **Fade-rise** default on any untyped navigation (fade + blur + slight upward rise)
- **Directional blur-slide** — forward navigations (into the gallery, an item, wishlist,
  search) slide content in from the right; back navigations (home/logo, an item's
  "← Gallery") reverse it
- **Shared-element morph** — a gallery/carousel card cover tweens into the item detail
  hero image (same image, visual continuity)
- Navbar and the aurora background stay anchored (do not move/flicker) during transitions
- Fully disabled under `prefers-reduced-motion` (instant swap); degrades to a plain swap
  in browsers without View Transitions support

#### 3.6 Admin-Editable Site Content & SEO (MVP)
The admin can edit the site's high-value marketing copy and per-page SEO from the seller
studio — no code change or redeploy needed. Backed by a `site_content` store that overrides
code defaults, so the site always renders even with an empty table.
- **Editable copy** — Home hero (eyebrow, heading, subheading, CTA, arrivals labels), the
  About page (hero, mission, "how it works" steps, curator, CTA), and the item page's
  seller block (label, name, bio). Structural UI (nav labels, buttons, footer copyright,
  empty states, 404) stays in code — out of scope.
- **Editable SEO** — per-page meta title, meta description, and Open Graph image for Home,
  Gallery, and About. Pages read these via `generateMetadata`, falling back to `lib/seo.ts`
  defaults; the OG image is chosen with the existing Cloudinary media picker.
- **Dedicated admin chrome** — `/admin` no longer renders the public navbar/newsletter/footer.
  It has its own slim top bar (brand, Items/Content/SEO tabs, account button); public pages
  live under an `app/(site)` route group with unchanged URLs.
- **Acceptance** — edits persist and reflect on the public pages after save (affected routes
  are revalidated); reads/writes require an admin session (`isAdmin()`); missing rows fall
  back to defaults.

### Phase 2 Features (Future Scope)
- Multi-seller onboarding & authentication (extends the MVP Clerk single-admin setup)
- Seller ratings & reviews
- In-app messaging system
- Payment processing (Stripe/PayPal)
- Order tracking & shipping integration
- Seller analytics dashboard
- Commission collection system

---

## 4. Technical Architecture

### Tech Stack
- **Frontend:** Next.js 16.2.10 LTS + React 19.2
- **Styling:** Tailwind CSS
- **Database:** Neon (Serverless PostgreSQL)
- **Authentication:** Clerk — gates the single-owner `/admin` in MVP (role `admin`);
  multi-seller onboarding auth is Phase 2. Buyers contact via WhatsApp (no buyer login).
- **Image Storage:** Cloudinary (free tier)
- **Hosting:** Vercel (free tier)
- **Communication:** WhatsApp API (client-side redirect)

### Database Schema (MVP Phase)

#### Items Table
```
- id (PK)
- title (string)
- description (text)
- category (enum: clothing, accessories, home, books, electronics, vehicles, other)
- condition (enum: new, like-new, good, fair)
- price (decimal)
- images (array of image URLs)
- size (string, optional)
- color (string, optional)
- material (string, optional)
- seller_id (FK to sellers table)
- created_at (timestamp)
- is_sold (boolean, default: false)
```

#### Wishlist Table (Phase 2)
```
- id (PK)
- user_id (FK)
- item_id (FK)
- created_at (timestamp)
```

---

## 5. User Flows

### Flow 1: Browse & Discover Items
1. User lands on homepage
2. Views gallery grid of all items
3. Applies filters (category, price, condition)
4. Searches for specific items
5. Clicks item to view details

### Flow 2: Wishlist Management
1. User clicks heart/star icon on item card
2. Item added to wishlist
3. User navigates to "My Wishlist" page
4. Can remove items or sort wishlist

### Flow 3: Make a Purchase (MVP)
1. User clicks "Contact via WhatsApp" on item detail
2. WhatsApp opens with pre-filled message
3. Conversation happens directly with seller
4. Payment/shipping negotiated outside platform

### Flow 4: Newsletter Signup
1. User scrolls to footer
2. Enters email in subscription box
3. Receives confirmation
4. Gets notified of new item drops (manual sends from admin)

---

## 6. Design System & Visual Requirements

### Inspiration Source
**Jack Watkins Portfolio** (jackwatkins.co/works)
- Clean, minimal aesthetic
- High-impact imagery dominates
- Strategic use of white space
- Elegant typography
- Hover states with "View work" overlay → adapt to "View item" / "Add to wishlist"

### Design Tokens

#### Color Palette
- **Primary:** Off-white / cream (#FAFAFA)
- **Secondary:** Charcoal / dark gray (#2A2A2A)
- **Accent:** Gold / warm brown (#D4A574) — for highlights, CTAs
- **Neutral:** Light gray (#E8E8E8)

#### Typography
- **Headlines:** serif font (Playfair Display or similar) - 48px-64px
- **Body:** sans-serif (Inter, Poppins) - 14px-16px
- **Caption:** 12px, gray

#### Spacing
- Base unit: 8px grid
- Padding: 16px, 24px, 32px, 48px
- Gap between grid items: 24px-32px

#### Components
- **Item Card**
  - Aspect ratio: 1:1 (square)
  - Image with dark overlay on hover
  - "View item" text appears on hover
  - Title, price, condition badge below image
  - Heart icon for wishlist (top-right corner)

- **Buttons**
  - "Contact via WhatsApp" — solid button with icon
  - "View item" — overlay text
  - Subscribe button — minimal, outlined

- **Navigation**
  - Sticky header with: logo, nav links, search bar, wishlist icon
  - Mobile: hamburger menu

- **Filters Sidebar**
  - Sticky on desktop, collapsible on mobile
  - Category checkboxes
  - Price range slider
  - Condition badges
  - Clear filters link

### Responsive Breakpoints
- **Desktop (1024px+):** 4-column grid
- **Tablet (768px-1023px):** 2-column grid
- **Mobile (< 768px):** 1-column grid

---

## 7. Success Metrics (MVP Phase)

| Metric | Target | Notes |
|--------|--------|-------|
| **Unique Visitors/Month** | 500+ | Build audience phase |
| **Items Browsed** | 2+ items/session | Engagement metric |
| **Wishlist Adds** | 10%+ of visitors | Interest indicator |
| **WhatsApp Inquiries** | 5+ per month | Purchase intent |
| **Newsletter Subscribers** | 100+ | Community building |
| **Page Load Time** | < 2s | Performance baseline |
| **Mobile Traffic %** | 40%+ | Growing mobile adoption |

---

## 8. Competitive Landscape

### Market Overview (2026)
- Global resale apps market: $67.5B (2026) → $170B (2034)
- CAGR: 12.3%
- Key players: Vinted (75M+ users), Depop (30M+), Poshmark (20M+)

### Revenue Models in Market
| Platform | Seller Fee | Buyer Fee | Notes |
|----------|-----------|-----------|-------|
| **Vinted** | 0% | 3-8% buyer protection | Zero-fee seller leader |
| **Depop** | 3.3% + $0.45 | Free | Trend-driven, under-26 focus |
| **Poshmark** | 20% | Free | Brand-driven, US-dominant |

### Our Differentiation (Phase 2)
- **Curated aesthetic:** Gallery-first design (vs. marketplace-first)
- **Community-driven:** Sustainability focus
- **Flexible model:** TBD revenue strategy based on user feedback
- **Niche focus:** Initially high-end/designer preloved (can expand)

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Low initial traction | No growth signal | Focus on visual design, SEO, social sharing |
| WhatsApp friction | Lost sales | Consider adding in-app messaging early |
| Image quality issues | Poor user experience | Set clear photography guidelines, use Cloudinary optimizations |
| Scaling to multi-seller | Complex onboarding | Plan seller verification & commission logic early |
| Payment complexity | Delayed revenue | Evaluate payment APIs (Stripe, Wise) pre-Phase 2 |

---

## 10. Roadmap

### Phase 1: MVP (Weeks 1-4)
- [ ] Design system & Figma components
- [ ] Homepage, gallery, item detail pages
- [ ] Search & filter functionality
- [ ] Wishlist feature (localStorage)
- [ ] WhatsApp integration
- [ ] Newsletter signup
- [ ] Mobile-responsive design
- [ ] SEO optimization
- [ ] Deploy to Vercel

### Phase 2: Optimization (Weeks 5-8)
- [ ] Analytics setup (Google Analytics, Hotjar)
- [ ] A/B testing on CTAs
- [ ] Performance optimization (image CDN)
- [ ] User feedback collection
- [ ] In-app messaging system (preparation)

### Phase 3: Multi-Seller Foundation (Weeks 9+)
- [ ] Seller onboarding flow
- [ ] Authentication (login/signup)
- [ ] Seller dashboard
- [ ] Payment processing integration
- [ ] Commission logic & tracking
- [ ] Seller verification workflow

---

## 11. Content Strategy

### Initial Item Catalog
- **Launch with:** 15-30 high-quality items from Akbar's collection
- **Categories:** Any preloved item — clothing, accessories, home & décor, books, electronics, vehicles, and more (`other` catch-all). Not fashion-only.
- **Pricing:** Market-aligned for condition & brand
- **Photos:** Professional, consistent lighting & styling

### Item Descriptions
- **Format:** Compelling, benefit-driven (not just spec dumps)
- **Length:** 150-300 words
- **Include:** Brand, size, condition details, wear notes, styling tips
- **Tone:** Conversational, Instagram-like voice

### SEO Strategy
- Meta titles: "[Brand] [Item] | Preloved [Category] – Give It a Second Life"
- Meta descriptions: Include condition, size, price, brand
- Alt text for all images
- Structured data per page type: `Product` on item pages; `CollectionPage` on `/gallery`;
  `WebSite` (+ `SearchAction`) and `Organization` on `/`; `AboutPage` + `Organization` on `/about`
- Every public page carries a unique `<h1>`, title, description, canonical, and Open Graph
- `metadataBase` set on the root layout so Open Graph / canonical URLs resolve absolutely
- Absolute URLs + shared JSON-LD builders live in `lib/seo.ts` (single source, reads `NEXT_PUBLIC_SITE_URL`)
- Sitemap includes home `/`, `/gallery`, `/about`, `/wishlist`, and every item page
- SEO is enforced as a standing rule for all future work — see `.claude/rules/seo.md`

---

## 12. Dependencies & Questions for Future Phases

1. **Shipping Strategy:** How will items be shipped? (Seller arranges, platform handles, local pickup only?)
2. **Returns Policy:** What's the return window and who pays for returns?
3. **Seller Onboarding:** Verification requirements for multi-seller phase?
4. **Inventory Management:** Sold items are handled via the admin **Mark Sold** toggle
   (`is_sold` flag) — shown in the public catalog with a **Sold out** tag, retained in the
   admin list. Restocks and multi-quantity inventory remain open for a future phase.
5. **Commission Timing:** When does the platform collect commission? (Before delivery, after verification?)

---

## 13. Appendix: Design Reference

**Inspiration:** jackwatkins.co/works

**Key Elements to Adapt:**
- Grid-based item showcase (use as-is for preloved items)
- "A living gallery" hero → adapt to "Discover preloved treasures" or similar
- Hover overlay with action button (change from "View work" to "View item")
- Newsletter signup section → modify copy to "Get notified when new items drop"
- Clean footer with links & social

---

**Document Status:** Draft Ready for Review  
**Next Steps:** Design kickoff, tech setup, initial item photography
