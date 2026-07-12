import type {
  CreateItemInput,
  Item,
  ItemFilters,
  UpdateItemInput,
} from "@/lib/types";

// Mock adapter: in-memory store standing in for Neon until the DB task.
// Repository surface (getItems/getItem/createItem/updateItem/deleteItem) is the
// swap point — replace the internals with SQL and nothing above this layer changes.

function img(itemId: number, seed: string, alt: string, order: number) {
  return {
    id: itemId * 10 + order,
    url: `https://picsum.photos/seed/${seed}/800/800`,
    alt,
    displayOrder: order,
  };
}

const rawSeedItems: Omit<Item, "sortOrder">[] = [
  {
    id: 1,
    title: "Vintage Black Wool Blazer",
    description:
      "Timeless black blazer perfect for layering. Lightweight wool with structured shoulders and a tailored fit that works from office to evening. Worn twice, kept in a garment bag since. Pairs beautifully with denim or tailored trousers.",
    price: 450000,
    category: "clothing",
    condition: "like-new",
    size: "M",
    color: "Black",
    material: "Wool",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-01T09:00:00Z",
    images: [
      img(1, "blazer-front", "Vintage black wool blazer, front view", 1),
      img(1, "blazer-back", "Vintage black wool blazer, back view", 2),
      img(1, "blazer-detail", "Blazer fabric and button detail", 3),
    ],
  },
  {
    id: 2,
    title: "Italian Leather Brown Belt",
    description:
      "Genuine Italian leather belt with a solid brass buckle. The patina it has developed adds real character — the kind you can't buy new. Fits waist 80–95cm. A staple that grounds any outfit.",
    price: 250000,
    category: "accessories",
    condition: "good",
    size: "80–95cm",
    color: "Brown",
    material: "Leather",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-02T10:30:00Z",
    images: [
      img(2, "belt-full", "Brown Italian leather belt, full view", 1),
      img(2, "belt-buckle", "Brass buckle close-up", 2),
    ],
  },
  {
    id: 3,
    title: "Linen Summer Shirt, Sand",
    description:
      "Breathable pure linen shirt in a warm sand tone. Relaxed cut, mother-of-pearl buttons. Perfect for hot afternoons — it only gets softer with every wash. Worn a handful of times, no flaws.",
    price: 320000,
    category: "clothing",
    condition: "like-new",
    size: "L",
    color: "Sand",
    material: "Linen",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-03T08:15:00Z",
    images: [
      img(3, "linen-shirt", "Sand linen shirt on hanger", 1),
      img(3, "linen-detail", "Linen weave and button detail", 2),
    ],
  },
  {
    id: 4,
    title: "Ceramic Table Vase, Handmade",
    description:
      "Hand-thrown ceramic vase with a matte cream glaze. Small maker's mark on the base. Holds a single stem or a small bouquet beautifully. No chips or cracks — displayed on a shelf away from sunlight.",
    price: 180000,
    category: "home",
    condition: "good",
    size: "22cm tall",
    color: "Cream",
    material: "Ceramic",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-03T14:00:00Z",
    images: [
      img(4, "vase-front", "Handmade cream ceramic vase", 1),
      img(4, "vase-top", "Vase opening from above", 2),
    ],
  },
  {
    id: 5,
    title: "Denim Jacket, Faded Indigo",
    description:
      "Classic trucker-style denim jacket with honest fading at the cuffs and collar. Heavyweight cotton that has already done the hard work of breaking in. Fits true to size with room for a hoodie underneath.",
    price: 380000,
    category: "clothing",
    condition: "good",
    size: "M",
    color: "Indigo",
    material: "Cotton denim",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-04T11:45:00Z",
    images: [
      img(5, "denim-front", "Faded indigo denim jacket, front", 1),
      img(5, "denim-back", "Denim jacket back panel", 2),
      img(5, "denim-cuff", "Faded cuff detail", 3),
    ],
  },
  {
    id: 6,
    title: "The Design of Everyday Things",
    description:
      "Don Norman's classic on human-centred design, revised edition. Spine intact, pages clean with light pencil margin notes in two chapters (easily erased). The book every designer ends up recommending.",
    price: 95000,
    category: "books",
    condition: "good",
    color: "Paperback",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-05T09:20:00Z",
    images: [img(6, "design-book", "The Design of Everyday Things paperback", 1)],
  },
  {
    id: 7,
    title: "Silk Scarf, Botanical Print",
    description:
      "100% silk scarf with a hand-rolled hem and a soft botanical print in muted greens. Worn once to a wedding. Drapes like water — wear it at the neck, on a bag, or as a headband.",
    price: 210000,
    category: "accessories",
    condition: "like-new",
    size: "90×90cm",
    color: "Green botanical",
    material: "Silk",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-05T16:10:00Z",
    images: [
      img(7, "silk-scarf", "Botanical print silk scarf, spread flat", 1),
      img(7, "scarf-hem", "Hand-rolled hem detail", 2),
    ],
  },
  {
    id: 8,
    title: "Brass Desk Lamp, Mid-Century",
    description:
      "Mid-century brass desk lamp with an adjustable arm and its original switch. Rewired last year with a new cord for safety. Warm, focused light — makes any desk corner feel intentional.",
    price: 520000,
    category: "home",
    condition: "good",
    size: "45cm arm",
    color: "Brass",
    material: "Brass",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-06T10:00:00Z",
    images: [
      img(8, "brass-lamp", "Mid-century brass desk lamp", 1),
      img(8, "lamp-detail", "Lamp joint and switch detail", 2),
    ],
  },
  {
    id: 9,
    title: "Cashmere Crewneck, Oat",
    description:
      "Pure cashmere crewneck in a soft oat colour. Impossibly light and warm. One tiny mend at the left cuff, done professionally and invisible when worn. Hand-washed and stored folded with cedar.",
    price: 680000,
    category: "clothing",
    condition: "good",
    size: "S",
    color: "Oat",
    material: "Cashmere",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-07T09:40:00Z",
    images: [
      img(9, "cashmere-flat", "Oat cashmere crewneck, flat lay", 1),
      img(9, "cashmere-knit", "Cashmere knit texture close-up", 2),
    ],
  },
  {
    id: 10,
    title: "Canvas Tote, Waxed Olive",
    description:
      "Heavy waxed canvas tote with leather handles and a single interior pocket. The wax finish means it shrugs off rain and only looks better with age. Carried for one season.",
    price: 290000,
    category: "accessories",
    condition: "good",
    size: "40×35×12cm",
    color: "Olive",
    material: "Waxed canvas",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-07T15:25:00Z",
    images: [
      img(10, "canvas-tote", "Waxed olive canvas tote bag", 1),
      img(10, "tote-handle", "Leather handle detail", 2),
    ],
  },
  {
    id: 11,
    title: "Norwegian Wood — Haruki Murakami",
    description:
      "Vintage-edition paperback of Murakami's most tender novel. Cover shows gentle shelf wear that suits it; pages are clean and unmarked. The kind of book you pass on so someone else can fall into it.",
    price: 75000,
    category: "books",
    condition: "fair",
    color: "Paperback",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-08T08:00:00Z",
    images: [img(11, "murakami-book", "Norwegian Wood paperback cover", 1)],
  },
  {
    id: 12,
    title: "Pleated Midi Skirt, Charcoal",
    description:
      "Accordion-pleated midi skirt in deep charcoal. Elastic waistband, flows beautifully when you walk. Machine washable and completely crease-proof — genuinely low-maintenance elegance. Brand new with tags.",
    price: 340000,
    category: "clothing",
    condition: "new",
    size: "M",
    color: "Charcoal",
    material: "Polyester",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-08T13:50:00Z",
    images: [
      img(12, "pleated-skirt", "Charcoal pleated midi skirt", 1),
      img(12, "pleat-detail", "Pleat detail close-up", 2),
    ],
  },
  {
    id: 13,
    title: "Walnut Serving Board",
    description:
      "Solid walnut serving board with a live edge, finished with food-safe mineral oil. Used for styling shoots, never for cutting. Rich grain that photographs — and serves cheese — beautifully.",
    price: 230000,
    category: "home",
    condition: "like-new",
    size: "45×20cm",
    color: "Walnut",
    material: "Walnut wood",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-09T10:15:00Z",
    images: [
      img(13, "walnut-board", "Live-edge walnut serving board", 1),
      img(13, "walnut-grain", "Walnut grain detail", 2),
    ],
  },
  {
    id: 14,
    title: "Aviator Sunglasses, Gold Frame",
    description:
      "Classic aviators with a slim gold frame and green G-15 lenses. No scratches on the lenses; comes with the original hard case and cloth. One of those pieces that works on every face.",
    price: 410000,
    category: "accessories",
    condition: "like-new",
    color: "Gold / Green",
    material: "Metal, glass",
    sellerId: "seller_akbar",
    isSold: false,
    createdAt: "2026-07-10T09:30:00Z",
    images: [
      img(14, "aviators", "Gold-frame aviator sunglasses", 1),
      img(14, "aviators-case", "Sunglasses with original case", 2),
    ],
  },
];

// Assign sortOrder newest-first so the default view matches prior behaviour
// (lower sortOrder shows earlier). Admin drag-reorder overwrites these.
export const seedItems: Item[] = [...rawSeedItems]
  .sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  .map((item, i) => ({ ...item, sortOrder: i + 1 }));

// Survives HMR in dev; resets on server restart (mock only).
const globalStore = globalThis as unknown as { __items?: Item[] };
globalStore.__items ??= seedItems;
const items = globalStore.__items;

function applyFilters(base: Item[], filters: ItemFilters): Item[] {
  let result = base;

  if (filters.category?.length) {
    result = result.filter((item) => filters.category!.includes(item.category));
  }
  if (filters.condition?.length) {
    result = result.filter((item) =>
      filters.condition!.includes(item.condition),
    );
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((item) => item.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((item) => item.price <= filters.maxPrice!);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    default:
      // Admin-defined catalog order (lower sortOrder first), createdAt as tiebreak.
      result.sort(
        (a, b) =>
          a.sortOrder - b.sortOrder ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  return result;
}

export async function getItems(filters: ItemFilters = {}): Promise<Item[]> {
  // Sold items stay in the public catalog (shown with a "Sold out" tag), so the
  // public list now matches the admin list.
  return applyFilters([...items], filters);
}

// Admin view: includes sold items so they can still be managed.
export async function getAllItems(filters: ItemFilters = {}): Promise<Item[]> {
  return applyFilters([...items], filters);
}

export async function getItem(id: number): Promise<Item | null> {
  return items.find((item) => item.id === id) ?? null;
}

export async function createItem(input: CreateItemInput): Promise<Item> {
  const id = Math.max(0, ...items.map((item) => item.id)) + 1;
  // New items go to the top of the catalog (min sortOrder − 1).
  const minOrder = items.length
    ? Math.min(...items.map((item) => item.sortOrder))
    : 1;
  const item: Item = {
    id,
    title: input.title,
    description: input.description,
    price: input.price,
    category: input.category,
    condition: input.condition,
    size: input.size || undefined,
    color: input.color || undefined,
    material: input.material || undefined,
    sellerId: "seller_akbar",
    isSold: false,
    sortOrder: minOrder - 1,
    createdAt: new Date().toISOString(),
    images: input.imageUrls.map((url, i) => ({
      id: id * 10 + i + 1,
      url,
      alt: input.title,
      displayOrder: i + 1,
    })),
  };
  items.push(item);
  return item;
}

export async function updateItem(
  id: number,
  input: UpdateItemInput,
): Promise<Item | null> {
  const existing = items.find((item) => item.id === id);
  if (!existing) return null;

  existing.title = input.title;
  existing.description = input.description;
  existing.price = input.price;
  existing.category = input.category;
  existing.condition = input.condition;
  existing.size = input.size || undefined;
  existing.color = input.color || undefined;
  existing.material = input.material || undefined;
  existing.isSold = input.isSold ?? existing.isSold;
  existing.images = input.imageUrls.map((url, i) => ({
    id: id * 10 + i + 1,
    url,
    alt: input.title,
    displayOrder: i + 1,
  }));

  return existing;
}

export async function deleteItem(id: number): Promise<boolean> {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  return true;
}

// Reassign sortOrder by the given id order (index 0 → shown first). Ids not in
// the list keep their current sortOrder.
export async function reorderItems(orderedIds: number[]): Promise<void> {
  orderedIds.forEach((id, index) => {
    const item = items.find((entry) => entry.id === id);
    if (item) item.sortOrder = index + 1;
  });
}
