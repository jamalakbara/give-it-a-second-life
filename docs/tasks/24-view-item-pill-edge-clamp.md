# 24 — "View Item" pill edge clamp

## Goal

Stop the magnetic "View Item" hover pill from being visually clipped when the
cursor rides the edge of an item card.

## Scope

- In: clamp the pill's center so it stays fully inside the card's rounded,
  `overflow-hidden` media box; update design-system docs.
- Out: tilt behavior, wishlist star, sold-out veil, any other card visuals.

## Checklist

- [x] Measure pill half-size via a ref and clamp `--px/--py` in `applyMove`
  (pill half-size + 8px gap from each edge).
- [x] Keep tilt reading the raw (unclamped) cursor position.
- [x] Update `docs/DESIGN_SYSTEM.md` §2.4 pill description.
