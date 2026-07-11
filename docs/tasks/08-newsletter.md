# Task 08: Newsletter Signup

## Goal
Footer newsletter form with API endpoint (mock storage).

## Scope
- In: footer form, `/api/newsletter` route, validation + success/error states
- Out: real email persistence/sending (arrives with DB task)

## Checklist
- [x] Footer form: email input + minimal outlined subscribe button, copy "Get notified when new items drop"
- [x] `app/api/newsletter/route.ts` — validates email, stores in memory
- [x] Success state after submit, error state for invalid email
- [x] Duplicate email handled gracefully
