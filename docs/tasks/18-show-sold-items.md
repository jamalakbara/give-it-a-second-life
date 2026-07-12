# 18 — Show sold items in the catalog with a "Sold out" tag

## Goal

Keep sold items visible in the public gallery instead of hiding them, and overlay
a centered "Sold out" badge on the card image so shoppers can see what has gone.

## Scope

- **In:** public catalog lists sold items; `SOLD OUT` overlay on `CardMedia`;
  form copy + docs updated to reflect the new behavior.
- **Out:** item detail page treatment, disabling wishlist on sold items,
  sold-specific filtering/sorting controls.

## Checklist

- [x] Public `getItems` returns sold items (mock + neon adapters)
- [x] `CardMedia` renders a centered "Sold out" overlay when `isSold`
- [x] `ItemCard` passes `item.isSold` to `CardMedia`
- [x] `ItemForm` sold-toggle copy updated (no longer "hides from catalog")
- [x] `docs/PRD.md` reflects sold items stay visible with a tag
- [x] `docs/DESIGN_SYSTEM.md` documents the sold-out overlay
