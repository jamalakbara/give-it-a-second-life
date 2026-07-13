"use client";

import { useState } from "react";
import { ItemForm } from "@/components/ItemForm";
import { AdminItemList } from "@/components/AdminItemList";
import { AdminContentPanel } from "@/components/AdminContentPanel";
import { AdminSeoPanel } from "@/components/AdminSeoPanel";

const HEADINGS: Record<string, string> = {
  items: "Manage Items",
  content: "Site Content",
  seo: "SEO & Sharing",
};

// Interactive body of the /admin page. The active section comes from the `tab`
// query param (set by the top-bar AdminTabs); the server page reads it and
// passes it down so no client state crosses the layout/page boundary.
export function AdminDashboard({ tab }: { tab: string }) {
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <div>
      <div className="mb-8">
        <p className="tracked text-[10px] text-fg-faint">Seller studio</p>
        <h1 className="mt-3 font-serif text-h2 font-medium text-fg">
          {HEADINGS[tab] ?? HEADINGS.items}
        </h1>
      </div>

      {tab === "content" ? (
        <AdminContentPanel />
      ) : tab === "seo" ? (
        <AdminSeoPanel />
      ) : (
        <>
          <div className="glass rounded-3xl p-8">
            <ItemForm onCreated={() => setRefreshToken((n) => n + 1)} />
          </div>
          <p className="mt-4 text-[12px] text-fg-faint">
            Items persist to Neon Postgres when DATABASE_URL is set; otherwise
            they use the in-memory mock and reset on server restart. Image
            uploads require Cloudinary env vars.
          </p>
          <AdminItemList refreshToken={refreshToken} />
        </>
      )}
    </div>
  );
}
