"use client";

import { useEffect, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { Aurora } from "@/components/Aurora";

// WebGL fluid mesh-gradient background — a flowing GPU composition of colour
// spots drifting over a near-black base, in the cool "night-sky aurora" palette
// (indigo / blue / cyan / mint / deep-teal). Tuned subtle (slow speed) so the
// product photos stay hero. Falls back to the static CSS <Aurora /> for SSR
// first paint, prefers-reduced-motion, and environments without WebGL.
export function AuroraGL() {
  // Only mount the canvas on the client. During SSR / first paint we render the
  // static Aurora, which avoids a hydration mismatch and gives an instant
  // coloured background before the shader spins up.
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    setMounted(true);

    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!mounted || reducedMotion) {
    return <Aurora />;
  }

  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden bg-void">
      <MeshGradient
        colors={["#14100b", "#c2542f", "#ca8a04", "#d6a35c", "#7c3a1d", "#4a2410"]}
        distortion={0.8}
        swirl={0.35}
        speed={0.18}
        grainOverlay={0.12}
        width="100%"
        height="100%"
        // The gradient is soft/blurred, so it doesn't need crisp retina pixels.
        // Cap total rendered pixels (~800k ≈ 1200×670 @1x, upscaled by the browser)
        // so the fullscreen shader doesn't saturate the GPU — otherwise it starves
        // the card hover transforms and the page feels laggy. Blur hides the low res.
        maxPixelCount={800_000}
        minPixelRatio={1}
        style={{ position: "absolute", inset: 0 }}
      />
      {/* light centre darkening for text legibility; colours keep blooming */}
      <div className="absolute inset-0 bg-[radial-gradient(135%_135%_at_50%_45%,transparent_0,rgba(20,16,11,0.16)_60%,rgba(20,16,11,0.42)_100%)]" />
      {/* fine grain to kill banding */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />
    </div>
  );
}
