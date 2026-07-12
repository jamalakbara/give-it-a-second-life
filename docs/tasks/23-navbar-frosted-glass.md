# 23 — Navbar frosted glass fix

## Goal
Make the sticky navbar read as a real frosted-glass panel — overlapped card
images / aurora should be blurred and darkened, matching the jackwatkins.co header
(instead of the near-transparent, un-blurred look reported by the user).

## Scope
- In: navbar glass strength (blur + tint), root cause of missing blur site-wide.
- Out: other components' visual redesign.

## Root cause
Lightning CSS (Tailwind v4 build) was silently **pruning hand-written
`backdrop-filter`** from `app/globals.css` — so `.glass` and `.glass-nav` had no
blur at all in the compiled stylesheet (only fill + border survived).

## Checklist
- [x] Diagnose why blur wasn't rendering (inspected compiled `.glass`/`.glass-nav` rules live — `backdrop-filter` stripped)
- [x] Add stronger `.glass-nav` variant (dark warm fill `rgba(28,20,12,0.55)`)
- [x] Apply nav blur via Tailwind `backdrop-blur-2xl backdrop-saturate-150` (survives build) on header + mobile menu
- [x] Restore `.glass` blur site-wide by guarding it in `@supports`
- [x] Verify in browser over hero (aurora) and over card images
- [x] Sync `docs/DESIGN_SYSTEM.md` (glass section + Lightning CSS build gotcha)
