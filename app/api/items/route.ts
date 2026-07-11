import { NextResponse } from "next/server";
import { createItem, getItems } from "@/lib/data/items";
import { parseFilters } from "@/lib/filters";
import { CATEGORIES, CONDITIONS, type CreateItemInput } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filters = parseFilters(Object.fromEntries(searchParams.entries()));
  const items = await getItems(filters);
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateItemInput>;

    const price = Number(body.price);
    if (
      !body.title?.trim() ||
      !body.description?.trim() ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !CATEGORIES.includes(body.category as (typeof CATEGORIES)[number]) ||
      !CONDITIONS.includes(body.condition as (typeof CONDITIONS)[number])
    ) {
      return NextResponse.json(
        { error: "Invalid item data" },
        { status: 400 },
      );
    }

    const item = await createItem({
      title: body.title.trim(),
      description: body.description.trim(),
      price,
      category: body.category!,
      condition: body.condition!,
      size: body.size,
      color: body.color,
      material: body.material,
      imageUrls: (body.imageUrls ?? []).filter((url) => url.trim()),
    });

    return NextResponse.json({ success: true, itemId: item.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 },
    );
  }
}
