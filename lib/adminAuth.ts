// MVP admin auth for mutating item endpoints. The client sends the shared
// password in the `x-admin-password` header; the server compares it against the
// configured secret. This is intentionally simple (matches the sessionStorage
// gate on /admin) and should be replaced by real auth (e.g. Clerk) in Phase 2.

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ?? process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

export function isAuthorized(req: Request): boolean {
  if (!ADMIN_PASSWORD) return false;
  return req.headers.get("x-admin-password") === ADMIN_PASSWORD;
}
