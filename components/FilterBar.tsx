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
    <div className="mb-10 flex flex-col gap-3">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Chip
            key={category}
            active={selectedCategories.includes(category)}
            onClick={() => toggleList("category", category)}
          >
            {CATEGORY_LABELS[category]}
          </Chip>
        ))}
      </div>

      {/* Controls row: condition left, sort right */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowConditions((v) => !v)}
          className="glass tracked cursor-pointer rounded-full px-3.5 py-1.5 text-[10px] text-fg-muted transition-colors hover:text-fg"
        >
          Condition {selectedConditions.length ? `(${selectedConditions.length})` : ""}
        </button>

        {hasFilters && (
          <Link
            href={pathname}
            className="tracked text-[10px] text-fg-faint underline-offset-4 transition-colors hover:text-fg hover:underline"
          >
            Clear
          </Link>
        )}

        <div className="glass ml-auto flex cursor-pointer items-center rounded-full py-1.5 pl-3.5 pr-3">
          <select
            value={sort}
            onChange={(e) =>
              update((params) => {
                if (e.target.value === "newest") params.delete("sort");
                else params.set("sort", e.target.value);
              })
            }
            aria-label="Sort"
            className="tracked cursor-pointer appearance-none bg-transparent text-[10px] text-fg-muted outline-none"
          >
            <option value="newest" className="bg-ink text-fg">Newest</option>
            <option value="price-asc" className="bg-ink text-fg">Price ↑</option>
            <option value="price-desc" className="bg-ink text-fg">Price ↓</option>
          </select>
          <svg className="ml-2 size-3 shrink-0 text-fg-muted" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
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
