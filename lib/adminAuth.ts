// Admin auth for the seller dashboard and its mutating endpoints. Access is
// gated by Clerk: the single owner's Clerk user carries `publicMetadata.role
// = "admin"` (set once in the Clerk dashboard). Server code calls `isAdmin()`;
// there is no shared password and nothing is trusted from the client.

import { currentUser } from "@clerk/nextjs/server";

export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  return user?.publicMetadata?.role === "admin";
}
