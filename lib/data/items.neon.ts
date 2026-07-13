import { sql } from "@/lib/db";
import type {
  CreateItemInput,
  Item,
  ItemFilters,
  UpdateItemInput,
} from "@/lib/types";

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
  sort_order: number | null;
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
    sortOrder: row.sort_order ?? 0,
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

// Builds the shared WHERE clause + bound params so queryItems and countItems
// filter identically. `params` is mutated in place; the returned string is the
// SQL condition list joined with AND.
function buildWhere(
  filters: ItemFilters,
  includeSold: boolean,
  params: unknown[],
): string {
  const conditions = includeSold ? ["TRUE"] : ["i.is_sold = false"];

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

  return conditions.join(" AND ");
}

async function queryItems(
  filters: ItemFilters,
  includeSold: boolean,
): Promise<Item[]> {
  const params: unknown[] = [];
  const where = buildWhere(filters, includeSold, params);

  const orderBy =
    filters.sort === "price-asc"
      ? "i.price ASC"
      : filters.sort === "price-desc"
        ? "i.price DESC"
        : "i.sort_order ASC NULLS LAST, i.created_at DESC";

  // Infinite scroll: apply LIMIT/OFFSET only when the caller paginates.
  let pagination = "";
  if (filters.limit !== undefined) {
    params.push(filters.limit);
    pagination += ` LIMIT $${params.length}`;
  }
  if (filters.offset !== undefined) {
    params.push(filters.offset);
    pagination += ` OFFSET $${params.length}`;
  }

  const query = `
    SELECT i.*, ${IMAGES_SUBQUERY}
    FROM items i
    WHERE ${where}
    ORDER BY ${orderBy}${pagination}
  `;

  const rows = (await db().query(query, params)) as ItemRow[];
  return rows.map(mapRow);
}

// Total matching count (ignores limit/offset) — used for the search-result header.
async function countItems(
  filters: ItemFilters,
  includeSold: boolean,
): Promise<number> {
  const params: unknown[] = [];
  const where = buildWhere(filters, includeSold, params);
  const rows = (await db().query(
    `SELECT COUNT(*)::int AS count FROM items i WHERE ${where}`,
    params,
  )) as { count: number }[];
  return rows[0]?.count ?? 0;
}

export async function getItems(filters: ItemFilters = {}): Promise<Item[]> {
  // Sold items stay in the public catalog (shown with a "Sold out" tag).
  return queryItems(filters, true);
}

// Admin view: includes sold items so they can still be managed.
export async function getAllItems(filters: ItemFilters = {}): Promise<Item[]> {
  return queryItems(filters, true);
}

// Total matching items (sold included, matching the public catalog).
export async function getItemCount(filters: ItemFilters = {}): Promise<number> {
  return countItems(filters, true);
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
    // New items go to the top of the catalog (min sort_order − 1).
    `INSERT INTO items (title, description, price, category, condition, size, color, material, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
             (SELECT COALESCE(MIN(sort_order), 1) - 1 FROM items))
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

export async function updateItem(
  id: number,
  input: UpdateItemInput,
): Promise<Item | null> {
  const updated = (await db().query(
    `UPDATE items
     SET title = $1, description = $2, price = $3, category = $4,
         condition = $5, size = $6, color = $7, material = $8, is_sold = $9
     WHERE id = $10
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
      input.isSold ?? false,
      id,
    ],
  )) as { id: number }[];

  if (!updated[0]) return null;

  // Replace the image set: drop existing rows, re-insert in order.
  await db().query(`DELETE FROM item_images WHERE item_id = $1`, [id]);
  const urls = input.imageUrls.filter((url) => url.trim());
  for (let i = 0; i < urls.length; i++) {
    await db().query(
      `INSERT INTO item_images (item_id, url, alt, display_order)
       VALUES ($1, $2, $3, $4)`,
      [id, urls[i], input.title, i + 1],
    );
  }

  return getItem(id);
}

export async function deleteItem(id: number): Promise<boolean> {
  // item_images rows are removed via ON DELETE CASCADE.
  const deleted = (await db().query(
    `DELETE FROM items WHERE id = $1 RETURNING id`,
    [id],
  )) as { id: number }[];
  return deleted.length > 0;
}

// Reassign sort_order by the given id order (index 0 → shown first).
export async function reorderItems(orderedIds: number[]): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await db().query(`UPDATE items SET sort_order = $1 WHERE id = $2`, [
      i + 1,
      orderedIds[i],
    ]);
  }
}
