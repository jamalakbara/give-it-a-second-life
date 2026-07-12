import { NextResponse } from "next/server";
import { createItem, getAllItems, getItems } from "@/lib/data/items";
import { parseFilters } from "@/lib/filters";
import { isAuthorized } from "@/lib/adminAuth";
import { parseItemInput } from "@/lib/validateItem";
import type { UpdateItemInput } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filters = parseFilters(Object.fromEntries(searchParams.entries()));
  // Admin management view lists sold items too; public catalog does not.
  const items =
    searchParams.get("includeSold") === "true"
      ? await getAllItems(filters)
      : await getItems(filters);
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Partial<UpdateItemInput>;
    const input = parseItemInput(body);
    if (!input) {
      return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
    }

    const item = await createItem(input);
    return NextResponse.json({ success: true, itemId: item.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 },
    );
  }
}
