import { hasDatabase } from "@/lib/db";
import { mergeContent } from "@/lib/content/merge";
import type { ContentKey, SiteContent } from "@/lib/content/defaults";
import * as mock from "./siteContent.mock";
import * as neon from "./siteContent.neon";

// Single swap point (mirrors lib/data/items.ts): Neon when DATABASE_URL is set,
// otherwise the in-memory mock. Callers above this layer only see getContent /
// updateContent and never the raw override rows.
const adapter = hasDatabase ? neon : mock;

// Fully merged, typed site content (DB overrides on top of code defaults).
export async function getContent(): Promise<SiteContent> {
  const overrides = await adapter.getOverrides();
  return mergeContent(overrides);
}

// Persist a partial override blob for one content key (admin only).
export async function updateContent(
  key: ContentKey,
  value: unknown,
): Promise<void> {
  await adapter.saveOverride(key, value);
}
