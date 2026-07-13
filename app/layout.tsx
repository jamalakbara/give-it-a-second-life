import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";
import { AuroraGL } from "@/components/AuroraGL";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";

// Self-hosted display face for all headings (font-serif token). Single weight (400).
const tanker = localFont({
  src: "./fonts/Tanker-Regular.woff2",
  variable: "--font-tanker",
  weight: "400",
  display: "swap",
});


// Self-hosted display — scoped to the "Second Life°" logotype (font-logo token).
const boxing = localFont({
  src: "./fonts/Boxing-Regular.woff2",
  variable: "--font-boxing",
  weight: "400",
  display: "swap",
});

// Self-hosted variable sans for body + UI (font-sans token). Axis: wght 200–700.
const clashDisplay = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Give It a Second Life — a living gallery of preloved treasures",
    template: "%s | Give It a Second Life",
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${tanker.variable} ${boxing.variable} ${clashDisplay.variable} h-full antialiased`}
      >
      <body className="min-h-full p-2 md:p-2.5">
        {/* Freezes the view-transition root snapshot so the navbar/footer (which
            live outside the transition wrapper, in `root`) don't crossfade/blink
            during a page change. Injected raw because Lightning CSS strips the
            `root` pseudo-argument from globals.css. */}
        <style>{`::view-transition-group(root),::view-transition-old(root),::view-transition-new(root){animation:none!important}`}</style>
        <AuroraGL />
        {/* Chrome (navbar/footer vs. admin top bar) is chosen by the nested
            layouts: app/(site)/layout.tsx wraps the public pages, app/admin/
            layout.tsx wraps the seller studio. Root stays chrome-agnostic. */}
        {children}
      </body>
      </html>
    </ClerkProvider>
  );
}
