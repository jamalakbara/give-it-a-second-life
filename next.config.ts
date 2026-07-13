import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React 19 <ViewTransition> — powers the animated page transitions
    // (see app/layout, CardMedia, ImageGallery + the VT rules in globals.css).
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
