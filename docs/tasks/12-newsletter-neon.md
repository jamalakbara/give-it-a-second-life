# Task 12 — Persist newsletter subscribers to Neon

## Goal

Move newsletter signups from the in-memory Set to a Neon `newsletter_subscribers`
table so subscribers survive restarts. Mock stays as fallback when `DATABASE_URL`
is absent.

## Scope

**In**

- `newsletter_subscribers` table in `lib/db/schema.sql`
- `lib/data/subscribers.ts` — `addSubscriber(email)` adapter (Neon + mock)
- `app/api/newsletter/route.ts` uses the adapter; validation unchanged

**Out**

- Admin view / export of subscribers
- Email sending / double opt-in

## Checklist

- [x] Add `newsletter_subscribers` table (UNIQUE email) to schema.sql
- [x] `lib/data/subscribers.ts` — Neon `INSERT ... ON CONFLICT DO NOTHING`, mock fallback
- [x] Rewire `app/api/newsletter/route.ts` to `addSubscriber`
- [x] Table created by `npm run db:setup` (schema step)
- [x] `npm run build` + `npm run lint` clean
