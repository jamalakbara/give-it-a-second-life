# 40 — Clerk appearance themed to design system

## Goal
Skin Clerk's UI (`<UserButton>` popover, sign-in redirect page, modals) to match the
dark "living gallery" theme instead of Clerk's default light chrome.

## Scope
- **In:** `appearance` prop on `<ClerkProvider>` (`app/layout.tsx`) — `variables` (colors,
  radius, font) + `elements` (glass card, hairline inputs, accent button, serif headings)
  reusing existing design tokens/utilities. No new tokens or components.
- **Out:** Tier 2 headless `@clerk/elements` custom sign-in markup (not needed; `elements`
  skin is the ceiling for the `<UserButton>` popover regardless).

## Checklist
- [x] Add `appearance.variables` (accent `#e0533d`, transparent bg, cream fg, glass input, `0.75rem` radius, `--font-clash`)
- [x] Add `appearance.elements` reusing `.glass`, `font-serif`, `.tracked`, `border-hairline`, `bg-accent`, `text-void`
- [x] Use Clerk v7 variable names (`colorForeground`/`colorMutedForeground`/`colorInput`/`colorInputForeground`/`colorPrimaryForeground`)
- [x] `npx tsc --noEmit` clean
- [x] Sync `docs/DESIGN_SYSTEM.md` (version note)
