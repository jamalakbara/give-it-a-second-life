import {
  CATEGORIES,
  CONDITIONS,
  type CreateItemInput,
  type UpdateItemInput,
} from "@/lib/types";

// Validates + normalizes an item payload shared by POST (create) and PATCH
// (update). Returns a clean CreateItemInput, or null when the payload is invalid.
export function parseItemInput(
  body: Partial<UpdateItemInput>,
): CreateItemInput | null {
  const price = Number(body.price);
  if (
    !body.title?.trim() ||
    !body.description?.trim() ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !CATEGORIES.includes(body.category as (typeof CATEGORIES)[number]) ||
    !CONDITIONS.includes(body.condition as (typeof CONDITIONS)[number])
  ) {
    return null;
  }

  return {
    title: body.title.trim(),
    description: body.description.trim(),
    price,
    category: body.category!,
    condition: body.condition!,
    size: body.size,
    color: body.color,
    material: body.material,
    imageUrls: (body.imageUrls ?? []).filter((url) => url.trim()),
  };
}
