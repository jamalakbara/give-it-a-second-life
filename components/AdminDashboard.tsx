"use client";

import { useState } from "react";
import { ItemForm } from "@/components/ItemForm";
import { AdminItemList } from "@/components/AdminItemList";

// Interactive body of the /admin page. Kept as a client child so the server
// page can stay a pure Clerk auth guard. `refreshToken` bumps after a create so
// the list below reloads.
export function AdminDashboard() {
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <>
      <div className="glass rounded-3xl p-8">
        <ItemForm onCreated={() => setRefreshToken((n) => n + 1)} />
      </div>
      <p className="mt-4 text-[12px] text-fg-faint">
        Items persist to Neon Postgres when DATABASE_URL is set; otherwise they
        use the in-memory mock and reset on server restart. Image uploads require
        Cloudinary env vars.
      </p>
      <AdminItemList refreshToken={refreshToken} />
    </>
  );
}
