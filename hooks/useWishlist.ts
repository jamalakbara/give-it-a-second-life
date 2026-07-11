"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "preloved-wishlist";
const EMPTY: number[] = [];

let cache: number[] = EMPTY;
let cacheRaw: string | null = null;
const listeners = new Set<() => void>();

function read(): number[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    cache = Array.isArray(parsed) ? parsed.filter((v) => Number.isInteger(v)) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  // Sync across tabs too.
  window.addEventListener("storage", fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", fn);
  };
}

export function useWishlist() {
  // Server snapshot is always empty — avoids hydration mismatch; the real
  // list appears right after mount.
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);

  return {
    ids,
    count: ids.length,
    has: (id: number) => ids.includes(id),
    toggle: (id: number) => {
      const current = read();
      write(
        current.includes(id)
          ? current.filter((v) => v !== id)
          : [...current, id],
      );
    },
    remove: (id: number) => {
      write(read().filter((v) => v !== id));
    },
  };
}
