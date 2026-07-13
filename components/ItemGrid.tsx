"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Item } from "@/lib/types";
import { ItemCard } from "@/components/ItemCard";

// Skeleton placeholder that mirrors an ItemCard's footprint (3:4 media box +
// two text lines) so appending the next batch never shifts layout. Reuses the
// shared `.skeleton` shimmer from app/globals.css.
function CardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="skeleton aspect-[3/4] rounded-[6px]" />
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
      </div>
    </div>
  );
}

// Client-side infinite-scroll grid. Seeds from the server-rendered first batch,
// then appends more via /api/items (limit/offset) as a sentinel scrolls into
// view. Remounted via `key` in the page whenever filters/sort change, so state
// resets without an internal filter-diff effect.
export function ItemGrid({
  initialItems,
  query,
  pageSize,
  initialHasMore,
}: {
  initialItems: Item[];
  query: string;
  pageSize: number;
  initialHasMore: boolean;
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Guards against overlapping fetches when the observer fires rapidly.
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const qs = new URLSearchParams(query);
      qs.set("limit", String(pageSize));
      qs.set("offset", String(items.length));
      const res = await fetch(`/api/items?${qs.toString()}`);
      if (!res.ok) throw new Error(`Failed to load items: ${res.status}`);
      const batch = (await res.json()) as Item[];
      setItems((prev) => [...prev, ...batch]);
      setHasMore(batch.length === pageSize);
    } catch {
      // Stop trying on error; the already-loaded items stay visible.
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, items.length, pageSize, query]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      // Prefetch a bit before the sentinel is fully visible.
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  const left = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 === 1);

  // Split loading skeletons across the two columns (rounded up for odd sizes).
  const skeletonCount = loading ? pageSize : 0;
  const leftSkeletons = Math.ceil(skeletonCount / 2);
  const rightSkeletons = Math.floor(skeletonCount / 2);

  return (
    <>
      <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2 md:gap-x-24 lg:gap-x-[160px]">
        <div className="flex flex-col gap-20 md:gap-28 lg:gap-40">
          {left.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
          {Array.from({ length: leftSkeletons }).map((_, i) => (
            <CardSkeleton key={`sk-l-${i}`} />
          ))}
        </div>
        <div className="flex flex-col gap-20 md:mt-40 md:gap-28 lg:mt-[254px] lg:gap-40">
          {right.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
          {Array.from({ length: rightSkeletons }).map((_, i) => (
            <CardSkeleton key={`sk-r-${i}`} />
          ))}
        </div>
      </div>

      {/* Sentinel — observed to trigger the next batch. */}
      {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
    </>
  );
}
