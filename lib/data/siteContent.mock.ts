import type { ContentKey } from "@/lib/content/defaults";

// In-memory override store standing in for the site_content table until a DB is
// configured. Survives HMR in dev; resets on server restart (mock only).
const globalStore = globalThis as unknown as {
  __siteContent?: Partial<Record<ContentKey, unknown>>;
};
globalStore.__siteContent ??= {};
const overrides = globalStore.__siteContent;

export async function getOverrides(): Promise<
  Partial<Record<ContentKey, unknown>>
> {
  return { ...overrides };
}

export async function saveOverride(
  key: ContentKey,
  value: unknown,
): Promise<void> {
  overrides[key] = value;
}
