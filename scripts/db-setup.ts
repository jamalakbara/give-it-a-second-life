// One-shot DB provisioner: applies lib/db/schema.sql then seeds the catalog.
// Run with:  npm run db:setup      (idempotent — skips seed if items exist)
//            npm run db:setup -- --force-seed   (wipe + reseed)
//
// Node runs this .ts file directly (type stripping) and loads DATABASE_URL via
// --env-file=.env.local (see package.json).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";
import { seedItems } from "../lib/data/items.mock.ts";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Add it to .env.local first.");
  process.exit(1);
}

const sql = neon(connectionString);
const here = dirname(fileURLToPath(import.meta.url));
const force = process.argv.includes("--force-seed");

async function main() {
  // Schema — split on ; so each statement runs as its own HTTP query.
  const schema = readFileSync(join(here, "../lib/db/schema.sql"), "utf8");
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`Schema applied (${statements.length} statements).`);

  const [{ count }] = (await sql.query(
    "SELECT COUNT(*)::int AS count FROM items",
  )) as { count: number }[];

  if (count > 0 && !force) {
    console.log(`Items table already has ${count} rows — skipping seed.`);
    console.log("Re-run with `-- --force-seed` to wipe and reseed.");
    return;
  }

  if (force) {
    await sql.query("TRUNCATE items RESTART IDENTITY CASCADE");
    console.log("Existing items wiped (--force-seed).");
  }

  for (const item of seedItems) {
    const inserted = (await sql.query(
      `INSERT INTO items (title, description, price, category, condition, size, color, material, seller_id, is_sold, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [
        item.title,
        item.description,
        item.price,
        item.category,
        item.condition,
        item.size ?? null,
        item.color ?? null,
        item.material ?? null,
        item.sellerId,
        item.isSold,
        item.createdAt,
      ],
    )) as { id: number }[];

    const itemId = inserted[0].id;
    for (const image of item.images) {
      await sql.query(
        `INSERT INTO item_images (item_id, url, alt, display_order)
         VALUES ($1,$2,$3,$4)`,
        [itemId, image.url, image.alt, image.displayOrder],
      );
    }
  }
  console.log(`Seeded ${seedItems.length} items.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
