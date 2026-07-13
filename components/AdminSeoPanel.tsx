"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label, TextArea, TextInput } from "@/components/form";
import { Button } from "@/components/Button";
import { MediaPicker } from "@/components/MediaPicker";
import { SmoothImage } from "@/components/SmoothImage";
import type { PageSeo, SeoContent, SiteContent } from "@/lib/content/defaults";

type SeoPage = keyof SeoContent;

const PAGES: { id: SeoPage; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About" },
];

// Per-page SEO editor: title, meta description, and an Open Graph image. The
// merged SEO object is loaded once; each page's block saves back under the "seo"
// content key, which the pages' generateMetadata reads (falling back to
// lib/seo.ts defaults).
export function AdminSeoPanel() {
  const router = useRouter();
  const [seo, setSeo] = useState<SeoContent | null>(null);
  const [page, setPage] = useState<SeoPage>("home");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/site-content")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((data: SiteContent) => setSeo(data.seo))
      .catch((err) => setError(err.message));
  }, []);

  function set(key: keyof PageSeo, value: string) {
    setSeo((prev) =>
      prev ? { ...prev, [page]: { ...prev[page], [key]: value } } : prev,
    );
    setSuccess("");
  }

  async function save() {
    if (!seo) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/site-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "seo", value: seo }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to save");
      }
      setSuccess("Saved. Metadata updates on the next page load.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  if (!seo) {
    return <p className="text-[13px] text-fg-faint">{error || "Loading SEO…"}</p>;
  }

  const current = seo[page];

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPage(p.id);
              setSuccess("");
              setError("");
            }}
            className={`tracked rounded-full px-4 py-2 text-[10px] transition ${
              page === p.id
                ? "bg-cream text-void"
                : "bg-glass text-fg-muted ring-1 ring-hairline hover:text-fg"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

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

      <div className="glass space-y-5 rounded-3xl p-8">
        <div>
          <Label>Meta title</Label>
          <TextInput value={current.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <Label>Meta description</Label>
          <TextArea
            rows={3}
            value={current.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
        <div>
          <Label>Open Graph image</Label>

          {current.ogImage && (
            <div className="group relative mb-3 aspect-[1200/630] w-full max-w-xs overflow-hidden rounded-[6px] ring-1 ring-hairline">
              <SmoothImage
                src={current.ogImage}
                alt="Open Graph preview"
                sizes="320px"
              />
              <button
                type="button"
                onClick={() => set("ogImage", "")}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-[12px] text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-accent/80 group-hover:opacity-100"
                aria-label="Remove Open Graph image"
              >
                ✕
              </button>
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
              {current.ogImage ? "Replace image from " : "Add image from "}
              <span className="text-cream underline underline-offset-2">gallery</span> or upload
            </span>
            <span className="tracked text-[9px] text-fg-faint">
              Reuse an uploaded photo or drop a new one
            </span>
          </button>
        </div>
      </div>

      {pickerOpen && (
        <MediaPicker
          onClose={() => setPickerOpen(false)}
          existing={current.ogImage ? [current.ogImage] : []}
          onAdd={(urls) => {
            if (urls[0]) set("ogImage", urls[0]);
            setPickerOpen(false);
          }}
        />
      )}

      <Button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
