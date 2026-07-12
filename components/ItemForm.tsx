"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  CONDITIONS,
  CONDITION_LABELS,
  type Item,
} from "@/lib/types";
import { Label, Select, TextArea, TextInput } from "@/components/form";
import { Button } from "@/components/Button";
import { SortableImageGrid } from "@/components/SortableImageGrid";
import { MediaPicker } from "@/components/MediaPicker";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  category: "clothing",
  condition: "good",
  size: "",
  color: "",
  material: "",
};

function formFromItem(item: Item): typeof emptyForm {
  return {
    title: item.title,
    description: item.description,
    price: String(item.price),
    category: item.category,
    condition: item.condition,
    size: item.size ?? "",
    color: item.color ?? "",
    material: item.material ?? "",
  };
}

// Create mode when `item` is undefined (POST), edit mode otherwise (PATCH).
// `onDone` lets a parent (e.g. AdminItemList) collapse the form after a save.
export function ItemForm({
  item,
  onDone,
  onCreated,
}: {
  item?: Item;
  onDone?: () => void;
  onCreated?: () => void;
}) {
  const isEdit = Boolean(item);
  const router = useRouter();
  const [form, setForm] = useState(item ? formFromItem(item) : emptyForm);
  const [imageUrls, setImageUrls] = useState<string[]>(
    item ? item.images.map((image) => image.url) : [],
  );
  const [isSold, setIsSold] = useState(item?.isSold ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function set(name: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Appends picked/uploaded URLs, skipping any already on the item.
  function addUrls(urls: string[]) {
    setImageUrls((prev) => [
      ...prev,
      ...urls.filter((url) => !prev.includes(url)),
    ]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        isEdit ? `/api/items/${item!.id}` : "/api/items",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": ADMIN_PASSWORD,
          },
          body: JSON.stringify({
            ...form,
            price: parseFloat(form.price),
            imageUrls: imageUrls.filter((url) => url.trim()),
            ...(isEdit ? { isSold } : {}),
          }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.error ?? (isEdit ? "Failed to update item" : "Failed to create item"),
        );
      }

      if (isEdit) {
        setSuccess("Changes saved.");
        router.refresh();
        onDone?.();
      } else {
        await res.json().catch(() => null);
        setSuccess(`"${form.title}" created successfully!`);
        setForm(emptyForm);
        setImageUrls([]);
        router.refresh();
        onCreated?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-[4px] border border-[#EF4444]/30 bg-[#EF4444]/5 p-4 text-[14px] text-[#EF4444]">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-[4px] border border-[#10B981]/30 bg-[#10B981]/5 p-4 text-[14px] text-[#10B981]">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Title *</Label>
          <TextInput
            id="title"
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g., Vintage Black Blazer"
          />
        </div>
        <div>
          <Label htmlFor="price">Price (Rp) *</Label>
          <TextInput
            id="price"
            type="number"
            required
            min={1}
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="450000"
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            id="category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="condition">Condition *</Label>
          <Select
            id="condition"
            value={form.condition}
            onChange={(e) => set("condition", e.target.value)}
          >
            {CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {CONDITION_LABELS[condition]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="size">Size</Label>
          <TextInput
            id="size"
            value={form.size}
            onChange={(e) => set("size", e.target.value)}
            placeholder="M / 42 / 30cm"
          />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <TextInput
            id="color"
            value={form.color}
            onChange={(e) => set("color", e.target.value)}
            placeholder="Black"
          />
        </div>
        <div>
          <Label htmlFor="material">Material</Label>
          <TextInput
            id="material"
            value={form.material}
            onChange={(e) => set("material", e.target.value)}
            placeholder="Wool"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <TextArea
          id="description"
          required
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe the item, condition, wear notes, styling tips..."
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <Label htmlFor="images">Images</Label>
          {imageUrls.length > 0 && (
            <span className="tracked text-[9px] text-fg-faint">
              Drag to reorder · first is the cover
            </span>
          )}
        </div>

        {imageUrls.length > 0 && (
          <div className="mb-3">
            <SortableImageGrid
              urls={imageUrls}
              onReorder={setImageUrls}
              onRemove={(index) =>
                setImageUrls((prev) => prev.filter((_, i) => i !== index))
              }
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-glass px-6 py-8 text-center transition hover:border-fg-muted/50"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-glass text-[18px] text-fg-muted ring-1 ring-hairline transition group-hover:text-fg">
            +
          </span>
          <span className="text-[13px] text-fg">
            Add images from{" "}
            <span className="text-cream underline underline-offset-2">
              gallery
            </span>{" "}
            or upload
          </span>
          <span className="tracked text-[9px] text-fg-faint">
            Reuse an uploaded photo or drop a new one
          </span>
        </button>

        {pickerOpen && (
          <MediaPicker
            onClose={() => setPickerOpen(false)}
            existing={imageUrls}
            onAdd={addUrls}
          />
        )}
      </div>

      {isEdit && (
        <label className="flex cursor-pointer items-center gap-3">
          <span className="relative flex h-[18px] w-[18px] items-center justify-center">
            <input
              type="checkbox"
              checked={isSold}
              onChange={(e) => setIsSold(e.target.checked)}
              className="peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-[5px] bg-glass ring-1 ring-hairline transition checked:bg-cream checked:ring-cream focus-visible:ring-2 focus-visible:ring-fg-muted"
            />
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="pointer-events-none absolute h-3 w-3 text-ink opacity-0 transition peer-checked:opacity-100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span className="text-[13px] text-fg-muted">
            Mark as sold (stays in the catalog with a “Sold out” tag)
          </span>
        </label>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save Changes"
              : "Create Item"}
        </Button>
        {isEdit && onDone && (
          <Button
            type="button"
            variant="secondary"
            onClick={onDone}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
