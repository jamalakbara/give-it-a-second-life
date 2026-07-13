"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  CONDITIONS,
  CONDITION_LABELS,
} from "@/lib/types";

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tracked cursor-pointer rounded-full px-3.5 py-1.5 text-[10px] transition-colors duration-200 ${
        active
          ? "bg-cream text-void"
          : "glass text-fg-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function toggleValue(current: string | null, value: string): string[] {
  const values = current ? current.split(",") : [];
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
}

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showConditions, setShowConditions] = useState(false);

  const selectedCategories = searchParams.get("category")?.split(",") ?? [];
  const selectedConditions = searchParams.get("condition")?.split(",") ?? [];
  const sort = searchParams.get("sort") ?? "newest";
  const hasFilters =
    ["category", "condition", "minPrice", "maxPrice", "q"].some((k) =>
      searchParams.has(k),
    ) || (searchParams.has("sort") && sort !== "newest");

  function update(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function toggleList(key: "category" | "condition", value: string) {
    update((params) => {
      const next = toggleValue(params.get(key), value);
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);
    });
  }

  return (
    <div className="mb-10 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((category) => (
          <Chip
            key={category}
            active={selectedCategories.includes(category)}
            onClick={() => toggleList("category", category)}
          >
            {CATEGORY_LABELS[category]}
          </Chip>
        ))}

        <span className="mx-1 hidden h-4 w-px bg-hairline sm:block" />

        <button
          type="button"
          onClick={() => setShowConditions((v) => !v)}
          className="glass tracked cursor-pointer rounded-full px-3.5 py-1.5 text-[10px] text-fg-muted transition-colors hover:text-fg"
        >
          Condition {selectedConditions.length ? `(${selectedConditions.length})` : ""}
        </button>

        <select
          value={sort}
          onChange={(e) =>
            update((params) => {
              if (e.target.value === "newest") params.delete("sort");
              else params.set("sort", e.target.value);
            })
          }
          aria-label="Sort"
          className="glass tracked ml-auto cursor-pointer rounded-full px-3.5 py-1.5 text-[10px] text-fg-muted outline-none"
        >
          <option value="newest" className="bg-ink text-fg">Newest</option>
          <option value="price-asc" className="bg-ink text-fg">Price ↑</option>
          <option value="price-desc" className="bg-ink text-fg">Price ↓</option>
        </select>

        {hasFilters && (
          <Link
            href={pathname}
            className="tracked text-[10px] text-fg-faint underline-offset-4 transition-colors hover:text-fg hover:underline"
          >
            Clear
          </Link>
        )}
      </div>

      {showConditions && (
        <div className="flex flex-wrap items-center gap-2">
          {CONDITIONS.map((condition) => (
            <Chip
              key={condition}
              active={selectedConditions.includes(condition)}
              onClick={() => toggleList("condition", condition)}
            >
              {CONDITION_LABELS[condition]}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
