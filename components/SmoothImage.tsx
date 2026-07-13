"use client";

import Image from "next/image";
import { useState } from "react";

// Standard image primitive for the site: renders a `next/image` in `fill`
// mode with the shared `.skeleton` shimmer (app/globals.css) shown while the
// image decodes, then cross-fades the loaded image in. Non-`priority` images
// keep next/image's native lazy-loading for free.
//
// The caller owns the positioned/rounded/ring container — SmoothImage returns
// a fragment (skeleton sibling + Image). DOM order matters: the skeleton is
// rendered first and the Image second, so the loaded (opaque) Image paints on
// top of the skeleton without any z-index bookkeeping.
export function SmoothImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  draggable,
  objectFit = "cover",
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  draggable?: boolean;
  objectFit?: "cover" | "contain";
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="skeleton absolute inset-0" aria-hidden="true" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        draggable={draggable}
        onLoad={() => setLoaded(true)}
        className={`${
          objectFit === "contain" ? "object-contain" : "object-cover"
        } transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </>
  );
}
