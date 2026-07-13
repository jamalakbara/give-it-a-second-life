# 32 — Un-pin home arrivals carousel

## Goal
Stop the home page vertical scroll from stalling when passing the "Latest arrivals"
carousel. The sticky-pin stage held page scroll for a ~200–300px range that read as the
scroll being "stuck" (both directions).

## Scope
- In: remove the sticky pin from the arrivals section in `app/page.tsx`; carousel flows
  with the page.
- In: sync `docs/DESIGN_SYSTEM.md` §2.10 + version note.
- Out: no change to the scatter effect, peek/mask, caption, dashes, or `ArrivalsCarousel`
  internals.

## Checklist
- [x] Diagnose the stall — it was the `sticky top-…` pin inside `min-h-[calc(50svh+36rem)]`,
      not wheel capture / scroll latching (two earlier speculative fixes reverted)
- [x] `app/page.tsx` — replace pinned stage with a plain `relative py-16` section
- [x] `docs/DESIGN_SYSTEM.md` — update §2.10, bump to v2.17, add version note
- [ ] Manual verify: scroll top→bottom and back through the strip — no stall (needs user)
