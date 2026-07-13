# 34 — Tanker for headings, Kola scoped to logotype

## Goal
Replace **Kola** on headings with self-hosted **Tanker** (`font-serif` slot),
and keep **Kola** only for the **"Second Life°" logotype** via a new `font-logo`
token.

## Scope
**In:** load Tanker via `next/font/local`; repoint `--font-serif` → Tanker; add
`--font-logo` → Kola; apply `font-logo` to the wordmark in `Navbar.tsx` +
`Footer.tsx`; remove the source zip; design-system typography docs.
**Out:** Clash Display body/UI (unchanged), type-scale sizes, other headings'
classNames (they keep `font-serif`, now = Tanker).

## Checklist
- [x] Extract `Tanker-Regular.woff2` into `app/fonts/`
- [x] Add `tanker` localFont in `app/layout.tsx` (`--font-tanker`, weight `400`,
      `display: swap`); add `tanker.variable` to `<html>` className
- [x] Repoint `--font-serif` → `var(--font-tanker)` in `app/globals.css`
- [x] Add `--font-logo: var(--font-kola), …` token in `app/globals.css`
- [x] Swap wordmark `font-serif` → `font-logo` in `Navbar.tsx` + `Footer.tsx`
- [x] Delete `public/Tanker_Complete.zip`
- [x] Update `docs/DESIGN_SYSTEM.md` §1.2 + version note (v2.21)
- [x] Verify: `npm run build` succeeds (Tanker + Kola + Clash all resolve)
