"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { ItemImage } from "@/lib/types";
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
}: {
  href: string;
  cover?: ItemImage;
  title: string;
  itemId: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [overHeart, setOverHeart] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  function handleMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPos({ x, y });
    const nx = (x / rect.width) * 2 - 1;
    const ny = (y / rect.height) * 2 - 1;
    setTilt({ rx: -ny * MAX_TILT, ry: nx * MAX_TILT });
  }

  function reset() {
    setHover(false);
    setOverHeart(false);
    setPos(null);
    setTilt({ rx: 0, ry: 0 });
  }

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
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
          boxShadow: "0 26px 55px -22px rgba(0, 0, 0, 0.7)",
        }}
      >
        {cover && (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 767px) 100vw, 480px"
            className="object-cover"
          />
        )}

        {/* click target — covers the image, sibling to the heart (no nesting) */}
        <Link
          href={href}
          aria-label={`View ${title}`}
          className="absolute inset-0 z-0 outline-none"
        />

        {/* magnetic liquid-glass pill */}
        <span
          aria-hidden
          className="tracked pointer-events-none absolute z-10 whitespace-nowrap rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[9px] font-medium text-white shadow-[0_8px_28px_-6px_rgba(0,0,0,0.55)] [backdrop-filter:blur(14px)_saturate(1.4)]"
          style={{
            left: pos ? `${pos.x}px` : "50%",
            top: pos ? `${pos.y}px` : "50%",
            transform: `translate(-50%, -50%) scale(${showPill ? 1 : 0.85})`,
            opacity: showPill ? 1 : 0,
            transition:
              "left 400ms cubic-bezier(0.22,1,0.36,1), top 400ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease, transform 300ms cubic-bezier(0.22,1,0.36,1)",
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
