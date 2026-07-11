# Task 06: Wishlist (localStorage)

## Goal
Client-side wishlist persisted in localStorage with dedicated page.

## Scope
- In: useWishlist hook, heart toggles, navbar count, wishlist page
- Out: server-side wishlist (Phase 2 with auth)

## Checklist
- [x] `hooks/useWishlist.ts` — hydration-safe localStorage hook (no SSR mismatch)
- [x] Heart toggle on ItemCard + detail page, filled gold when active
- [x] Navbar wishlist icon shows live count
- [x] `app/wishlist/page.tsx` — saved items grid, remove support, empty state
- [x] Wishlist survives page reload
