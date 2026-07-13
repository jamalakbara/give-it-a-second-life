"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const ADMIN_TABS = [
  { id: "items", label: "Items" },
  { id: "content", label: "Content" },
  { id: "seo", label: "SEO" },
] as const;

// Top-bar section switch for the seller studio. Drives the `?tab=` query the
// server page reads to pick a panel — so no client state is shared across the
// layout/page boundary.
export function AdminTabs() {
  const params = useSearchParams();
  const active = params.get("tab") ?? "items";

  return (
    <nav className="flex items-center justify-center gap-5 md:gap-7" aria-label="Admin sections">
      {ADMIN_TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.id === "items" ? "/admin" : `/admin?tab=${tab.id}`}
          className={`tracked text-[11px] transition-colors duration-200 hover:text-fg ${
            active === tab.id ? "text-fg" : "text-fg-muted"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
