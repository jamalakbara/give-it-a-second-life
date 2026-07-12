# 20 — WebGL fluid-gradient background + cool palette recolor

## Goal
Replace the static CSS aurora background with a "wow" WebGL fluid mesh-gradient, tuned
subtle so product photos stay hero, and recolor the design tokens to a cool
indigo/blue/cyan/mint/teal night-sky palette.

## Scope
**In:**
- WebGL mesh-gradient background via `@paper-design/shaders-react`.
- New client component `components/AuroraGL.tsx` with SSR / reduced-motion / no-WebGL
  fallback to the existing CSS aurora.
- Token recolor in `app/globals.css` (void/ink/cream, fg tints, glass, aurora accents).
- Vignette base-color update in `components/Aurora.tsx`.
- Docs sync (DESIGN_SYSTEM §1.1, §2.1, §4, §5, §6, version bump).

**Out:**
- No changes to per-component layout/geometry.
- No new product/PRD capability (visual-only; governed by design-system-sync rule).

## Checklist
- [x] Add `@paper-design/shaders-react` dependency
- [x] Create `components/AuroraGL.tsx` (MeshGradient + vignette/grain overlays + reduced-motion/SSR fallback)
- [x] Recolor `@theme` tokens in `app/globals.css` to cool night-sky palette
- [x] Update vignette base rgba in `components/Aurora.tsx`
- [x] Swap `<Aurora />` → `<AuroraGL />` in `app/layout.tsx`
- [x] Update `docs/DESIGN_SYSTEM.md` (§1.1 colors, §2.1 aurora, §4 motion, §5 a11y, §6 map, version → v2.7)
- [x] Verify build: `tsc --noEmit` clean, dev compiles clean, `GET /` → HTTP 200, SSR renders the fallback aurora (mounted=false) with no error overlay
- [ ] Verify in browser: subtle flowing cool gradient, cards readable, no banding/layout shift — *deferred: Chrome extension not connected this session; user to eyeball at http://localhost:3000*
- [ ] Verify reduced-motion emulation falls back to static CSS aurora — *deferred: same reason (SSR fallback path already confirmed rendering)*
