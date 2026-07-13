import {
  CONTENT_KEYS,
  DEFAULT_CONTENT,
  type ContentKey,
  type SiteContent,
} from "./defaults";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

// Deep-merge `override` onto `base`: plain objects merge recursively, while
// arrays and primitives replace wholesale (so editing `missionBody` or `steps`
// swaps the whole list rather than element-merging). Unknown keys in override
// are ignored — `base` (the code default) defines the allowed shape.
function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : (override as T));
  }
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base)) {
    if (key in override) {
      result[key] = deepMerge((base as Record<string, unknown>)[key], override[key]);
    }
  }
  return result as T;
}

// Merge stored per-key overrides onto the code defaults into a fully typed
// SiteContent. `overrides` maps a content key ("home" | "about" | ...) to the
// partial JSON blob stored for it.
export function mergeContent(
  overrides: Partial<Record<ContentKey, unknown>>,
): SiteContent {
  const merged = { ...DEFAULT_CONTENT } as SiteContent;
  for (const key of CONTENT_KEYS) {
    if (overrides[key] !== undefined) {
      (merged as Record<string, unknown>)[key] = deepMerge(
        DEFAULT_CONTENT[key],
        overrides[key],
      );
    }
  }
  return merged;
}
