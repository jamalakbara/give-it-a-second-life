import { Suspense } from "react";
import { getItems } from "@/lib/data/items";
import { parseFilters } from "@/lib/filters";
import { ItemCard } from "@/components/ItemCard";
import { FilterBar } from "@/components/FilterBar";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const items = await getItems(filters);

  const left = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 === 1);

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
              {items.length} result{items.length === 1 ? "" : "s"} for “
              {filters.search}”
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
            <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2 md:gap-x-24 lg:gap-x-[160px]">
              <div className="flex flex-col gap-20 md:gap-28 lg:gap-40">
                {left.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
              <div className="flex flex-col gap-20 md:mt-40 md:gap-28 lg:mt-[254px] lg:gap-40">
                {right.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
