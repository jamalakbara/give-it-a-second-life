# Task 07: Admin Panel

## Goal
Password-protected admin page to create items (MVP-simple, per TECH_SETUP §4.3).

## Scope
- In: password gate (env var + sessionStorage), ItemForm, POST wiring
- Out: Clerk auth (Phase 2), edit/delete items

## Checklist
- [x] `app/admin/page.tsx` — password gate using `NEXT_PUBLIC_ADMIN_PASSWORD`, sessionStorage persistence, logout
- [x] `ItemForm` — title, price (IDR), category, condition, description, size/color/material, image URLs (dynamic add)
- [x] Form POSTs to `/api/items`, success/error feedback
- [x] New item appears in gallery after creation
- [x] Note documented: mock adapter persists only in server memory until Neon swap
