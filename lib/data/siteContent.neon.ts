import { sql } from "@/lib/db";
import type { ContentKey } from "@/lib/content/defaults";

// SQL-backed store for admin-editable site copy + SEO. Active when DATABASE_URL
// is set (see lib/data/siteContent.ts). One row per top-level content key, with
// the partial override held as JSONB.
function db() {
  if (!sql) throw new Error("DATABASE_URL is not configured");
  return sql;
}

export async function getOverrides(): Promise<
  Partial<Record<ContentKey, unknown>>
> {
  let rows: { key: string; value: unknown }[];
  try {
    rows = (await db().query(`SELECT key, value FROM site_content`)) as {
      key: string;
      value: unknown;
    }[];
  } catch (err) {
    // Tolerate a not-yet-migrated table (relation does not exist): fall back to
    // code defaults so pages still render before `npm run db:setup` is run.
    if (err instanceof Error && /site_content/.test(err.message)) return {};
    throw err;
  }

  const overrides: Partial<Record<ContentKey, unknown>> = {};
  for (const row of rows) {
    overrides[row.key as ContentKey] = row.value;
  }
  return overrides;
}

export async function saveOverride(
  key: ContentKey,
  value: unknown,
): Promise<void> {
  await db().query(
    `INSERT INTO site_content (key, value, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE
       SET value = EXCLUDED.value, updated_at = NOW()`,
    [key, JSON.stringify(value)],
  );
}
