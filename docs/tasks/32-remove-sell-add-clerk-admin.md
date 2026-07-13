# Task 32: Remove nav "Sell" link + real Clerk admin auth

## Goal

Stop advertising the admin dashboard in the public nav, and replace the
`NEXT_PUBLIC_ADMIN_PASSWORD` / `x-admin-password` gate with real authentication via
Clerk, restricted to the single owner by a Clerk role.

## Scope

**In:**
- Remove the `/admin` "Sell" entry from `NAV_LINKS`.
- Add `@clerk/nextjs`, `<ClerkProvider>`, and `proxy.ts` (`clerkMiddleware()`).
- Guard the `/admin` page (server) and all 5 admin API routes on Clerk role `admin`.
- Remove the password header from the 3 client senders.
- Sync docs (PRD, TECH_SETUP, DESIGN_SYSTEM).

**Out:**
- Multi-seller onboarding / multiple admins (still Phase 3).
- Clerk dashboard config (create app, set owner `publicMetadata.role=admin`, disable
  public sign-up) — manual prerequisite, not code.

## Checklist

- [x] `components/Navbar.tsx` — drop the `{ href: "/admin", label: "Sell" }` entry
- [x] `npm install @clerk/nextjs`
- [x] `app/layout.tsx` — wrap in `<ClerkProvider>`
- [x] `proxy.ts` — `export default clerkMiddleware()` + matcher
- [x] `lib/adminAuth.ts` — replace `isAuthorized(req)` with Clerk `isAdmin()`
- [x] `app/api/items/route.ts` (POST) — use `isAdmin()`
- [x] `app/api/items/[id]/route.ts` (PATCH + DELETE) — use `isAdmin()`
- [x] `app/api/items/reorder/route.ts` (PATCH) — use `isAdmin()`
- [x] `app/api/media/route.ts` (GET) — use `isAdmin()`
- [x] `components/ItemForm.tsx` — remove password header + env read
- [x] `components/AdminItemList.tsx` — remove password headers + env read
- [x] `components/MediaPicker.tsx` — remove password header + env read
- [x] `app/admin/page.tsx` — server guard (`auth()` redirect) + `<AdminDashboard>` client child + Clerk `<UserButton>`
- [x] `.env.example` — add Clerk keys, remove `NEXT_PUBLIC_ADMIN_PASSWORD`
- [x] `docs/PRD.md` — admin auth Phase-2 → MVP
- [x] `docs/TECH_SETUP.md` Part 7 — rewrite to implemented Clerk design (Part 4.3 marked superseded)
- [x] `docs/DESIGN_SYSTEM.md` — nav link list minus "Sell"; admin sign-in surface; version bump
- [x] `npm run build` passes; no `ADMIN_PASSWORD` / `x-admin-password` refs remain in `app`/`components`/`lib`

## Prerequisites for the owner (manual, not code)

- Create the Clerk app; put `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` in
  `.env.local` (and deploy env).
- Set the owner's Clerk user `publicMetadata.role = "admin"`.
- Disable public sign-ups in the Clerk dashboard.
