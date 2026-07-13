"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Item } from "@/lib/types";
import { CATEGORY_LABELS, CONDITION_LABELS } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { CardMedia } from "@/components/CardMedia";

// Gucci-Beauty-style scattered carousel for the home "Latest arrivals" strip.
// A horizontal scroll-snap track: each card fans out (rotates + drops + shrinks +
// dims) the further its center sits from the track's viewport center. The centered
// card is upright, largest and brightest. All per-frame work is written straight to
// the DOM via CSS custom properties on rAF (same pattern as CardMedia) — React state
// only holds the active index, which drives the caption + progress dashes.

const MAX_ROTATE = 7; // deg — fanned tilt at the edges
const STAGGER = 22; // px — how far side cards drop below the centered one
const CARD_W = 280; // px — slide width (image is 3/4 → ~373px tall)
const SCALE_FALLOFF = 0.14; // side cards shrink toward 1 - this
const DIM_FALLOFF = 0.5; // side cards dim toward 1 - this (brightness)

export function ArrivalsCarousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const slideRefs = useRef<(HTMLLIElement | null)[]>([]);
  const frame = useRef<number | null>(null);
  // Default the focus to the middle item so the carousel opens centred on it.
  const initialActive = Math.floor(items.length / 2);
  const [active, setActive] = useState(initialActive);
  // Scatter is off until after mount so SSR/first paint is upright (no flash of a
  // wrong-state fan), and stays off entirely under prefers-reduced-motion.
  const [scatter, setScatter] = useState(false);

  const applyScatter = useCallback(() => {
    frame.current = null;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const half = rect.width / 2 || 1;

    let nearest = 0;
    let nearestDist = Infinity;

    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const box = slide.getBoundingClientRect();
      const slideCenter = box.left + box.width / 2;
      const d = Math.max(-1, Math.min(1, (slideCenter - center) / half));
      const abs = Math.abs(d);
      slide.style.setProperty("--rot", `${d * MAX_ROTATE}deg`);
      slide.style.setProperty("--ty", `${abs * STAGGER}px`);
      slide.style.setProperty("--scale", `${1 - abs * SCALE_FALLOFF}`);
      slide.style.setProperty("--dim", `${1 - abs * DIM_FALLOFF}`);
      slide.style.setProperty("--z", `${100 - Math.round(abs * 100)}`);
      if (abs < nearestDist) {
        nearestDist = abs;
        nearest = i;
      }
    });

    setActive((prev) => (prev === nearest ? prev : nearest));
  }, []);

  const onScroll = useCallback(() => {
    if (frame.current == null) {
      frame.current = requestAnimationFrame(applyScatter);
    }
  }, [applyScatter]);

  useEffect(() => {
    // Open centred on the middle slide (no smooth scroll — instant on mount).
    const track = trackRef.current;
    const mid = slideRefs.current[initialActive];
    if (track && mid) {
      track.scrollLeft =
        mid.offsetLeft - (track.clientWidth - mid.offsetWidth) / 2;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return; // keep the upright scroll row
    }
    setScatter(true);
    applyScatter();
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("resize", onScroll);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [applyScatter, onScroll]);

  function scrollTo(i: number) {
    slideRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  const activeItem = items[active];

  return (
    <div>
      <ul
        ref={trackRef}
        onScroll={onScroll}
        className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-10 pt-10 md:gap-10 md:pt-12"
        style={{
          // Peek: side padding centers the first/last card while middles bleed off.
          paddingInline: `max(1rem, calc((100% - ${CARD_W}px) / 2))`,
          // Fade the left/right edges so the peeking side cards dissolve into the
          // aurora instead of hard-clipping at the section edge.
          maskImage:
            "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        {items.map((item, i) => (
          <li
            key={item.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="flex-none snap-center"
            style={{
              width: CARD_W,
              zIndex: "var(--z, 1)" as unknown as number,
              transform: scatter
                ? "translateY(var(--ty, 0px)) rotate(var(--rot, 0deg)) scale(var(--scale, 1))"
                : undefined,
              filter: scatter ? "brightness(var(--dim, 1))" : undefined,
              transformOrigin: "center bottom",
              transition:
                "transform 0.6s cubic-bezier(0.22,1,0.36,1), filter 0.6s cubic-bezier(0.22,1,0.36,1)",
              willChange: "transform",
            }}
          >
            <CardMedia
              href={`/items/${item.id}`}
              cover={item.images[0]}
              title={item.title}
              itemId={item.id}
              isSold={item.isSold}
              blendEdges
              eager
            />
          </li>
        ))}
      </ul>

      {/* Active-card caption — single, centered (Gucci style) */}
      {activeItem && (
        <div className="mt-2 text-center">
          <p className="tracked text-[10px] text-fg-faint">
            {CATEGORY_LABELS[activeItem.category]}
          </p>
          <h3 className="mx-auto mt-2 max-w-md font-serif text-[24px] font-medium leading-tight text-fg">
            {activeItem.title}
          </h3>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="text-[15px] text-fg">
              {formatPrice(activeItem.price)}
            </span>
            <span className="glass tracked rounded-full px-2.5 py-1 text-[9px] text-fg-muted">
              {CONDITION_LABELS[activeItem.condition]}
            </span>
          </div>
        </div>
      )}

      {/* Progress dashes */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to ${item.title}`}
            aria-current={i === active}
            onClick={() => scrollTo(i)}
            className="h-[3px] rounded-full transition-all duration-300"
            style={{
              width: i === active ? 28 : 14,
              backgroundColor:
                i === active ? "#e0533d" : "var(--color-hairline)",
            }}
          />
        ))}
      </div>

      <p className="tracked mt-6 text-center text-[10px] text-fg-faint">
        Swipe to discover
      </p>
    </div>
  );
}
