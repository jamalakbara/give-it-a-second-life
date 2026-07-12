"use client";

import { useRef, useState } from "react";
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

interface CloudinarySignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
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
  // Number of files currently uploading — drives shimmer placeholder tiles.
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploading = uploadingCount > 0;

  function set(name: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Uploads each file directly to Cloudinary using a short-lived server
  // signature, appending secure URLs to imageUrls as they resolve.
  async function uploadFiles(files: File[]) {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (!images.length) return;
    setUploadingCount((count) => count + images.length);
    setUploadError("");

    try {
      const sigRes = await fetch("/api/upload", { method: "POST" });
      if (!sigRes.ok) {
        const data = await sigRes.json().catch(() => null);
        throw new Error(data?.error ?? "Upload not available");
      }
      const sig = (await sigRes.json()) as CloudinarySignature;

      for (const file of images) {
        const body = new FormData();
        body.append("file", file);
        body.append("api_key", sig.apiKey);
        body.append("timestamp", String(sig.timestamp));
        body.append("folder", sig.folder);
        body.append("signature", sig.signature);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
          { method: "POST", body },
        );
        if (!res.ok) throw new Error("Cloudinary upload failed");
        const data = (await res.json()) as { secure_url: string };
        setImageUrls((prev) => [...prev, data.secure_url]);
        setUploadingCount((count) => count - 1);
      }
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Failed to upload image",
      );
      setUploadingCount(0);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files?.length) void uploadFiles(Array.from(files));
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files?.length) void uploadFiles(Array.from(files));
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

        {(imageUrls.length > 0 || isUploading) && (
          <div className="mb-3">
            <SortableImageGrid
              urls={imageUrls}
              onReorder={setImageUrls}
              onRemove={(index) =>
                setImageUrls((prev) => prev.filter((_, i) => i !== index))
              }
            />
            {isUploading && (
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {Array.from({ length: uploadingCount }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-[6px] bg-glass ring-1 ring-hairline"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Awwwards-style dropzone: click to browse or drop files anywhere on it. */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
          disabled={isUploading}
          className={`group flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-glass px-6 py-8 text-center transition ${
            isDragActive
              ? "border-cream/60 bg-cream/5"
              : "border-hairline hover:border-fg-muted/50"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-glass text-[18px] text-fg-muted ring-1 ring-hairline transition group-hover:text-fg ${
              isDragActive ? "scale-110" : ""
            }`}
          >
            ↑
          </span>
          <span className="text-[13px] text-fg">
            {isUploading ? (
              "Uploading…"
            ) : (
              <>
                Drag images here or{" "}
                <span className="text-cream underline underline-offset-2">
                  browse
                </span>
              </>
            )}
          </span>
          <span className="tracked text-[9px] text-fg-faint">
            PNG, JPG · multiple allowed
          </span>
        </button>

        <input
          ref={fileInputRef}
          id="images"
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleInputChange}
        />
        {uploadError && (
          <p className="mt-2 text-[12px] text-aurora-rose">{uploadError}</p>
        )}
      </div>

      {isEdit && (
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isSold}
            onChange={(e) => setIsSold(e.target.checked)}
            className="h-4 w-4 accent-cream"
          />
          <span className="text-[13px] text-fg-muted">
            Mark as sold (hides it from the public catalog)
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
