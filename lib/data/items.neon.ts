import { sql } from "@/lib/db";
import type { CreateItemInput, Item, ItemFilters } from "@/lib/types";

// SQL-backed adapter. Active when DATABASE_URL is set (see lib/data/items.ts).
// `sql` is guaranteed non-null here because the index only delegates to this
// module when hasDatabase is true.
function db() {
  if (!sql) throw new Error("DATABASE_URL is not configured");
  return sql;
}

interface ItemRow {
  id: number;
  title: string;
  description: string;
  price: string | number;
  category: string;
  condition: string;
  size: string | null;
  color: string | null;
  material: string | null;
  seller_id: string;
  is_sold: boolean;
  created_at: string | Date;
  images:
    | {
        id: number;
        url: string;
        alt: string;
        displayOrder: number;
      }[]
    | null;
}

function mapRow(row: ItemRow): Item {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    category: row.category as Item["category"],
    condition: row.condition as Item["condition"],
    size: row.size ?? undefined,
    color: row.color ?? undefined,
    material: row.material ?? undefined,
    sellerId: row.seller_id,
    isSold: row.is_sold,
    createdAt: new Date(row.created_at).toISOString(),
    images: (row.images ?? []).map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      displayOrder: image.displayOrder,
    })),
  };
}

// Reusable images subquery so getItems/getItem return the same shape.
const IMAGES_SUBQUERY = `COALESCE(
  (
    SELECT json_agg(
      json_build_object(
        'id', im.id,
        'url', im.url,
        'alt', im.alt,
        'displayOrder', im.display_order
      ) ORDER BY im.display_order
    )
    FROM item_images im
    WHERE im.item_id = i.id
  ),
  '[]'
) AS images`;

export async function getItems(filters: ItemFilters = {}): Promise<Item[]> {
  const conditions = ["i.is_sold = false"];
  const params: unknown[] = [];

  if (filters.category?.length) {
    params.push(filters.category);
    conditions.push(`i.category = ANY($${params.length})`);
  }
  if (filters.condition?.length) {
    params.push(filters.condition);
    conditions.push(`i.condition = ANY($${params.length})`);
  }
  if (filters.minPrice !== undefined) {
    params.push(filters.minPrice);
    conditions.push(`i.price >= $${params.length}`);
  }
  if (filters.maxPrice !== undefined) {
    params.push(filters.maxPrice);
    conditions.push(`i.price <= $${params.length}`);
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    conditions.push(
      `(i.title ILIKE $${params.length} OR i.description ILIKE $${params.length})`,
    );
  }

  const orderBy =
    filters.sort === "price-asc"
      ? "i.price ASC"
      : filters.sort === "price-desc"
        ? "i.price DESC"
        : "i.created_at DESC";

  const query = `
    SELECT i.*, ${IMAGES_SUBQUERY}
    FROM items i
    WHERE ${conditions.join(" AND ")}
    ORDER BY ${orderBy}
  `;

  const rows = (await db().query(query, params)) as ItemRow[];
  return rows.map(mapRow);
}

export async function getItem(id: number): Promise<Item | null> {
  const query = `
    SELECT i.*, ${IMAGES_SUBQUERY}
    FROM items i
    WHERE i.id = $1
  `;
  const rows = (await db().query(query, [id])) as ItemRow[];
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function createItem(input: CreateItemInput): Promise<Item> {
  const inserted = (await db().query(
    `INSERT INTO items (title, description, price, category, condition, size, color, material)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [
      input.title,
      input.description,
      input.price,
      input.category,
      input.condition,
      input.size || null,
      input.color || null,
      input.material || null,
    ],
  )) as { id: number }[];

  const itemId = inserted[0].id;
  const urls = input.imageUrls.filter((url) => url.trim());

  for (let i = 0; i < urls.length; i++) {
    await db().query(
      `INSERT INTO item_images (item_id, url, alt, display_order)
       VALUES ($1, $2, $3, $4)`,
      [itemId, urls[i], input.title, i + 1],
    );
  }

  const item = await getItem(itemId);
  if (!item) throw new Error("Failed to load created item");
  return item;
}
