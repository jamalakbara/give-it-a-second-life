"use client";

import { useState, useSyncExternalStore } from "react";
import { ItemForm } from "@/components/ItemForm";
import { AdminItemList } from "@/components/AdminItemList";
import { Label, TextInput } from "@/components/form";
import { Button } from "@/components/Button";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

const authListeners = new Set<() => void>();

function subscribeAuth(fn: () => void) {
  authListeners.add(fn);
  return () => authListeners.delete(fn);
}

function setAuth(value: boolean) {
  if (value) sessionStorage.setItem("adminAuthenticated", "true");
  else sessionStorage.removeItem("adminAuthenticated");
  authListeners.forEach((fn) => fn());
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);
  const isAuthenticated = useSyncExternalStore(
    subscribeAuth,
    () => sessionStorage.getItem("adminAuthenticated") === "true",
    () => false,
  );

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
      setError("");
      setAuth(true);
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-6 pt-24">
        <div className="glass w-full max-w-md rounded-3xl p-8">
          <p className="tracked text-[10px] text-fg-faint">Seller access</p>
          <h1 className="mt-3 font-serif text-h3 font-medium text-fg">
            Admin Access
          </h1>
          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <div>
              <Label htmlFor="password">Admin Password</Label>
              <TextInput
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            {error && <p className="text-[12px] text-aurora-rose">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="veil px-4 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="tracked text-[10px] text-fg-faint">Seller studio</p>
            <h1 className="mt-3 font-serif text-h2 font-medium text-fg">
              Manage Items
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setAuth(false)}
            className="tracked cursor-pointer text-[10px] text-fg-faint transition-colors hover:text-fg"
          >
            Logout
          </button>
        </div>
        <div className="glass rounded-3xl p-8">
          <ItemForm onCreated={() => setRefreshToken((n) => n + 1)} />
        </div>
        <p className="mt-4 text-[12px] text-fg-faint">
          Items persist to Neon Postgres when DATABASE_URL is set; otherwise
          they use the in-memory mock and reset on server restart. Image uploads
          require Cloudinary env vars.
        </p>
        <AdminItemList refreshToken={refreshToken} />
      </div>
    </div>
  );
}
