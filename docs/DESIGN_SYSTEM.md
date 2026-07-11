# Design System: Selling Preloved Items

**Design Reference:** jackwatkins.co/works (live, inspected July 2026)
**Aesthetic:** Dark "living gallery" — near-black stage, drifting aurora glow, high-contrast serif display, glassmorphic UI, large staggered imagery
**Status:** MVP Design System — v2.1 (rebuilt to match the current reference 1:1, incl. card hover interaction)

> **Note (v2.0):** The original v1.0 spec described a *light* cream/charcoal/gold adaptation. The live reference is a **dark aurora** portfolio, so the system was rebuilt to match it pixel-for-pixel. Tokens below reflect what is actually implemented in `app/globals.css` (Tailwind v4 `@theme`).
>
> **Note (v2.1):** The item-card hover was matched 1:1 to the reference by inspecting its computed styles — magnetic cursor-following pill + `perspective: 800px` 3D tilt, no dim overlay (see §2.4). Gallery grid geometry (480px columns, 160px gaps, ~254px stagger) was measured off the reference too.

---

## 1. Design Tokens

All tokens live in `app/globals.css` under `@theme` and are consumed as Tailwind utilities (`bg-void`, `text-fg`, `glass`, etc.).

### 1.1 Color Palette

#### Base (dark stage)
```
Void   #010008   — app background (matches reference body rgb(1,0,8))
Ink    #050110   — darkened content sections (the .veil overlay target)
Cream  #f6f3f0   — light surface for solid CTAs & light text on dark
```

#### Foreground (warm off-white on dark)
```
fg        rgba(246,243,240,0.88)  — primary text / headings
fg-muted  rgba(246,243,240,0.55)  — body copy, secondary
fg-faint  rgba(246,243,240,0.38)  — eyebrows, captions, meta labels
```

#### Glass surfaces (frosted translucency)
```
glass         rgba(246,243,240,0.06)  — pills, cards, chips
glass-strong  rgba(246,243,240,0.10)  — hover state
hairline      rgba(246,243,240,0.14)  — borders / dividers / rings
```
Applied via the `.glass` utility = translucent fill + hairline border + `backdrop-filter: blur(18px) saturate(1.2)`.

#### Aurora accents (background glow only — not UI color)
```
aurora-blue     #2b2fe0
aurora-violet   #7c3aed
aurora-magenta  #c026d3
aurora-rose     #d6236a
aurora-crimson  #7a0b2e
```
Used exclusively by `components/Aurora.tsx` as large blurred blobs. `aurora-rose` doubles as the error/notification accent (e.g. wishlist count badge).

**No gold.** The v1 gold accent was removed — the reference has no accent color; emphasis comes from contrast (cream-on-void CTAs) and the aurora itself.

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

### 2.1 Aurora background (`components/Aurora.tsx`)
Fixed full-viewport layer over `#010008` holding 5 large blurred radial blobs (blue/violet/magenta/rose/crimson, `blur-[110–140px]`, opacity 0.55–0.8), each drifting on a slow independent keyframe (`drift-a/b/c`, 22–32s). A soft radial center-darkening keeps text legible; a faint SVG grain kills banding. Honors `prefers-reduced-motion` (animations disabled).

**Stacking:** Aurora is `fixed inset-0 z-0`; body background is transparent (so the negative-z trap is avoided) with `html` painting the void base; content sits in `.stage` at `relative z-10`.

### 2.2 The stage & the veil
- `.stage` — rounded 28px panel, `isolation: isolate`, holds nav + main + footer. All content is transparent so the aurora blooms through it.
- **Background stays fixed through the whole scroll** (matches reference): the single `Aurora` layer is `fixed` and every section is transparent, so the same glow sits behind the page at any scroll position — no per-section darkening.
- `.veil` — now a **transparent no-op hook** kept on gallery / detail / wishlist / admin / footer sections. It used to darken lower content to `ink`, which made the background look "mixed" (colorful hero, flat-dark body); that was removed so the fixed aurora reads consistently. Legibility comes from the aurora's own center vignette + centered content columns.

### 2.3 Navigation — floating glass pill (`components/Navbar.tsx`)
Sticky, centered, `max-w-1240px`, `rounded-full`, `.glass`, h-14/16. Serif wordmark left; `.tracked` links (Gallery · Wishlist · Sell) center; search field + wishlist heart (with `aurora-rose` count badge) right. Mobile: wordmark + heart + hamburger → glass dropdown panel with search + links.

### 2.4 Item card — living-gallery showcase (`components/ItemCard.tsx` + `components/CardMedia.tsx`)
Large **portrait 3:4** image, `rounded-6px`, hairline ring. Below image, left-aligned: category eyebrow (`.tracked` fg-faint) · serif title (22px) · row of IDR price + condition glass chip.

**Structure:** `CardMedia` owns the whole hover surface. Hover handlers (enter/leave/move) sit on the **outer** container (so the tilt keeps running even over the heart); inside the tilt layer are three siblings — a full-bleed `<Link>` click-target, the magnetic pill, and the glass wishlist heart (top-right). Heart and image thus **tilt together**, and the `<button>`/`<a>` are siblings (no invalid nesting). The heart is a fixed `size-9` perfect circle (`grid place-items-center`) with a centered icon; hovering it hides the "View Item" pill (an `overHeart` flag) so the two controls never overlap.

**Hover interaction (`CardMedia.tsx`, client) — matched 1:1 to the reference by inspecting its computed styles.** Three layers, no dark overlay / no dim / no zoom:
1. **3D tilt ("bottle-cap press")** — outer `[perspective:800px]`, inner media div rotates `rotateX/rotateY` from the normalized cursor offset so the point under the pointer recedes and the far side lifts. `MAX_TILT = 2.5°` (reference is a subtle 2–6°; tune this one constant). Eased `transform 0.6s cubic-bezier(0.16,1,0.3,1)`; resets to flat on leave.
2. **Magnetic "View Item" pill** — a **liquid-glass** pill (`bg-white/15`, `backdrop-filter blur(14px) saturate(1.4)`, `border-white/25`, soft shadow `0 8px 28px -6px rgba(0,0,0,0.55)`, white text, `whitespace-nowrap`) so it reads clearly over any image — brighter than the standard `.glass`. It trails the cursor via `left/top` (`400ms cubic-bezier(0.22,1,0.36,1)`), scales `0.85→1` + fades in on hover, home = center, fades out on leave. Sits above the tilt layer.
3. Image itself is undimmed on hover (reference does not darken).

**Card shadow:** each card image carries a soft drop shadow `0 26px 55px -22px rgba(0,0,0,0.7)` to lift it off the aurora (matches the reference's subtle card shadow). It rides on the tilt layer, so it shifts naturally with the 3D tilt.

**Layout:** two-column staggered grid (`app/page.tsx`) — 1120px container, `lg:gap-x-[160px]`, columns `lg:gap-40` (160px), right column `lg:mt-[254px]` — recreating the reference's alternating "living gallery" rhythm. 1 column on mobile. The same `ItemCard` is reused (3-col) on the wishlist page.

### 2.5 Buttons & chips
- **Primary CTA** (`bg-cream text-void`, rounded-full, `.tracked`) — high-contrast light pill for the key action (WhatsApp, Subscribe).
- **Secondary / interactive** — `.glass` pill, hover `glass-strong`.
- **Filter chips** (`components/FilterBar.tsx`) — glass by default; **active = solid cream on void**. Replaces v1's left sidebar (reference has none): a single glass toolbar of category chips + condition toggle + sort + clear.

### 2.6 Forms (`components/form.tsx`)
Inputs = `.glass` fill, hairline ring, `rounded-xl`, focus ring `fg-muted`. Labels are small `.tracked`-ish muted caps. Used by admin item form, newsletter (glass pill wrapper), search.

**Image upload (`components/ItemForm.tsx`)** — the admin item form no longer takes raw image URLs. A native `<input type="file" multiple>` (styled `file:` pill — glass border, `rounded-[4px]`) uploads directly to Cloudinary via a signed request (`POST /api/upload` returns the signature; the browser posts the file to Cloudinary). Returned `secure_url`s render as a 3–4 col grid of square thumbnails (`rounded-[4px]`) with a hover ✕ remove button. Uploads are disabled when Cloudinary env vars are absent.

### 2.7 Item detail (`app/items/[id]/page.tsx`)
`.veil` section, 55/45 two-column (image gallery left, info right; stacked on mobile). Info: category eyebrow → serif `text-h2` title → 26px IDR price + condition chip → muted description → spec list (tracked labels) → cream WhatsApp pill + glass wishlist button → seller block (Akbar). Product JSON-LD retained.

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
Aurora drift    : 22–32s ease-in-out, infinite, independent per blob
Card 3D tilt    : transform 0.6s cubic-bezier(0.16,1,0.3,1)   (perspective 800px)
Card pill trail : left/top 400ms cubic-bezier(0.22,1,0.36,1) + opacity 300ms
Hero entrance   : `rise` 0.9s (fade + 24px up)
Reduced-motion  : all drift/rise disabled
```
Easing token: `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)`. No animation library — the card tilt/pill are plain CSS transforms + transitions driven by React state (matches how the reference does it; GSAP/Framer/WebGL not used).

---

## 5. Accessibility
- Text is warm off-white at 0.88 alpha on `#010008` → high contrast (AAA for body).
- Focus: visible rings on inputs; interactive glass elements use `outline`/ring on focus.
- Touch targets ≥ 44px (nav, buttons, chips).
- `prefers-reduced-motion` fully respected.
- All images carry alt text; decorative aurora is `aria-hidden`.

---

## 6. Implementation Map
```
app/globals.css        → tokens (@theme), .stage, .veil, .glass, .tracked, keyframes
components/Aurora.tsx   → animated background
components/Navbar.tsx   → glass pill nav
components/ItemCard.tsx → showcase card (meta + wishlist + <CardMedia>)
components/CardMedia.tsx→ card image + 3D tilt + magnetic cursor-following pill
components/FilterBar.tsx→ glass filter toolbar
components/Button.tsx   → cream / glass pill variants
components/form.tsx     → glass inputs
components/Badge.tsx    → condition / category chips
app/page.tsx           → hero + staggered gallery
app/items/[id]/page.tsx→ detail
```

---

**This system reflects the live jackwatkins.co/works aesthetic — dark aurora, glass, serif display — while carrying the full PRD feature set (IDR pricing, filters, wishlist, WhatsApp contact, newsletter, admin).**
