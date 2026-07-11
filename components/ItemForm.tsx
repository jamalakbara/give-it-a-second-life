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

export function ItemForm() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [imageUrls, setImageUrls] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function set(name: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
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
      setImageUrls([""]);
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
        <Label>Image URLs (Cloudinary or any https image)</Label>
        <div className="space-y-2">
          {imageUrls.map((url, index) => (
            <TextInput
              key={index}
              type="url"
              value={url}
              onChange={(e) =>
                setImageUrls((prev) =>
                  prev.map((v, i) => (i === index ? e.target.value : v)),
                )
              }
              placeholder={`Image URL ${index + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setImageUrls((prev) => [...prev, ""])}
          className="mt-2 text-[13px] text-fg-muted cursor-pointer transition-colors duration-200 hover:text-fg"
        >
          + Add another image
        </button>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create Item"}
      </Button>
    </form>
  );
}
