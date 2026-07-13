# 35 — Logotype font: Telma (replacing Kola)

## Goal
Swap the **"Second Life°" logotype** font from Kola → self-hosted **Telma**
(variable serif, 300–900) on the `font-logo` token. Remove Kola entirely.

## Scope
**In:** load Telma via `next/font/local`; repoint `--font-logo` → Telma; remove
Kola font + zip; design-system typography docs.
**Out:** Tanker headings and Clash body/UI (unchanged); no className changes
(logotype keeps `font-logo`).

## Checklist
- [x] Extract `Telma-Variable.woff2` into `app/fonts/`
- [x] Replace `kola` localFont with `telma` in `app/layout.tsx`
      (`--font-telma`, weight `300 900`, `display: swap`); update `<html>` className
- [x] Repoint `--font-logo` → `var(--font-telma)` in `app/globals.css`
- [x] Delete `public/Telma_Complete.zip` + `app/fonts/Kola-Regular.woff2`
- [x] Update `docs/DESIGN_SYSTEM.md` §1.2 + version note (v2.22)
- [x] Verify: `npm run build` succeeds (Tanker + Telma + Clash all resolve)
