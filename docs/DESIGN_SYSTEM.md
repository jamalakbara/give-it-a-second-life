# Design System: Give It the Second Life

**Design Reference:** jackwatkins.co/works (live, inspected July 2026)
**Aesthetic:** Dark "living gallery" — near-black stage, drifting aurora glow, high-contrast serif display, glassmorphic UI, large staggered imagery
**Status:** MVP Design System — v2.23 (logotype font reverted Telma → Kola)

> **Note (v2.23):** The **"Second Life°" logotype** reverted back to **Kola** (the v2.21 choice) —
> the brief Telma experiment (v2.22) is dropped and Telma removed. Headings (Tanker) and body
> (Clash Display) unchanged. See §1.2.

> **Note (v2.21):** Headings now use **Tanker** (self-hosted display, `font-serif`). The logotype
> was scoped to its own `font-logo` token (`--font-logo`), applied in `Navbar.tsx` + `Footer.tsx`.
> Clash Display (body/UI) unchanged. See §1.2.

> **Note (v2.20):** Typography swapped to **self-hosted** fonts (§1.2). Kola replaced Playfair on
> the `font-serif` slot; **Clash Display** (variable sans, 200–700) replaced Inter on `font-sans`.
> Loaded via `next/font/local` from `app/fonts/*.woff2` — no more Google Fonts request.

> **Note (v2.19):** The nav no longer shows a **Sell** link. The admin dashboard (`/admin`)
> is now gated by **Clerk** auth (role `admin`) instead of the old client-side password
> form — its header uses Clerk's `<UserButton>`. See §2.3 (nav) + §2.6 (Admin access).

> **Note (v2.17):** The home "Latest arrivals" carousel (§2.10) **no longer uses a sticky pin**.
> The old `sticky top-…` inside a tall `min-h-[calc(50svh+36rem)]` section held vertical page
> scroll for a ~200–300px range that felt like the scroll being **"stuck"** when passing the
> strip. The section is now a plain `relative py-16` block so the carousel flows with the page
> and scroll never stalls. Scatter, peek, mask, caption, and dashes are unchanged.

> **Note (v2.16):** Rebrand from "Selling Preloved Items" → **"Give It the Second Life"**.
> The navbar/footer **wordmark** is now the serif text **`Second Life°`** (short form with a
> trailing degree glyph `&deg;`) — same serif/size/weight as before, text-only (no image asset).
> Full brand name "Give It the Second Life" is used for the hero eyebrow, page titles, and
> JSON-LD. No token, layout, or motion change.

> **Note (v2.15):** The home **preview strip** "Latest arrivals" is now a **scattered carousel** (`components/ArrivalsCarousel.tsx`) instead of a static grid — matched to the Gucci-Beauty reference. A horizontal **scroll-snap** track of the 6 newest 280px cards where each **fans out** the further its center sits from the track's viewport center: `rotate` up to **±7°**, `translateY` up to **22px** (side cards drop below the centered one), `scale` down to **~0.86**, and `brightness` down to **~0.5**. Cards use `CardMedia`'s **`blendEdges`** treatment (rounder corners + feather vignette + bloom shadow) so they melt into the aurora. The **centered card** is upright, largest and brightest; cards **peek** off both edges (side padding `calc((100% − 300px)/2)`, 300px cards). A **single centered caption** (category · serif title · price · condition chip) shows the **active** card only; below it, **progress dashes** (active = 28px wide `#e0533d`, others 14px hairline, click smooth-scrolls that card to center) and a "Swipe to discover" hint. All per-frame transforms are written to CSS vars (`--rot/--ty/--scale/--dim/--z`) on `requestAnimationFrame` (same pattern as `CardMedia`); React state holds only the active index. **Reuses `CardMedia` unchanged** — its cursor 3D-tilt (`rotateX/Y` inside `perspective:800px`) composes on top of the 2D scatter. **Reduced-motion / SSR:** scatter stays off until after mount and entirely under `prefers-reduced-motion`, degrading to an upright horizontal scroll row. Home-only; gallery masonry (§2.9) is unchanged. See §2.10 + §6.

> **Note (v2.14):** The site now has a **dedicated home page** at `/` and the gallery moved to **`/gallery`**. The home page is intentionally minimal to funnel visitors into the gallery: a tall centered **hero** (eyebrow + one serif line "A living gallery." + one-line subhead + a **cream "Enter the gallery" CTA pill**), followed by a **preview strip** — a heading row ("Latest arrivals" + "View the full gallery →") over the 6 newest items (see §2.10 for the current carousel treatment; originally a 2-col / md:3-col grid). The **gallery hero** was simplified to match the reference exactly: just the tracked eyebrow + a single serif `<h1>` ("Preloved treasures."), with the old descriptive paragraph removed. Both surfaces reuse existing tokens/components only. See §6 Implementation Map.

> **Note (v2.13):** The gallery grid now loads via **infinite scroll** (`components/ItemGrid.tsx`) instead of rendering the whole catalog at once. The first batch of **8** is server-rendered; an `IntersectionObserver` sentinel (`rootMargin: 600px`) appends the next 8 as the user nears the bottom. While a batch loads, **skeleton cards** — a `.skeleton` `aspect-[3/4]` media box + two shimmer text lines, matching `ItemCard`'s footprint — fill the column tails so nothing shifts. The two-column staggered masonry now lives in `ItemGrid` (moved out of `app/page.tsx`). See §2.9.

> **Note (v2.12):** Every content image now renders through a single reusable primitive, **`SmoothImage`** (`components/SmoothImage.tsx`) — `next/image` in `fill` mode with the shared `.skeleton` shimmer shown while decoding, cross-fading in on load, and native `loading="lazy"` on all non-`priority` images. It replaced the hand-rolled skeleton logic in `ImageGallery` and the bare `next/image` in `CardMedia`, and the plain `<img>` tags in the admin surfaces (`MediaPicker`, `SortableImageGrid`, `AdminItemList`) — so admin thumbnails are now optimized + lazy too. See §2.8.

> **Note (v2.11):** The wishlist control icon changed from a **heart to a 5-point star** (`StarIcon`, `components/icons.tsx`) — a "favorite"/collect metaphor. Same `filled`-on-active behavior, same `--color-accent` color, same glass circle + count badge; only the glyph changed. Text below that says "heart" refers to this same star control.

> **Note (v2.10):** The wishlist star / notification badge / error text moved off the reused `aurora-rose` bloom onto a dedicated **`--color-accent` (#e0533d warm brick-red)** so the accent pops off the terracotta background instead of blending in. Aurora tokens are now background-glow only.

> **Note (v2.9):** The background palette shifted from the cool night-sky to a **warm terracotta / clay** set (medium-dark warm brown-black base `#14100b`, terracotta / ochre / sand / brick / deep-umber blooms) across both the WebGL mesh-gradient and the CSS fallback; text tints returned to warm off-white. Shader pixel cap (`maxPixelCount 800k`) documented in §2.1.

> **Note (v2.8):** The admin image input moved into a **modal media picker** (`components/MediaPicker.tsx`) opened by a single **+ Add images** button. It has two tabs — **Gallery** (selectable grid of images already uploaded to Cloudinary) and **Upload** (the previous drag-drop dropzone) — establishing the app's first reusable **modal + tab + selectable-grid** pattern (see §2.6).

> **Note (v2.7):** The background became a **WebGL fluid mesh-gradient** (`@paper-design/shaders-react` `<MeshGradient>`, `components/AuroraGL.tsx`), and the whole palette shifted from warm magenta/rose to a cool **indigo/blue/cyan/mint/teal night-sky**. The static CSS aurora (`components/Aurora.tsx`) is retained as the SSR / reduced-motion / no-WebGL fallback.

> **Note (v2.0):** The original v1.0 spec described a *light* cream/charcoal/gold adaptation. The live reference is a **dark aurora** portfolio, so the system was rebuilt to match it pixel-for-pixel. Tokens below reflect what is actually implemented in `app/globals.css` (Tailwind v4 `@theme`).
>
> **Note (v2.1):** The item-card hover was matched 1:1 to the reference by inspecting its computed styles — magnetic cursor-following pill + `perspective: 800px` 3D tilt, no dim overlay (see §2.4). Gallery grid geometry (480px columns, 160px gaps, ~254px stagger) was measured off the reference too.
>
> **Note (v2.3):** The admin image input became a full **drag-and-drop dropzone** with reorderable thumbnails (first = cover), and the admin product list became **drag-to-reorder** (auto-saves catalog order). Both drag surfaces use `@dnd-kit` (see §2.6 image upload + admin list).

---

## 1. Design Tokens

All tokens live in `app/globals.css` under `@theme` and are consumed as Tailwind utilities (`bg-void`, `text-fg`, `glass`, etc.).

### 1.1 Color Palette

#### Base (dark stage — warm terracotta / clay, medium-dark)
```
Void   #14100b   — app background (warm brown-black, slightly lifted)
Ink    #1a140d   — darkened content sections (the .veil overlay target)
Cream  #faf5ee   — light surface for solid CTAs & light text on dark
```

#### Foreground (warm off-white on dark)
```
fg        rgba(250,245,238,0.88)  — primary text / headings
fg-muted  rgba(250,245,238,0.55)  — body copy, secondary
fg-faint  rgba(250,245,238,0.38)  — eyebrows, captions, meta labels
```

#### Glass surfaces (frosted translucency)
```
glass         rgba(250,245,238,0.06)  — pills, cards, chips
glass-strong  rgba(250,245,238,0.10)  — hover state
hairline      rgba(250,245,238,0.14)  — borders / dividers / rings
```
Applied via the `.glass` utility = translucent fill + hairline border + `backdrop-filter: blur(18px) saturate(1.2)`.

The **sticky navbar** uses a stronger `.glass-nav` variant so overlapped content reads as a heavy frosted veil (matches jackwatkins.co header): light dark warm fill `rgba(28,20,12,0.22)` + hairline border + `backdrop-blur-sm backdrop-saturate-150` (≈`blur(8px)`). Subtle tint + faint frost so overlapped card images / aurora stay clearly visible, just gently glazed — a real-glass sheen, not an opaque veil.

> **Build gotcha:** Lightning CSS (Tailwind v4) **prunes hand-written `backdrop-filter`** from `globals.css`, silently killing the frosted effect. Two workarounds are in use: `.glass` wraps its `backdrop-filter` in an `@supports (backdrop-filter: ...)` block (survives pruning); `.glass-nav` gets its blur from Tailwind's own `backdrop-blur-*` / `backdrop-saturate-*` utilities on the element (Navbar). Do **not** put a bare `backdrop-filter` in `globals.css` — it will vanish at build time.

#### Aurora accents (background glow only — not UI color)
```
aurora-blue     #4a2410   (deep umber — anchors depth)
aurora-violet   #7c3a1d   (brick)
aurora-magenta  #ca8a04   (ochre)
aurora-rose     #c2542f   (terracotta)
aurora-crimson  #d6a35c   (sand)
```
Feed both the WebGL mesh-gradient (`components/AuroraGL.tsx`) and the CSS-blob fallback
(`components/Aurora.tsx`) — **background glow only**. These are muted/dark by design, so they
are no longer reused for UI accents (that made the wishlist star blend into the warm bg).

#### UI accent
```
accent   #e0533d   — warm brick-red (Tailwind: text-accent / bg-accent)
```
The single UI accent — wishlist star (`components/WishlistButton.tsx`), nav notification
badge (`components/Navbar.tsx`), and error/danger text (admin errors + delete, newsletter,
media picker). Brighter and more saturated than the terracotta blooms so it pops off the warm
background and reads clearly as "star / alert."

**No gold.** The v1 gold accent was removed — emphasis comes from contrast (cream-on-void
CTAs), the aurora, and the single coral accent.

### 1.2 Typography

```
Display / Headings : Tanker         (self-hosted display)         → var(--font-serif)
Logotype           : Kola           (self-hosted display serif)    → var(--font-logo)
Body / Sans        : Clash Display  (self-hosted variable sans)    → var(--font-sans)
Weights loaded     : Tanker 400 · Kola 400 (both single weight) · Clash Display 200–700 (variable)
Loading            : next/font/local in app/layout.tsx, woff2 in app/fonts/ (display: swap)
```
All three fonts are self-hosted via `next/font/local` (Indian Type Foundry / Fontshare) —
no Google Fonts request. **Tanker** is the display face on the hero and all headings
(`font-serif`). **Kola** is scoped to the **"Second Life°" logotype only** (`font-logo`,
applied in `Navbar.tsx` + `Footer.tsx`). **Clash Display** is the variable sans for body + UI.

> **Tanker + Kola are single-weight (400).** Headings/logotype still carry `font-medium`
> in markup, but on these faces that class is a visual **no-op** (renders 400) — both
> already read bold/display. Body weight classes (`font-medium`/`font-semibold`) work
> normally on Clash.

#### Type scale (fluid — `clamp()`)
| Token | Size | Use |
|-------|------|-----|
| `text-hero` | `clamp(48px, 9vw, 104px)`, lh 1.02 | Homepage hero, weight 500 |
| `text-h2` | `clamp(32px, 4.5vw, 56px)`, lh 1.1 | Page titles, item title, section heads |
| `text-h3` | `clamp(24px, 2.6vw, 34px)`, lh 1.2 | Sub-heads, empty states |
| Card title | 22px serif, weight 500 | Item card title |
| Body | 16px, lh 1.6–1.7 | Descriptions |
| Small | 13–14px | Secondary text |
| Eyebrow / meta | 10–11px, `.tracked` | Uppercase labels |

#### `.tracked` utility
Uppercase + `letter-spacing: 0.18em` — the signature treatment for nav links, eyebrows ("A LIVING GALLERY"), category labels, badges, button text. Mirrors the reference's spaced-caps navigation and tags.

### 1.3 Spacing & Layout
```
Content max-width : 1240px (nav / footer / detail)
Gallery container : 1120px (measured off reference: 480 + 160 gap + 480)
Stage rim         : body padding 8–10px → aurora peeks around a rounded panel
Section rhythm    : generous — hero min-h 68vh
Gallery gaps      : column ≤160px (lg:gap-x-[160px]), row 160px (lg:gap-40)
Gallery stagger   : right column offset lg:mt-[254px] (reference col-2 offset)
```

### 1.4 Border Radius
```
Pills / nav / buttons / chips : rounded-full
Image cards                   : 6px  (matches reference work-image wrapper)
Panels / glass cards / modals : 24–28px
Stage panel                   : 28px
```
Soft, rounded — the opposite of v1's sharp cards. The whole app sits on a **28px rounded stage** with the aurora glowing around its rim.

### 1.5 Elevation & Blur
- Depth comes mostly from **glass + blur**; `.glass` frosts over the aurora.
- Soft ambient shadows on the raised pieces: nav pill `0 10px 40px -20px rgba(0,0,0,0.8)`; item cards `0 26px 55px -22px rgba(0,0,0,0.7)`; liquid-glass "View Item" pill `0 8px 28px -6px rgba(0,0,0,0.55)`.

---

## 2. Signature Elements

### 2.1 Aurora background (`components/AuroraGL.tsx` + `components/Aurora.tsx`)
**Primary — WebGL fluid mesh-gradient.** `components/AuroraGL.tsx` renders a GPU
`<MeshGradient>` from `@paper-design/shaders-react` filling a `fixed inset-0 z-0` layer over
`#14100b`. A flowing composition of colour spots (the warm terracotta palette — terracotta
`#c2542f`, ochre `#ca8a04`, sand `#d6a35c`, brick `#7c3a1d`, deep-umber `#4a2410`, plus the
void base to keep depth) drifts with organic distortion. Params: `distortion 0.8`,
`swirl 0.35`, **`speed 0.18`** (slow = subtle, so product photos stay hero),
`grainOverlay 0.12`. Rendered pixels are capped (`maxPixelCount 800k`, `minPixelRatio 1`) so
the fullscreen shader stays cheap on retina/integrated GPUs. The same soft radial
center-darkening (`rgba(20,16,11,…)`) and SVG grain overlays from the fallback sit on top for
text legibility + banding control.

**Fallback — static CSS aurora.** `components/Aurora.tsx`: 5 large blurred radial blobs
(same tokens, `blur-[120–150px]`, opacity 0.40–0.80) drifting on slow keyframes
(`drift-a/b/c`, 22–32s). `AuroraGL` renders this instead of the canvas during SSR first
paint, when `prefers-reduced-motion: reduce`, and where WebGL is unavailable.

**Stacking:** background is `fixed inset-0 z-0`; body background is transparent with `html`
painting the void base; content sits in `.stage` at `relative z-10`.

### 2.2 The stage & the veil
- `.stage` — rounded 28px panel, `isolation: isolate`, holds nav + main + footer. All content is transparent so the aurora blooms through it.
- **Background stays fixed through the whole scroll** (matches reference): the single `Aurora` layer is `fixed` and every section is transparent, so the same glow sits behind the page at any scroll position — no per-section darkening.
- `.veil` — now a **transparent no-op hook** kept on gallery / detail / wishlist / admin / footer sections. It used to darken lower content to `ink`, which made the background look "mixed" (colorful hero, flat-dark body); that was removed so the fixed aurora reads consistently. Legibility comes from the aurora's own center vignette + centered content columns.

### 2.3 Navigation — floating glass pill (`components/Navbar.tsx`)
Sticky, centered, `max-w-1240px`, `rounded-full`, `.glass-nav` (heavier frost than `.glass`), h-14/16. Serif wordmark `Second Life°` left (also links Home `/`); `.tracked` links (Home · Gallery · Wishlist · About) center; search field + wishlist star (with `aurora-rose` count badge) right. Mobile: wordmark + star + hamburger → glass dropdown panel with search + links. The admin dashboard is **not** linked here — it lives at `/admin` behind Clerk sign-in (see **Admin access** in §2.6).

### 2.4 Item card — living-gallery showcase (`components/ItemCard.tsx` + `components/CardMedia.tsx`)
Large **portrait 3:4** image, `rounded-6px`, hairline ring. Below image, left-aligned: category eyebrow (`.tracked` fg-faint) · serif title (22px) · row of IDR price + condition glass chip.

**Structure:** `CardMedia` owns the whole hover surface. Hover handlers (enter/leave/move) sit on the **outer** container (so the tilt keeps running even over the heart); inside the tilt layer are three siblings — a full-bleed `<Link>` click-target, the magnetic pill, and the glass wishlist star (top-right). Heart and image thus **tilt together**, and the `<button>`/`<a>` are siblings (no invalid nesting). The heart is a fixed `size-9` perfect circle (`grid place-items-center`) with a centered icon; hovering it hides the "View Item" pill (an `overHeart` flag) so the two controls never overlap.

**Hover interaction (`CardMedia.tsx`, client) — matched 1:1 to the reference by inspecting its computed styles.** Three layers, no dark overlay / no dim / no zoom:
1. **3D tilt ("bottle-cap press")** — outer `[perspective:800px]`, inner media div rotates `rotateX/rotateY` from the normalized cursor offset so the point under the pointer recedes and the far side lifts. `MAX_TILT = 2.5°` (reference is a subtle 2–6°; tune this one constant). Eased `transform 0.6s cubic-bezier(0.16,1,0.3,1)`; resets to flat on leave.
2. **Magnetic "View Item" pill** — a **liquid-glass** pill (`bg-white/15`, `backdrop-filter blur(14px) saturate(1.4)`, `border-white/25`, soft shadow `0 8px 28px -6px rgba(0,0,0,0.55)`, white text, `whitespace-nowrap`) so it reads clearly over any image — brighter than the standard `.glass`. It trails the cursor via a GPU `transform` reading live `--px/--py` vars (`400ms cubic-bezier(0.22,1,0.36,1)`), scales `0.85→1` + fades in on hover, home = center, fades out on leave. The pill center is **clamped** to the card bounds (measured pill half-size + 8px gap) so it never gets clipped by the `overflow-hidden` rounded edge when the cursor rides the border. Sits above the tilt layer.
3. Image itself is undimmed on hover (reference does not darken).

**`blendEdges` prop (opt-in):** for cards shown on the bare aurora (the home carousel, §2.10) `CardMedia` accepts `blendEdges` — rounds corners to `rounded-[14px]`, softens/blooms the shadow, and adds a non-interactive feather vignette (warm-void radial) so the photo melts into the background. Default off; gallery/wishlist keep the crisp `rounded-[6px]` card.

**Sold-out overlay (`isSold`):** sold items stay in the catalog. When `item.isSold`, `CardMedia` grays the cover slightly (`grayscale-[0.4]`) and lays a non-interactive veil (`inset-0 bg-black/45`, `pointer-events-none` so the card stays clickable) with a **centered "Sold out" tag** — a `.tracked` uppercase pill (`bg-black/45`, `border-white/25`, `backdrop-filter blur(6px)`, white 11px text, same soft shadow as the View Item pill). Sits above the image, below the wishlist star.

**Card shadow:** each card image carries a soft drop shadow `0 26px 55px -22px rgba(0,0,0,0.7)` to lift it off the aurora (matches the reference's subtle card shadow). It rides on the tilt layer, so it shifts naturally with the 3D tilt.

**Layout:** two-column staggered grid (`components/ItemGrid.tsx`, mounted by `app/page.tsx`) — 1120px container, `lg:gap-x-[160px]`, columns `lg:gap-40` (160px), right column `lg:mt-[254px]` — recreating the reference's alternating "living gallery" rhythm. 1 column on mobile. The grid loads in batches via infinite scroll (§2.9). The same `ItemCard` is reused (3-col) on the wishlist page.

### 2.5 Buttons & chips
- **Primary CTA** (`bg-cream text-void`, rounded-full, `.tracked`) — high-contrast light pill for the key action (WhatsApp, Subscribe).
- **Secondary / interactive** — `.glass` pill, hover `glass-strong`.
- **Filter chips** (`components/FilterBar.tsx`) — glass by default; **active = solid cream on void**. Replaces v1's left sidebar (reference has none): a single glass toolbar of category chips + condition toggle + sort + clear.

### 2.6 Forms (`components/form.tsx`)
Inputs = `.glass` fill, hairline ring, `rounded-xl`, focus ring `fg-muted`. Labels are small `.tracked`-ish muted caps. Used by admin item form, newsletter (glass pill wrapper), search.

**Native control overrides** — browser chrome is stripped so nothing clashes with the dark theme:
- **`Select`** — `appearance-none` with a custom inline-SVG chevron absolutely positioned `right-4` (inset from the edge), `pr-11` so text never overlaps it. Chevron is `fg-muted`, `h-4 w-4`. Option list forced dark via `[&>option]:bg-ink [&>option]:text-fg`.
- **Number inputs** — native spin buttons hidden globally in `app/globals.css` (`::-webkit-inner/outer-spin-button` + Firefox `-moz-appearance: textfield`).
- **Checkbox** — custom `appearance-none` box (`h-[18px]`, `rounded-[5px]`, `.glass` + hairline ring); checked = solid `cream` fill/ring with an `ink` SVG check that fades in via `peer-checked`. Replaces the old `accent-cream` native checkbox.

**Image input (`components/ItemForm.tsx` + `components/SortableImageGrid.tsx`)** — added images render in a **drag-to-reorder** 3–4 col grid (`@dnd-kit` sortable, `rounded-[6px]`, hairline ring): the first tile shows a cream **"Cover"** chip (`bg-cream text-void`), every tile shows a bottom-left **position badge** (1-based index, `bg-black/60` backdrop-blur pill) mirroring display order, each has a hover ✕ (hovers to `aurora-rose/80`). Below the grid a single dashed-`hairline` `.glass` `rounded-xl` **+ Add images** button (circular `+` glyph badge, "Add images from **gallery** or upload") opens the media picker modal.

**Media picker modal (`components/MediaPicker.tsx`)** — the app's reusable **modal + tab + selectable-grid** pattern. A fixed `z-[60]` overlay with a `bg-void/80 backdrop-blur-xl` veil centers a `.glass` `rounded-[12px]` hairline-ring panel (`max-w-2xl`, `max-h-[85vh]`, column layout with scrollable body). Closes on Esc, backdrop click, or the header ✕; body scroll locks while open (matches the §2.7.1 lightbox conventions). A pill **tab switch** (`.glass` track, active tab = `bg-cream text-void`, `.tracked` uppercase labels) toggles two panes:
- **Gallery** — 3–4 col grid of images already uploaded to Cloudinary (fetched from `GET /api/media`, newest-first, "Load more" pagination). While the first page loads it shows a grid of 8 **`.skeleton`** shimmer tiles (`aspect-square rounded-[6px]`) rather than a text spinner. Tap a tile to select (`ring-2 ring-cream` + cream ✓ badge); images already on the item are `opacity-40`, disabled, and tagged **"Added"**. Footer shows the selection count + a cream **Add N images** button.
- **Upload** — the **drag-and-drop dropzone**: dashed `hairline` border on `.glass`, circular `↑` glyph badge, "Drag images here or **browse**" (browse in `cream` underline), `.tracked` hint; highlights (`border-cream/60 bg-cream/5`, badge scales) on drag-over; clicking opens a hidden `<input type="file" multiple>`. Files upload directly to Cloudinary via a signed request (`POST /api/upload`) and are added to the item instantly; in-flight uploads show `animate-pulse` glass placeholder tiles each with a **spinner** (`animate-spin` ring). Footer shows a **Done** button.

**Edit mode (`components/ItemForm.tsx`)** — the same form is dual-mode. Given an `item`
prop it prefills every field + the existing thumbnails, swaps the submit label to **Save
Changes**, adds a glass **Cancel** button (`variant="secondary"`) beside it, and shows a
**Mark as sold** custom themed checkbox (see native-control overrides above); a sold item stays in the public catalog with a **Sold out** overlay on its card (see Item card below).
Create mode is unchanged.

**Admin access (`app/admin/page.tsx`)** — the dashboard is gated by **Clerk**, not
linked from the nav. Signed-out visitors hit Clerk's hosted sign-in; signed-in users
without the `admin` role are redirected home. The header pairs a **Seller studio** eyebrow
+ serif **Manage Items** `h1` with Clerk's `<UserButton>` (avatar menu / sign-out) on the
right — replacing the old password form + text "Logout".

**Admin item list (`components/AdminItemList.tsx`)** — below the create card on `/admin`.
Each item is a `.glass rounded-2xl` row: 64px `rounded-xl` thumbnail, category·condition
eyebrow, serif title, IDR price, and an **Available/Sold** badge (sold = `aurora-rose/15`
tinted pill, available = plain glass pill). Right-aligned `.tracked` text actions: **Edit**
(toggles an inline `ItemForm` under a hairline divider) and **Delete** (`aurora-rose` toned)
which flips to a **two-step inline confirm** — a glass Confirm button + Cancel — instead of
a browser `confirm()` dialog. Rows are **drag-to-reorder** (`@dnd-kit` vertical sortable): a
`⠿` grip handle on the left (`cursor-grab`, `fg-faint` → `fg` on hover) sets catalog order,
which **auto-saves on drop** (`PATCH /api/items/reorder`); the dragged row lifts with a
shadow. The grip is disabled while that row's edit form is open.

### 2.7 Item detail (`app/items/[id]/page.tsx`)
`.veil` section, 55/45 two-column (image gallery left, info right; stacked on mobile). Info: category eyebrow → serif `text-h2` title → 26px IDR price + condition chip → structured description (`ItemDescription`: 16px/1.7 muted paragraphs in a `space-y-4` stack; `HEADER:` lines → `tracked` 11px `fg-faint` headings; `•`/`-`/`*` lines → bulleted list; collapses past 320px behind a `mask-image` gradient fade with a `tracked` "Read full description ▾" / "Show less ▴" toggle, shown only when content overflows) → spec list (tracked labels) → cream WhatsApp pill + glass wishlist button → seller block (Akbar). Product JSON-LD retained.

### 2.7.1 Image showcase — carousel + lightbox + skeleton (`components/ImageGallery.tsx`)
- **Carousel arrows** — prev/next buttons overlaid on the main `aspect-[3/4]` frame (only when >1 image), vertically centered at `left-3` / `right-3`. Button style = `.glass grid size-10 place-items-center rounded-full text-fg backdrop-blur transition hover:text-cream hover:ring-1 hover:ring-cream` with an inline chevron SVG (no icon dep). Navigation wraps modulo image count. The thumbnail strip (`size-[76px]`, active `ring-2 ring-cream`) stays below and stays in sync.
- **Loading skeleton** — main image, thumbnails, and lightbox all render through **`SmoothImage`** (§2.8), so the shimmer + fade-in comes for free. The main and lightbox images are keyed by `url` so switching photos remounts and re-shows the shimmer, never a blank/stale pop. Disabled under `prefers-reduced-motion`.
- **Lightbox** — clicking the main image (`cursor-zoom-in`) opens a fixed full-screen overlay (`z-[60]`, backdrop `bg-void/80 backdrop-blur-xl`). Contained large image passes `objectFit="contain"` to `SmoothImage`. Themed prev/next arrows + a top-right glass close button (X SVG), plus a `size-[64px]` thumbnail row along the bottom. Closes on Esc, click-outside, or X; `←`/`→` navigate; body scroll locks while open.

### 2.8 Image primitive — `SmoothImage` (`components/SmoothImage.tsx`)

The single standard for **every content image** on the site. Wraps `next/image` in `fill` mode and bakes in the loading treatment so no call site re-implements it:

- **Skeleton** — while the image decodes, a `.skeleton` sibling (`absolute inset-0`, the shimmer gradient `--color-glass`→`--color-glass-strong`, `shimmer` keyframe 1.4s) fills the frame. DOM order (skeleton first, `<Image>` second) means the loaded, opaque image paints on top — no z-index needed. Disabled under `prefers-reduced-motion`.
- **Fade-in** — the image is `opacity-0` until it loads, then transitions to `opacity-100` over `duration-500`. Load is detected two ways: `onLoad`, **and** a mount effect that looks up the sibling `<img>` and flips to loaded if it is already `complete` (or attaches a native `load` listener). This covers eager/cached images that finish before React attaches `onLoad` — otherwise they stay stuck invisible.
- **Lazy vs eager** — non-`priority` images keep `next/image`'s native `loading="lazy"`. Pass **`eager`** to force `loading="eager"` (no preload) for off-screen-but-imminent images the user will swipe to — the home carousel (§2.10) sets it on all 6 slides so swiping never reveals a blank glass box. Only the item-detail main gallery image passes `priority` (above the fold).
- **API** — `src, alt, sizes, className, priority?, eager?, draggable?, objectFit?` (`"cover"` default, `"contain"` for the lightbox). The **caller owns** the positioned/rounded/ring container (all call sites already provide a `relative` box).
- **Call sites** — `CardMedia` (catalog cards), `ImageGallery` (main + thumbnails + lightbox), and the admin surfaces `MediaPicker` / `SortableImageGrid` / `AdminItemList` (which previously used plain `<img>` — now optimized + lazy).

### 2.9 Infinite-scroll gallery (`components/ItemGrid.tsx`)

The gallery no longer renders the whole catalog at once — it loads in batches of **8** as the user scrolls (no pagination UI).

- **First batch** — server-rendered in `app/page.tsx` (`getItems({ limit: 8, offset: 0 })`) for fast paint + SEO, then handed to the client `ItemGrid` as `initialItems`.
- **Append on scroll** — an `IntersectionObserver` watches a 1px sentinel below the grid (`rootMargin: 600px 0px`, so it prefetches before the sentinel is visible). On intersect it fetches `GET /api/items?<filters>&limit=8&offset=<loaded>`, appends the batch, and stops when a batch returns fewer than 8. A ref guard prevents overlapping fetches.
- **Skeleton cards** — while a batch loads, `pageSize` **`CardSkeleton`** placeholders fill the two column tails (split ⌈n/2⌉ left / ⌊n/2⌋ right). Each is a `.skeleton` `aspect-[3/4] rounded-[6px]` media box + two shimmer text lines (`h-3 w-1/3`, `h-5 w-3/4`), mirroring `ItemCard`'s footprint so there's no layout shift. Same shimmer as §2.8; disabled under `prefers-reduced-motion`.
- **Filter/sort reset** — `app/page.tsx` mounts `ItemGrid` with `key={query}` (the filter querystring), so any filter/sort change remounts the grid and resets accumulated items + scroll state cleanly.
- **Masonry** — the two-column staggered grid (previously inline in `app/page.tsx`) now lives in `ItemGrid`, unchanged geometry (§1.3, §2.4).

### 2.10 Home "Latest arrivals" scattered carousel (`components/ArrivalsCarousel.tsx`)

The home preview strip is a **Gucci-Beauty-style scattered carousel** (home-only; the gallery uses §2.9 masonry). It **flows with the page** — `app/page.tsx` renders the section as a plain `relative py-16` block (**no sticky pin**). An earlier version pinned the fan via `sticky top-…` inside a tall `min-h-[calc(50svh+36rem)]` section to hold it centred below the nav, but that pin held vertical page scroll for a ~200–300px range that read as the scroll being **"stuck"** when passing the strip; the pin was removed so page scroll never stalls. A horizontal **scroll-snap** (`snap-x snap-mandatory`) `<ul>` track of the 6 newest items, `overflow-x-auto` with the scrollbar hidden (`.scrollbar-none` in `app/globals.css`); all 6 slides load **`eager`** (§2.8) so swiping never flashes a blank card.

- **Scatter (the signature)** — a `requestAnimationFrame`-throttled `scroll`/`resize` handler measures each slide's center vs the track's viewport center, normalizes the distance `d ∈ [−1, 1]`, and writes CSS vars on the slide: `--rot = d·7deg`, `--ty = |d|·22px`, `--scale = 1 − |d|·0.14`, `--dim = 1 − |d|·0.5`, `--z`. Slide transform = `translateY(var(--ty)) rotate(var(--rot)) scale(var(--scale))`, `filter: brightness(var(--dim))`, `transform-origin: center bottom`, eased `0.6s cubic-bezier(0.22,1,0.36,1)`. Net effect: the **centered** card is upright/largest/brightest, neighbors fan out, tilt, drop and dim.
- **Edge blend** — cards are shown on the bare aurora (not the darker `.veil`), so `CardMedia` is passed `blendEdges`: corners round to **`rounded-[14px]`**, the shadow is a single **warm-tinted, wide-blur, deep-negative-spread** bloom (`0 10px 70px -42px rgba(18,12,6,0.42)`) — a soft diffuse glow under the card rather than a tight band pooling in the gap above the caption (which made the bottom edge look "squared"); still small enough that the three cards' shadows don't merge into a dark grey rectangle over the vibrant aurora — and a non-interactive **feather vignette** (`radial-gradient(118% 128% at 50% 42%, transparent 50%, rgba(20,16,11,0.5) 100%)` — the warm void tone) fades the bright photo toward the border so it melts into the aurora instead of reading as a hard rectangle. Gallery/wishlist cards keep the crisp `rounded-[6px]` treatment (`blendEdges` off).
- **Peek + edge fade** — **280px** cards (~373px tall), `gap-6 md:gap-10`, side padding `max(1rem, calc((100% − 280px)/2))` so the active card snap-centres while neighbours peek. The track **breaks out of the 1120 container to the full section width** (`app/page.tsx` renders `<ArrivalsCarousel>` as a sibling of the centred header, not inside it) so peeking cards reach the screen edges, and a horizontal **mask** (`linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)`) fades them out so they dissolve into the aurora instead of hard-clipping mid-section. Header + caption stay in the centred `max-w-[1120px]` container.
- **Default focus** — on mount the track scrolls (instantly) so the **middle** slide (`floor(n/2)`) is centred/active, not the first.
- **Active caption** — a single centered block below the track shows the **active** card only (`.tracked` category · serif `24px` title · price + condition chip). Active index = slide with smallest `|d|`, held in React state (updated on settle, not per frame).
- **Progress dashes** — one `<button>` per item; active = 28px wide `#e0533d`, others 14px `--color-hairline`; click smooth-scrolls that card to center (`scrollIntoView({ inline: 'center' })`). Plus a `.tracked` "Swipe to discover" hint.
- **Reuses `CardMedia` unchanged** — its hover 3D-tilt (`rotateX/Y` in `perspective:800px`) + magnetic pill + wishlist star compose on top of the outer 2D scatter (different transform contexts, no conflict).
- **Reduced-motion / SSR** — scatter is off until after mount (upright first paint, no flash) and stays off entirely under `prefers-reduced-motion`, degrading to a plain upright horizontal scroll row.

---

## 3. Responsive Breakpoints
```
Mobile   : 0–767px    — 1-col gallery, hamburger nav, chips wrap
Tablet   : 768–1023px — 2-col staggered gallery, full pill nav
Desktop  : 1024px+    — 2-col staggered gallery + inline search
Max      : 1240px container
```
Hero and headings scale fluidly via `clamp()`, so there are no per-breakpoint font overrides.

---

## 4. Motion
```
Aurora (primary) : WebGL mesh-gradient, speed 0.18 (slow/subtle) — components/AuroraGL.tsx
Aurora (fallback): CSS blobs drift 22–32s ease-in-out, infinite, independent per blob
Card 3D tilt    : transform 0.6s cubic-bezier(0.16,1,0.3,1)   (perspective 800px)
Card pill trail : left/top 400ms cubic-bezier(0.22,1,0.36,1) + opacity 300ms
Arrivals scatter: per-slide transform/filter 0.6s cubic-bezier(0.22,1,0.36,1), driven by rAF scroll (§2.10)
Hero entrance   : `rise` 0.9s (fade + 24px up)
Page transition — default swap  : `.fade-rise` fade+blur+12px rise (exit 260ms, enter 420ms after exit)
Page transition — directional   : `.nav-forward` / `.nav-back` 80px blur-slide (560ms), asymmetric fade
Page transition — shared morph  : per-item `view-transition-name: item-<id>` on the <img>; card cover ⇄ item hero, browser-default tween
Page transition — anchored      : navbar (`site-header`) + aurora (`aurora-bg`) get their own frozen VT groups; footer rides the frozen `root` snapshot (raw <style> in layout.tsx, Lightning CSS strips the `root` pseudo). Navbar traded its `backdrop-filter` frost for a solid aurora-tinted `.glass-nav` fill (`rgba(28,20,12,0.62)`) so it can be a steady VT group without snapshotting as a square / breaking the blur. Mobile menu dropdown keeps its backdrop-blur (not a VT group).
Reduced-motion  : shader replaced by static CSS aurora; all drift/rise disabled; every `::view-transition-*` duration/delay zeroed (instant swap)
```
Easing token: `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)`. The background is the one
GPU/WebGL element (`@paper-design/shaders-react`); everything else (card tilt/pill, hero
rise, page transitions) is plain CSS transforms + transitions — no GSAP/Framer.

**Page transitions** use React 19's native `<ViewTransition>` (enabled via
`experimental.viewTransition` in `next.config.ts`). The page content is wrapped once
in **`app/template.tsx`** (a template re-mounts per navigation — that's what fires the
enter/exit animations; a layout persists and would never animate). `<Link>`/`router.push`
carry a `transitionTypes` of `nav-forward` (deeper: gallery, item, wishlist, search) or
`nav-back` (home/logo, item "← Gallery"). Untyped navigations fall back to the
`.fade-rise` default. All view-transition rules live in `app/globals.css`
(`::view-transition-old/new(.fade-rise | .nav-forward | .nav-back)`, `aurora-bg` anchor,
`tx-*` keyframes). No library added.

---

## 5. Accessibility
- Text is warm off-white at 0.88 alpha on `#14100b` → high contrast (AAA for body).
- Focus: visible rings on inputs; interactive glass elements use `outline`/ring on focus.
- Touch targets ≥ 44px (nav, buttons, chips).
- `cursor: pointer` restored globally on `button`/`select`/`[role="button"]`/`label[for]` (Tailwind v4 Preflight drops it) — see `app/globals.css`.
- `prefers-reduced-motion` fully respected.
- All images carry alt text; decorative aurora is `aria-hidden`.

---

## 6. Implementation Map
```
app/globals.css        → tokens (@theme), .stage, .veil, .glass, .glass-nav, .tracked, keyframes
components/AuroraGL.tsx → WebGL fluid mesh-gradient background (@paper-design/shaders-react); falls back to Aurora.tsx
components/Aurora.tsx   → static CSS-blob aurora (fallback: SSR / reduced-motion / no-WebGL)
components/Navbar.tsx   → glass pill nav
components/ItemGrid.tsx → client masonry + infinite scroll (IntersectionObserver + skeleton cards)
components/ItemCard.tsx → showcase card (meta + wishlist + <CardMedia>) — used by gallery + wishlist
components/ArrivalsCarousel.tsx → home "Latest arrivals" scattered scroll-snap carousel (rAF scatter, active caption, dashes)
components/CardMedia.tsx→ card image + 3D tilt + magnetic cursor-following pill
components/SmoothImage.tsx → standard image primitive (next/image fill + skeleton shimmer + fade-in + lazy)
components/FilterBar.tsx→ glass filter toolbar
components/Button.tsx   → cream / glass pill variants
components/form.tsx     → glass inputs
components/Badge.tsx    → condition / category chips
components/ItemDescription.tsx → parses plain-text description into paragraphs / headings / bullet lists; collapse + "read full" toggle (client)
components/ItemForm.tsx → admin create/edit form (dual-mode, +Add images button, sold toggle)
components/MediaPicker.tsx → modal picker: Gallery (reuse Cloudinary uploads) + Upload tabs
components/SortableImageGrid.tsx → drag-to-reorder image thumbnails (@dnd-kit, cover badge)
components/AdminItemList.tsx → admin item list (drag-reorder rows, sold badge, edit + inline delete confirm)
components/AdminDashboard.tsx → client body of /admin (ItemForm + AdminItemList, refresh state)
proxy.ts               → Clerk middleware (clerkMiddleware) — Next 16 proxy convention
lib/adminAuth.ts       → isAdmin() — Clerk currentUser role check (gates admin API routes)
app/page.tsx           → home: minimal hero + cream CTA + "Latest arrivals" scattered carousel (§2.10) → /gallery
app/gallery/page.tsx   → gallery: single-line hero (eyebrow + serif <h1>) + FilterBar + staggered infinite-scroll grid
app/about/page.tsx     → static About page (hero + mission + 3 glass how-it-works cards + seller intro + CTA); reuses existing tokens only
app/admin/page.tsx     → Clerk auth guard (server) + <UserButton> + <AdminDashboard>
app/items/[id]/page.tsx→ detail
```

The About page introduces no new tokens or components — it composes existing ones
(`text-hero`/`text-h2`/`text-h3`, `.tracked` eyebrows, `.glass rounded-3xl` cards on a
`.veil` section, `.rise` hero entrance, cream CTA pill matching item-detail).

---

**This system reflects the live jackwatkins.co/works aesthetic — dark aurora, glass, serif display — while carrying the full PRD feature set (IDR pricing, filters, wishlist, WhatsApp contact, newsletter, admin).**
