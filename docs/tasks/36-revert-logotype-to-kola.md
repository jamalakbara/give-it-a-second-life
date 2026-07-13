# 36 — Revert logotype font Telma → Kola

## Goal
User preferred the previous logotype. Revert the **"Second Life°" logotype**
font from Telma (v2.22) back to **Kola** on the `font-logo` token.

## Scope
**In:** restore Kola woff2, repoint `--font-logo` → Kola, drop Telma font,
docs. **Out:** Tanker headings + Clash body (unchanged).

## Checklist
- [x] Restore `app/fonts/Kola-Regular.woff2` (recovered from `.next` build
      cache — 18012 bytes, exact match to original)
- [x] Replace `telma` localFont with `kola` in `app/layout.tsx`; update `<html>` className
- [x] Repoint `--font-logo` → `var(--font-kola)` in `app/globals.css`
- [x] Delete `app/fonts/Telma-Variable.woff2`
- [x] Update `docs/DESIGN_SYSTEM.md` §1.2 + version note (v2.23)
- [x] Verify: `npm run build` succeeds
