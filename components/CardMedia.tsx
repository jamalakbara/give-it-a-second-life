"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ItemImage } from "@/lib/types";
import { SmoothImage } from "@/components/SmoothImage";
import { WishlistButton } from "@/components/WishlistButton";

// Matches jackwatkins.co/works card hover:
//  1. cursor-driven 3D tilt — the point under the pointer rotates away
//     ("pushed back"), the far side lifts (perspective 800px, eased 0.6s)
//  2. magnetic liquid-glass "View Item" pill that trails the cursor
// The whole surface (image click-target, pill, wishlist heart) lives inside
// the tilt layer, and the hover handlers live on the outer container, so the
// tilt keeps running over the heart and the heart tilts with the image.
const MAX_TILT = 2.5; // degrees — just a hint of "push"

export function CardMedia({
  href,
  cover,
  title,
  itemId,
  isSold = false,
}: {
  href: string;
  cover?: ItemImage;
  title: string;
  itemId: number;
  isSold?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState(false);
  const [overHeart, setOverHeart] = useState(false);

  // Cursor position + tilt are written straight to the DOM via CSS custom
  // properties on rAF — NOT React state — so moving the mouse never triggers a
  // re-render. The pill/tilt read the vars through `transform`, which the
  // compositor animates on the GPU (no layout, no per-frame React work).
  const latest = useRef<{ x: number; y: number; w: number; h: number } | null>(
    null,
  );
  const frame = useRef<number | null>(null);

  function applyMove() {
    frame.current = null;
    const el = ref.current;
    const l = latest.current;
    if (!el || !l) return;
    // Tilt reads the raw cursor position (over the whole surface).
    const nx = (l.x / l.w) * 2 - 1;
    const ny = (l.y / l.h) * 2 - 1;
    el.style.setProperty("--rx", `${-ny * MAX_TILT}deg`);
    el.style.setProperty("--ry", `${nx * MAX_TILT}deg`);
    // The pill is centered on --px/--py; clamp so it never crosses the card's
    // rounded/clipped edge (overflow-hidden would otherwise cut it off).
    const pill = pillRef.current;
    const gap = 8;
    const halfW = pill ? pill.offsetWidth / 2 : 40;
    const halfH = pill ? pill.offsetHeight / 2 : 14;
    const px = Math.min(Math.max(l.x, halfW + gap), l.w - halfW - gap);
    const py = Math.min(Math.max(l.y, halfH + gap), l.h - halfH - gap);
    el.style.setProperty("--px", `${px}px`);
    el.style.setProperty("--py", `${py}px`);
  }

  function handleMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    latest.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    };
    if (frame.current == null) {
      frame.current = requestAnimationFrame(applyMove);
    }
  }

  function reset() {
    setHover(false);
    setOverHeart(false);
    if (frame.current != null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    // ease the tilt back to flat (the pill just fades out)
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  }

  useEffect(
    () => () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const showPill = hover && !overHeart;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={reset}
      onMouseMove={handleMove}
      className="group relative block [perspective:800px]"
    >
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-glass ring-1 ring-hairline [transform-style:preserve-3d]"
        style={{
          transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
          boxShadow: "0 26px 55px -22px rgba(0, 0, 0, 0.7)",
        }}
      >
        {cover && (
          <SmoothImage
            src={cover.url}
            alt={cover.alt}
            sizes="(max-width: 767px) 100vw, 480px"
            className={isSold ? "grayscale-[0.4]" : ""}
          />
        )}

        {/* sold-out veil + centered tag — non-interactive so the card stays clickable */}
        {isSold && (
          <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-black/45">
            <span className="tracked rounded-full border border-white/25 bg-black/45 px-5 py-2.5 text-[11px] font-medium uppercase text-white shadow-[0_8px_28px_-6px_rgba(0,0,0,0.55)] [backdrop-filter:blur(6px)]">
              Sold out
            </span>
          </div>
        )}

        {/* click target — covers the image, sibling to the heart (no nesting) */}
        <Link
          href={href}
          aria-label={`View ${title}`}
          className="absolute inset-0 z-0 outline-none"
        />

        {/* magnetic liquid-glass pill */}
        <span
          ref={pillRef}
          aria-hidden
          className="tracked pointer-events-none absolute z-10 whitespace-nowrap rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[9px] font-medium text-white shadow-[0_8px_28px_-6px_rgba(0,0,0,0.55)] [backdrop-filter:blur(14px)_saturate(1.4)]"
          style={{
            left: 0,
            top: 0,
            // Position via GPU transform (reads the live --px/--py vars). While
            // hidden, no transition so it snaps to the cursor before fading in;
            // while visible, the transform eases so the pill "trails" the mouse.
            transform:
              "translate(var(--px, 50%), var(--py, 50%)) translate(-50%, -50%) scale(" +
              (showPill ? 1 : 0.85) +
              ")",
            opacity: showPill ? 1 : 0,
            willChange: "transform",
            transition: showPill
              ? "transform 400ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease"
              : "opacity 300ms ease",
          }}
        >
          View Item
        </span>

        {/* wishlist heart — inside the tilt layer so it tilts with the image */}
        <div
          onMouseEnter={() => setOverHeart(true)}
          onMouseLeave={() => setOverHeart(false)}
          className="glass absolute right-4 top-4 z-20 grid size-9 place-items-center rounded-full"
        >
          <WishlistButton itemId={itemId} iconClassName="size-4" />
        </div>
      </div>
    </div>
  );
}
