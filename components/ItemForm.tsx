"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CATEGORY_LABELS, CONDITIONS, CONDITION_LABELS } from "@/lib/types";
import { Label, Select, TextArea, TextInput } from "@/components/form";
import { Button } from "@/components/Button";

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

interface CloudinarySignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

export function ItemForm() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function set(name: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setIsUploading(true);
    setUploadError("");

    try {
      const sigRes = await fetch("/api/upload", { method: "POST" });
      if (!sigRes.ok) {
        const data = await sigRes.json().catch(() => null);
        throw new Error(data?.error ?? "Upload not available");
      }
      const sig = (await sigRes.json()) as CloudinarySignature;

      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
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
        uploaded.push(data.secure_url);
      }
      setImageUrls((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          imageUrls: imageUrls.filter((url) => url.trim()),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to create item");
      }
      const data = await res.json();
      setSuccess(`Item #${data.itemId} created successfully!`);
      setForm(emptyForm);
      setImageUrls([]);
      router.refresh();
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
        <Label htmlFor="images">Images</Label>
        {imageUrls.length > 0 && (
          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {imageUrls.map((url, index) => (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-[4px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImageUrls((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-label={`Remove image ${index + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          disabled={isUploading}
          onChange={handleUpload}
          className="block w-full text-[13px] text-fg-muted file:mr-3 file:cursor-pointer file:rounded-[4px] file:border file:border-white/15 file:bg-white/5 file:px-3 file:py-1.5 file:text-fg hover:file:bg-white/10"
        />
        {isUploading && (
          <p className="mt-2 text-[12px] text-fg-faint">Uploading…</p>
        )}
        {uploadError && (
          <p className="mt-2 text-[12px] text-aurora-rose">{uploadError}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create Item"}
      </Button>
    </form>
  );
}
