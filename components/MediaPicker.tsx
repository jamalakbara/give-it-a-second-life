"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { SmoothImage } from "@/components/SmoothImage";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

interface CloudinarySignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

interface MediaImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

type Tab = "gallery" | "upload";

// Modal picker for the admin item form. Two tabs: reuse an image already uploaded
// to Cloudinary (Gallery) or upload new files (Upload). Selected/uploaded URLs are
// handed back via `onAdd`; the parent owns dedup and ordering. Mounted only while
// open (parent gates with `{pickerOpen && ...}`), so state is fresh each open.
export function MediaPicker({
  onClose,
  existing,
  onAdd,
}: {
  onClose: () => void;
  existing: string[];
  onAdd: (urls: string[]) => void;
}) {
  const [tab, setTab] = useState<Tab>("gallery");

  // Gallery state.
  const [images, setImages] = useState<MediaImage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  // Upload state.
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUploading = uploadingCount > 0;

  const existingSet = new Set(existing);

  const loadGallery = useCallback(
    async (cursor: string | null, replace: boolean) => {
      setGalleryLoading(true);
      setGalleryError("");
      try {
        const res = await fetch(
          `/api/media${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`,
          { headers: { "x-admin-password": ADMIN_PASSWORD } },
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? "Failed to load gallery");
        }
        const data = (await res.json()) as {
          images: MediaImage[];
          nextCursor: string | null;
        };
        setImages((prev) => (replace ? data.images : [...prev, ...data.images]));
        setNextCursor(data.nextCursor);
      } catch (err) {
        setGalleryError(
          err instanceof Error ? err.message : "Failed to load gallery",
        );
      } finally {
        setGalleryLoading(false);
      }
    },
    [],
  );

  // Esc to close + scroll lock while mounted.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Fetch the gallery once on mount (data-fetch effect — the loading flag it sets
  // is the intended side effect, not a cascading render).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadGallery(null, true);
  }, [loadGallery]);

  function toggleSelect(url: string) {
    if (existingSet.has(url)) return;
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    );
  }

  function confirmSelection() {
    if (selected.length) onAdd(selected);
    onClose();
  }

  // Uploads each file directly to Cloudinary using a short-lived server
  // signature, adding secure URLs to the item as they resolve.
  async function uploadFiles(files: File[]) {
    const pics = files.filter((file) => file.type.startsWith("image/"));
    if (!pics.length) return;
    setUploadingCount((count) => count + pics.length);
    setUploadError("");

    try {
      const sigRes = await fetch("/api/upload", { method: "POST" });
      if (!sigRes.ok) {
        const data = await sigRes.json().catch(() => null);
        throw new Error(data?.error ?? "Upload not available");
      }
      const sig = (await sigRes.json()) as CloudinarySignature;

      for (const file of pics) {
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
        onAdd([data.secure_url]);
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

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-void/80 p-4 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Add images"
      onClick={onClose}
    >
      <div
        className="glass flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[12px] ring-1 ring-hairline"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header + tabs */}
        <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
          <div className="flex gap-1 rounded-full bg-glass p-1 ring-1 ring-hairline">
            {(["gallery", "upload"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`tracked cursor-pointer rounded-full px-4 py-1.5 text-[11px] uppercase transition ${
                  tab === t
                    ? "bg-cream text-void"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {t === "gallery" ? "Gallery" : "Upload"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-fg-muted transition hover:bg-glass hover:text-fg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "gallery" ? (
            <>
              {galleryError && (
                <p className="mb-3 text-[12px] text-accent">
                  {galleryError}
                </p>
              )}
              {images.length === 0 && galleryLoading && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="skeleton aspect-square rounded-[6px]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}
              {images.length === 0 && !galleryLoading && !galleryError && (
                <p className="py-10 text-center text-[13px] text-fg-muted">
                  No uploaded images yet. Switch to Upload to add some.
                </p>
              )}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {images.map((img) => {
                    const added = existingSet.has(img.url);
                    const isSelected = selected.includes(img.url);
                    return (
                      <button
                        key={img.publicId}
                        type="button"
                        onClick={() => toggleSelect(img.url)}
                        disabled={added}
                        aria-pressed={isSelected}
                        className={`group relative aspect-square overflow-hidden rounded-[6px] ring-1 transition ${
                          isSelected
                            ? "ring-2 ring-cream"
                            : "ring-hairline hover:ring-fg-muted"
                        } ${added ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                      >
                        <SmoothImage
                          src={img.url}
                          alt=""
                          sizes="(max-width: 640px) 33vw, 160px"
                          draggable={false}
                        />
                        {(isSelected || added) && (
                          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cream text-[11px] font-medium text-void">
                            {added ? "✓" : "✓"}
                          </span>
                        )}
                        {added && (
                          <span className="tracked pointer-events-none absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[8px] text-white backdrop-blur-sm">
                            Added
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              {nextCursor && (
                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={galleryLoading}
                    onClick={() => void loadGallery(nextCursor, false)}
                  >
                    {galleryLoading ? "Loading…" : "Load more"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Dropzone: click to browse or drop files anywhere on it. */}
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
                className={`group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-glass px-6 py-10 text-center transition ${
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
                  PNG, JPG · multiple allowed · added instantly
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleInputChange}
              />

              {isUploading && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {Array.from({ length: uploadingCount }).map((_, i) => (
                    <div
                      key={i}
                      className="flex aspect-square animate-pulse items-center justify-center rounded-[6px] bg-glass ring-1 ring-hairline"
                    >
                      <span
                        className="h-6 w-6 animate-spin rounded-full border-2 border-fg-faint/30 border-t-fg-muted"
                        aria-label="Uploading image"
                      />
                    </div>
                  ))}
                </div>
              )}

              {uploadError && (
                <p className="mt-2 text-[12px] text-accent">{uploadError}</p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-hairline px-5 py-3">
          <span className="text-[12px] text-fg-muted">
            {tab === "gallery"
              ? selected.length
                ? `${selected.length} selected`
                : "Tap images to select"
              : "New uploads are added automatically"}
          </span>
          {tab === "gallery" ? (
            <Button
              type="button"
              disabled={!selected.length}
              onClick={confirmSelection}
            >
              {selected.length ? `Add ${selected.length} image${selected.length > 1 ? "s" : ""}` : "Add images"}
            </Button>
          ) : (
            <Button type="button" variant="secondary" onClick={onClose}>
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
