import { NextResponse } from "next/server";
import { reorderItems } from "@/lib/data/items";
import { isAuthorized } from "@/lib/adminAuth";
import type { ReorderInput } from "@/lib/types";

// PATCH /api/items/reorder — admin-only. Persists a new catalog order.
// Body: { orderedIds: number[] } — full list of item ids, index 0 shown first.
export async function PATCH(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Partial<ReorderInput>;
    const orderedIds = body.orderedIds;
    if (
      !Array.isArray(orderedIds) ||
      !orderedIds.every((id) => Number.isInteger(id))
    ) {
      return NextResponse.json(
        { error: "orderedIds must be an array of item ids" },
        { status: 400 },
      );
    }

    await reorderItems(orderedIds);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to reorder items" },
      { status: 500 },
    );
  }
}
