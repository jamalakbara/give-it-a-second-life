import { clerkMiddleware } from "@clerk/nextjs/server";

// Next.js 16 renamed `middleware` → `proxy`; Clerk's `clerkMiddleware()` is
// exported here as the default. It does not protect any route on its own —
// authorization is enforced close to each resource (the /admin server page and
// the admin API routes via `isAdmin()` in lib/adminAuth.ts).
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless referenced in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
