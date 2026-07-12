"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Item } from "@/lib/types";
import { useWishlist } from "@/hooks/useWishlist";
import { ItemCard } from "@/components/ItemCard";

export default function WishlistPage() {
  const { ids, remove } = useWishlist();
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/items")
      .then((res) => res.json())
      .then((all: Item[]) => {
        if (!cancelled) setItems(all);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Prune stale ids (sold/removed items no longer in the catalog) so the
  // navbar count stays in sync with what's actually shown here.
  useEffect(() => {
    if (!items) return;
    const live = new Set(items.map((item) => item.id));
    ids.filter((id) => !live.has(id)).forEach(remove);
  }, [items, ids, remove]);

  const saved = items?.filter((item) => ids.includes(item.id)) ?? null;

  return (
    <div className="veil min-h-[70vh] px-4 pb-24 pt-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1240px]">
        <p className="tracked text-[11px] text-fg-faint">Saved pieces</p>
        <h1 className="mt-4 font-serif text-h2 font-medium text-fg">
          My Wishlist
        </h1>

        {saved === null ? (
          <p className="mt-10 text-[14px] text-fg-muted">Loading…</p>
        ) : saved.length === 0 ? (
          <div className="py-28 text-center">
            <p className="font-serif text-h3 text-fg">
              Your wishlist is empty
            </p>
            <p className="mt-3 text-[14px] text-fg-muted">
              Tap the heart on any item to save it here.
            </p>
            <Link
              href="/"
              className="glass tracked mt-8 inline-block rounded-full px-6 py-3 text-[11px] text-fg transition hover:bg-glass-strong"
            >
              Browse the gallery
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
