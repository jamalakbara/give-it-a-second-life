# 33 — Self-hosted fonts (Kola + Clash Display)

## Goal
Replace the two Google fonts (Playfair Display + Inter) with self-hosted
**Kola** (display serif → `font-serif`) and **Clash Display** (variable sans →
`font-sans`), loaded via `next/font/local`. No Google Fonts request.

## Scope
**In:** font loading in `app/layout.tsx`, the two `--font-*` tokens in
`app/globals.css`, extracting woff2 into `app/fonts/`, removing the source zips,
design-system typography docs.
**Out:** component className changes (all headings/body route through the
`font-serif`/`font-sans` tokens, so the swap needs none), type-scale sizes,
adding extra font weights/styles.

## Checklist
- [x] Extract `ClashDisplay-Variable.woff2` + `Kola-Regular.woff2` into `app/fonts/`
- [x] Swap `next/font/google` → `next/font/local` in `app/layout.tsx`
      (`kola` weight `400`, `clashDisplay` weight `200 700`, both `display: swap`)
- [x] Update `<html>` className to `${kola.variable} ${clashDisplay.variable}`
- [x] Repoint `--font-serif`/`--font-sans` tokens in `app/globals.css`
- [x] Delete `public/ClashDisplay_Complete.zip` + `public/Kola_Complete.zip`
- [x] Update `docs/DESIGN_SYSTEM.md` §1.2 typography + bump version note (v2.20)
- [x] Verify: `npm run build` succeeds (localFont resolved both woff2, all
      routes compiled). Dev-server visual check (Kola headings / Clash body, no
      `fonts.gstatic.com` request) recommended on next `npm run dev`.
