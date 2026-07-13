# Design System: Selling Preloved Items

**Design Reference:** jackwatkins.co/works (live, inspected July 2026)
**Aesthetic:** Dark "living gallery" — near-black stage, drifting aurora glow, high-contrast serif display, glassmorphic UI, large staggered imagery
**Status:** MVP Design System — v2.12 (all content images unified under one `SmoothImage` primitive — skeleton shimmer + fade-in + native lazy-load)

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
Display / Serif : Playfair Display  (stand-in for reference "JW Serif")  → var(--font-serif)
Body / Sans     : Inter             (stand-in for reference "JW Sans")   → var(--font-sans)
Weights loaded  : Playfair 400/500/600/700 · Inter 400/500/600
```
Reference hero is a high-contrast didone serif at `72px+ / weight 500`; Playfair Display 500 matches its character.

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
Sticky, centered, `max-w-1240px`, `rounded-full`, `.glass-nav` (heavier frost than `.glass`), h-14/16. Serif wordmark left; `.tracked` links (Gallery · Wishlist · Sell) center; search field + wishlist star (with `aurora-rose` count badge) right. Mobile: wordmark + star + hamburger → glass dropdown panel with search + links.

### 2.4 Item card — living-gallery showcase (`components/ItemCard.tsx` + `components/CardMedia.tsx`)
Large **portrait 3:4** image, `rounded-6px`, hairline ring. Below image, left-aligned: category eyebrow (`.tracked` fg-faint) · serif title (22px) · row of IDR price + condition glass chip.

**Structure:** `CardMedia` owns the whole hover surface. Hover handlers (enter/leave/move) sit on the **outer** container (so the tilt keeps running even over the heart); inside the tilt layer are three siblings — a full-bleed `<Link>` click-target, the magnetic pill, and the glass wishlist star (top-right). Heart and image thus **tilt together**, and the `<button>`/`<a>` are siblings (no invalid nesting). The heart is a fixed `size-9` perfect circle (`grid place-items-center`) with a centered icon; hovering it hides the "View Item" pill (an `overHeart` flag) so the two controls never overlap.

**Hover interaction (`CardMedia.tsx`, client) — matched 1:1 to the reference by inspecting its computed styles.** Three layers, no dark overlay / no dim / no zoom:
1. **3D tilt ("bottle-cap press")** — outer `[perspective:800px]`, inner media div rotates `rotateX/rotateY` from the normalized cursor offset so the point under the pointer recedes and the far side lifts. `MAX_TILT = 2.5°` (reference is a subtle 2–6°; tune this one constant). Eased `transform 0.6s cubic-bezier(0.16,1,0.3,1)`; resets to flat on leave.
2. **Magnetic "View Item" pill** — a **liquid-glass** pill (`bg-white/15`, `backdrop-filter blur(14px) saturate(1.4)`, `border-white/25`, soft shadow `0 8px 28px -6px rgba(0,0,0,0.55)`, white text, `whitespace-nowrap`) so it reads clearly over any image — brighter than the standard `.glass`. It trails the cursor via a GPU `transform` reading live `--px/--py` vars (`400ms cubic-bezier(0.22,1,0.36,1)`), scales `0.85→1` + fades in on hover, home = center, fades out on leave. The pill center is **clamped** to the card bounds (measured pill half-size + 8px gap) so it never gets clipped by the `overflow-hidden` rounded edge when the cursor rides the border. Sits above the tilt layer.
3. Image itself is undimmed on hover (reference does not darken).

**Sold-out overlay (`isSold`):** sold items stay in the catalog. When `item.isSold`, `CardMedia` grays the cover slightly (`grayscale-[0.4]`) and lays a non-interactive veil (`inset-0 bg-black/45`, `pointer-events-none` so the card stays clickable) with a **centered "Sold out" tag** — a `.tracked` uppercase pill (`bg-black/45`, `border-white/25`, `backdrop-filter blur(6px)`, white 11px text, same soft shadow as the View Item pill). Sits above the image, below the wishlist star.

**Card shadow:** each card image carries a soft drop shadow `0 26px 55px -22px rgba(0,0,0,0.7)` to lift it off the aurora (matches the reference's subtle card shadow). It rides on the tilt layer, so it shifts naturally with the 3D tilt.

**Layout:** two-column staggered grid (`app/page.tsx`) — 1120px container, `lg:gap-x-[160px]`, columns `lg:gap-40` (160px), right column `lg:mt-[254px]` — recreating the reference's alternating "living gallery" rhythm. 1 column on mobile. The same `ItemCard` is reused (3-col) on the wishlist page.

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
- **Fade-in** — the image is `opacity-0` until its `onLoad`, then transitions to `opacity-100` over `duration-500`.
- **Lazy-load** — non-`priority` images keep `next/image`'s native `loading="lazy"`, so below-the-fold images only fetch on approach. Only the item-detail main gallery image passes `priority` (above the fold).
- **API** — `src, alt, sizes, className, priority?, draggable?, objectFit?` (`"cover"` default, `"contain"` for the lightbox). The **caller owns** the positioned/rounded/ring container (all call sites already provide a `relative` box).
- **Call sites** — `CardMedia` (catalog cards), `ImageGallery` (main + thumbnails + lightbox), and the admin surfaces `MediaPicker` / `SortableImageGrid` / `AdminItemList` (which previously used plain `<img>` — now optimized + lazy).

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
Hero entrance   : `rise` 0.9s (fade + 24px up)
Reduced-motion  : shader replaced by static CSS aurora; all drift/rise disabled
```
Easing token: `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)`. The background is the one
GPU/WebGL element (`@paper-design/shaders-react`); everything else (card tilt/pill, hero
rise) is plain CSS transforms + transitions driven by React state — no GSAP/Framer.

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
components/ItemCard.tsx → showcase card (meta + wishlist + <CardMedia>)
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
app/page.tsx           → hero + staggered gallery
app/admin/page.tsx     → password gate + create form + AdminItemList
app/items/[id]/page.tsx→ detail
```

---

**This system reflects the live jackwatkins.co/works aesthetic — dark aurora, glass, serif display — while carrying the full PRD feature set (IDR pricing, filters, wishlist, WhatsApp contact, newsletter, admin).**
