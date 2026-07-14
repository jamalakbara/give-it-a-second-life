"use client";

import { useEffect, useState } from "react";

export function ScrollIndicator() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 80) setHidden(true); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hidden) return null;

  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
      aria-hidden="true"
    >
      <span className="tracked text-[9px] text-fg-faint">scroll</span>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 text-fg-faint"
        style={{ animation: "var(--animate-scroll-bob)" }}
      >
        <path d="M3 6l5 5 5-5" />
      </svg>
    </div>
  );
}
