export const CATEGORIES = [
  "clothing",
  "accessories",
  "home",
  "books",
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

export const CATEGORY_LABELS: Record<Category, string> = {
  clothing: "Clothing",
  accessories: "Accessories",
  home: "Home & Décor",
  books: "Books",
  other: "Other",
};

export const CONDITION_LABELS: Record<Condition, string> = {
  new: "New",
  "like-new": "Like New",
  good: "Good",
  fair: "Fair",
};
