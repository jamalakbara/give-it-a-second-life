export const CATEGORIES = [
  "clothing",
  "accessories",
  "home",
  "books",
  "electronics",
  "vehicles",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CONDITIONS = ["new", "like-new", "good", "fair"] as const;
export type Condition = (typeof CONDITIONS)[number];

export const SORT_OPTIONS = ["newest", "price-asc", "price-desc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export interface ItemImage {
  id: number;
  url: string;
  alt: string;
  displayOrder: number;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  size?: string;
  color?: string;
  material?: string;
  sellerId: string;
  isSold: boolean;
  // Admin-controlled catalog position. Lower = shown earlier. Drives the default
  // (non-price) sort in the public gallery and admin list.
  sortOrder: number;
  createdAt: string;
  images: ItemImage[];
}

export interface ItemFilters {
  category?: Category[];
  condition?: Condition[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: SortOption;
  // Pagination for infinite scroll. When set, the data layer applies
  // LIMIT/OFFSET (or slice) so the gallery loads in batches on scroll.
  limit?: number;
  offset?: number;
}

export interface CreateItemInput {
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  size?: string;
  color?: string;
  material?: string;
  imageUrls: string[];
}

// Full replacement of an existing item's editable fields. `isSold` toggles
// whether the item shows in the public catalog.
export interface UpdateItemInput extends CreateItemInput {
  isSold?: boolean;
}

// Batch reorder payload: the full list of item ids in their new display order.
// Index 0 becomes the first item shown.
export interface ReorderInput {
  orderedIds: number[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  clothing: "Clothing",
  accessories: "Accessories",
  home: "Home & Décor",
  books: "Books",
  electronics: "Electronics",
  vehicles: "Vehicles",
  other: "Other",
};

export const CONDITION_LABELS: Record<Condition, string> = {
  new: "New",
  "like-new": "Like New",
  good: "Good",
  fair: "Fair",
};
