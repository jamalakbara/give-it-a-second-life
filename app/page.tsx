import { Suspense } from "react";
import { getItemCount, getItems } from "@/lib/data/items";
import { parseFilters } from "@/lib/filters";
import type { ItemFilters } from "@/lib/types";
import { FilterBar } from "@/components/FilterBar";
import { ItemGrid } from "@/components/ItemGrid";

const PAGE_SIZE = 8;

// Filter querystring (no limit/offset) the client grid replays for each batch.
function filtersToQuery(filters: ItemFilters): string {
  const qs = new URLSearchParams();
  if (filters.category?.length) qs.set("category", filters.category.join(","));
  if (filters.condition?.length) qs.set("condition", filters.condition.join(","));
  if (filters.minPrice !== undefined) qs.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) qs.set("maxPrice", String(filters.maxPrice));
  if (filters.search) qs.set("q", filters.search);
  if (filters.sort) qs.set("sort", filters.sort);
  return qs.toString();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  // First batch is server-rendered (fast paint + SEO); the client grid appends
  // the rest on scroll. `total` drives the search-result header.
  const [items, total] = await Promise.all([
    getItems({ ...filters, limit: PAGE_SIZE, offset: 0 }),
    getItemCount(filters),
  ]);
  const query = filtersToQuery(filters);

  return (
    <div>
      {/* Hero — full aurora shows through */}
      <section className="flex min-h-[68vh] flex-col items-center justify-center px-6 text-center">
        <p className="tracked animate-rise text-[11px] text-fg-muted">
          A living gallery
        </p>
        <h1 className="mt-6 max-w-5xl font-serif text-hero font-medium text-fg animate-rise">
          Discover preloved treasures.
        </h1>
        <p className="mt-7 max-w-xl text-[16px] text-fg-muted animate-rise md:text-[18px]">
          Extend the lifecycle of beautiful things. Every piece curated, every
          piece with a story.
        </p>
      </section>

      {/* Gallery — darkened stage */}
      <section className="veil px-4 pb-24 pt-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1120px]">
          <Suspense>
            <FilterBar />
          </Suspense>

          {filters.search && (
            <p className="tracked mb-8 text-[11px] text-fg-muted">
              {total} result{total === 1 ? "" : "s"} for “{filters.search}”
            </p>
          )}

          {items.length === 0 ? (
            <div className="py-28 text-center">
              <p className="font-serif text-h3 text-fg">Nothing here yet</p>
              <p className="mt-3 text-[14px] text-fg-muted">
                Try adjusting your filters or search.
              </p>
            </div>
          ) : (
            <ItemGrid
              key={query}
              initialItems={items}
              query={query}
              pageSize={PAGE_SIZE}
              initialHasMore={items.length === PAGE_SIZE}
            />
          )}
        </div>
      </section>
    </div>
  );
}
