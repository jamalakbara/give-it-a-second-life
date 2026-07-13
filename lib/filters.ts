import {
  CATEGORIES,
  CONDITIONS,
  SORT_OPTIONS,
  type Category,
  type Condition,
  type ItemFilters,
  type SortOption,
} from "@/lib/types";

type ParamSource = Record<string, string | string[] | undefined>;

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : value.split(",");
}

export function parseFilters(params: ParamSource): ItemFilters {
  const category = toArray(params.category).filter((c): c is Category =>
    (CATEGORIES as readonly string[]).includes(c),
  );
  const condition = toArray(params.condition).filter((c): c is Condition =>
    (CONDITIONS as readonly string[]).includes(c),
  );

  const minPrice = Number(params.minPrice);
  const maxPrice = Number(params.maxPrice);
  const sort = SORT_OPTIONS.includes(params.sort as SortOption)
    ? (params.sort as SortOption)
    : undefined;
  const search =
    typeof params.q === "string" && params.q.trim() ? params.q.trim() : undefined;

  // Infinite-scroll pagination (used by /api/items and the SSR first batch).
  const limit = Number(params.limit);
  const offset = Number(params.offset);

  return {
    category: category.length ? category : undefined,
    condition: condition.length ? condition : undefined,
    minPrice: Number.isFinite(minPrice) && minPrice > 0 ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : undefined,
    search,
    sort,
    limit: Number.isFinite(limit) && limit > 0 ? limit : undefined,
    offset: Number.isFinite(offset) && offset >= 0 ? offset : undefined,
  };
}
