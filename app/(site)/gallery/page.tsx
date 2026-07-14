import type { Metadata } from "next";
import { Suspense } from "react";
import { getItemCount, getItems } from "@/lib/data/items";
import { parseFilters } from "@/lib/filters";
import type { ItemFilters } from "@/lib/types";
import { canonical } from "@/lib/seo";
import { getContent } from "@/lib/data/siteContent";
import { FilterBar } from "@/components/FilterBar";
import { ItemGrid } from "@/components/ItemGrid";
import { ScrollIndicator } from "@/components/ScrollIndicator";

const PAGE_SIZE = 8;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent();
  const s = seo.gallery;
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: "/gallery" },
    openGraph: {
      title: `${s.title} | Give It a Second Life`,
      description: s.description,
      url: "/gallery",
      type: "website",
      ...(s.ogImage ? { images: [{ url: s.ogImage }] } : {}),
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Gallery | Give It a Second Life",
  description:
    "A curated gallery of preloved pieces — clothing, tech, homeware, accessories, and more.",
  url: canonical("/gallery"),
};

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

export default async function GalleryPage({
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — single serif line under a tiny eyebrow (full aurora shows through) */}
      <section className="relative flex min-h-[68vh] flex-col items-center justify-center px-6 text-center">
        <p className="tracked animate-rise text-[11px] text-fg-muted">
          Every piece, a second life
        </p>
        <h1 className="mt-6 max-w-5xl font-serif text-hero font-medium text-fg animate-rise">
          The collection.
        </h1>
        <ScrollIndicator />
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
