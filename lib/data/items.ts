import { hasDatabase } from "@/lib/db";
import * as mock from "./items.mock";
import * as neon from "./items.neon";

// Single swap point: use Neon when DATABASE_URL is configured, otherwise the
// in-memory mock. Everything above this layer imports from here and is unaware
// of which adapter is live.
const adapter = hasDatabase ? neon : mock;

export const getItems = adapter.getItems;
export const getItem = adapter.getItem;
export const createItem = adapter.createItem;
