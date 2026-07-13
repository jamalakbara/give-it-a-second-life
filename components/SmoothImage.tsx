"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  eager = false,
  draggable,
  objectFit = "cover",
  viewTransitionName,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  // Load immediately (no lazy defer) without the preload of `priority` — for
  // off-screen-but-imminent images like carousel slides the user will swipe to.
  eager?: boolean;
  draggable?: boolean;
  objectFit?: "cover" | "contain";
  // Names the <img> for a shared-element page transition (morph). The same name
  // on a card cover and the item hero makes the browser tween between them.
  viewTransitionName?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const skelRef = useRef<HTMLDivElement>(null);

  // Eager/cached images can finish loading before React attaches `onLoad`
  // (the load event fires during the SSR→hydration gap), leaving `loaded`
  // stuck false and the image invisible. On mount, look up the sibling <img>
  // (next/image doesn't reliably forward a ref here) and catch the
  // already-complete case.
  useEffect(() => {
    const img = skelRef.current?.parentElement?.querySelector("img");
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    const onDone = () => setLoaded(true);
    img.addEventListener("load", onDone);
    return () => img.removeEventListener("load", onDone);
  }, []);

  return (
    <>
      {!loaded && (
        <div
          ref={skelRef}
          className="skeleton absolute inset-0"
          aria-hidden="true"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={!priority && eager ? "eager" : undefined}
        draggable={draggable}
        onLoad={() => setLoaded(true)}
        style={viewTransitionName ? { viewTransitionName } : undefined}
        className={`${
          objectFit === "contain" ? "object-contain" : "object-cover"
        } transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </>
  );
}
