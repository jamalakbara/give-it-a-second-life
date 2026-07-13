# 32 — Animated page transitions (native View Transitions)

## Goal

Replace the hard route-swap "pop" with choreographed page transitions so every
navigation reads as one continuous motion, at an awwwards-competent bar, with no
new dependencies. Uses React 19 `<ViewTransition>` (native to Next 16.2.10) + CSS.

## Scope

**In**
- Enable `experimental.viewTransition` in `next.config.ts`.
- Global directional swap around `<main>`: soft fade-rise default + forward/back
  blur-slide (`nav-forward` / `nav-back`).
- Shared-element morph: card cover image → item detail hero (same VT `name`).
  Covers both the gallery grid and the home carousel (both use `CardMedia`).
- Anchor the navbar header (`site-header`) and Aurora canvas (`aurora-bg`) so they
  don't slide/flicker during transitions.
- Directional intent tags on nav links, card links, search push, and a new
  "← Gallery" back link on the item detail page.
- `prefers-reduced-motion`: transitions zeroed to instant swap.
- Docs: DESIGN_SYSTEM motion section + PRD line.

**Out**
- No animation library (GSAP / motion / framer-motion).
- No Suspense-reveal skeleton animation or same-route crossfade (deferred).
- No route/metadata/heading changes → SEO rule N/A.

## Checklist

- [x] `next.config.ts` — add `experimental.viewTransition: true`
- [x] `app/globals.css` — VT rules: `.fade-rise`, `.nav-forward`, `.nav-back`,
      per-item morph (via `view-transition-name`), `site-header` + `aurora-bg`
      anchors, reduced-motion zeroing
- [x] `app/layout.tsx` — wrap `<main>` in `<ViewTransition>` (fade-rise default +
      directional map)
- [x] `components/Navbar.tsx` — `viewTransitionName: site-header` on header;
      `transitionTypes` on nav links (Home/logo = back, rest = forward, desktop +
      mobile); wishlist link forward; search `router.push` tagged forward
- [x] `components/AuroraGL.tsx` — `viewTransitionName: aurora-bg` on canvas wrapper
- [x] `components/SmoothImage.tsx` — optional `viewTransitionName` prop → applied
      to the `<img>` (morph is named on the image, not a fragment wrapper)
- [x] `components/CardMedia.tsx` — morph name on cover image; `nav-forward` on card link
- [x] `components/ImageGallery.tsx` — morph name on active (cover) hero (new `itemId` prop)
- [x] `app/items/[id]/page.tsx` — pass `itemId`; add "← Gallery" back link (`nav-back`)
- [x] `docs/DESIGN_SYSTEM.md` — §4 Motion: page-transition rows + v2.18 bump
- [x] `docs/PRD.md` — new §3.5 Animated Page Transitions (MVP)
- [x] Static verify: `tsc --noEmit` clean; all routes + item detail 200; dev log
      shows `✓ viewTransition`; compiled CSS carries every VT rule; HTML carries
      the `item-*` morph names + `site-header`.
- [ ] **Visual verify deferred** — Chrome extension wasn't connected, so the live
      morph/slide smoothness + no-aurora-flicker check couldn't be run in-session.
      Do a manual pass (gallery→item morph, forward/back slide, reduced-motion).

## Notes
- Morph is driven by a raw per-item `view-transition-name` on the `<img>` (not
  React `<ViewTransition share="morph">`) because `SmoothImage` renders a fragment
  (skeleton + image), which isn't a clean single-element morph target. Card cover
  and item hero share the 3/4 aspect, so the browser-default group tween is
  artifact-free without custom `.morph` CSS.
- Only `<main>` is wrapped; navbar (`site-header`) + aurora (`aurora-bg`) are
  anchored with `animation:none` so the frame stays put and the always-animating
  WebGL canvas doesn't double-expose during the swap.
