"use client";

import { useCallback, useEffect, useState } from "react";
import type { ItemImage } from "@/lib/types";
import { SmoothImage } from "@/components/SmoothImage";

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={dir === "left" ? "-ml-0.5" : "-mr-0.5"}
    >
      <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const arrowClasses =
  "glass grid size-10 place-items-center rounded-full text-fg backdrop-blur transition hover:text-cream hover:ring-1 hover:ring-cream";

export function ImageGallery({
  images,
  itemId,
}: {
  images: ItemImage[];
  // Matches the card cover's `view-transition-name` so navigating from the
  // gallery/carousel morphs that thumbnail into this hero image.
  itemId: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = images.length;
  const active = images[activeIndex] ?? images[0];
  const hasMultiple = total > 1;

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  // Keyboard nav + scroll lock while the lightbox is open.
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      else if (event.key === "ArrowLeft" && hasMultiple) goPrev();
      else if (event.key === "ArrowRight" && hasMultiple) goNext();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, hasMultiple, goPrev, goNext]);

  if (!active) return null;

  return (
    <div>
      <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-glass ring-1 ring-hairline">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open full-screen preview"
          className="absolute inset-0 z-20 cursor-zoom-in"
        >
          <SmoothImage
            key={active.url}
            src={active.url}
            alt={active.alt}
            priority
            sizes="(max-width: 767px) 100vw, 55vw"
            // Only the first (cover) image morphs from the card; once the user
            // browses to another image the name simply rides along.
            viewTransitionName={activeIndex === 0 ? `item-${itemId}` : undefined}
          />
        </button>
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className={`absolute left-3 top-1/2 z-30 -translate-y-1/2 ${arrowClasses}`}
            >
              <ChevronIcon dir="left" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className={`absolute right-3 top-1/2 z-30 -translate-y-1/2 ${arrowClasses}`}
            >
              <ChevronIcon dir="right" />
            </button>
          </>
        )}
      </div>
      {hasMultiple && (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show image ${index + 1}`}
              className={`relative size-[76px] cursor-pointer overflow-hidden rounded-[6px] ring-1 transition ${
                index === activeIndex
                  ? "ring-2 ring-cream"
                  : "ring-hairline hover:ring-fg-muted"
              }`}
            >
              <SmoothImage
                src={image.url}
                alt={image.alt}
                sizes="76px"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-void/80 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close preview"
            className={`absolute right-4 top-4 z-20 ${arrowClasses}`}
          >
            <CloseIcon />
          </button>

          <div
            className="relative flex flex-1 items-center justify-center px-4 py-16 md:px-20"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-full w-full max-w-[1100px]">
              <SmoothImage
                key={active.url}
                src={active.url}
                alt={active.alt}
                sizes="90vw"
                objectFit="contain"
              />
            </div>

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous image"
                  className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 md:left-8 ${arrowClasses}`}
                >
                  <ChevronIcon dir="left" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  className={`absolute right-4 top-1/2 z-10 -translate-y-1/2 md:right-8 ${arrowClasses}`}
                >
                  <ChevronIcon dir="right" />
                </button>
              </>
            )}
          </div>

          {hasMultiple && (
            <div
              className="flex flex-wrap justify-center gap-2.5 px-4 pb-8"
              onClick={(event) => event.stopPropagation()}
            >
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`relative size-[64px] cursor-pointer overflow-hidden rounded-[6px] ring-1 transition ${
                    index === activeIndex
                      ? "ring-2 ring-cream"
                      : "ring-hairline hover:ring-fg-muted"
                  }`}
                >
                  <SmoothImage
                    src={image.url}
                    alt={image.alt}
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
