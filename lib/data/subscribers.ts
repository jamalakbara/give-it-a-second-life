import { hasDatabase, sql } from "@/lib/db";

export type SubscribeResult = "added" | "exists";

// Mock fallback: in-memory Set, survives HMR, resets on restart.
const store = globalThis as unknown as { __subscribers?: Set<string> };
store.__subscribers ??= new Set<string>();

// Adds a normalized email to the newsletter list. Returns "exists" if the
// address was already subscribed. Persists to Neon when DATABASE_URL is set.
export async function addSubscriber(email: string): Promise<SubscribeResult> {
  if (hasDatabase && sql) {
    const rows = (await sql.query(
      `INSERT INTO newsletter_subscribers (email)
       VALUES ($1)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [email],
    )) as { id: number }[];
    return rows.length > 0 ? "added" : "exists";
  }

  if (store.__subscribers!.has(email)) return "exists";
  store.__subscribers!.add(email);
  return "added";
}
