"use client";

import Image from "next/image";
import { useState } from "react";
import type { ItemImage } from "@/lib/types";

export function ImageGallery({ images }: { images: ItemImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-glass ring-1 ring-hairline">
        {active && (
          <Image
            src={active.url}
            alt={active.alt}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 55vw"
            className="object-cover"
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              className={`relative size-[76px] overflow-hidden rounded-[6px] ring-1 transition ${
                index === activeIndex
                  ? "ring-2 ring-cream"
                  : "ring-hairline hover:ring-fg-muted"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="76px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
