import type { Metadata } from "next";
import Link from "next/link";
import { getItems } from "@/lib/data/items";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { ArrivalsCarousel } from "@/components/ArrivalsCarousel";

const PREVIEW_COUNT = 6;

export const metadata: Metadata = {
  // Home uses the default (non-templated) title from the root layout.
  description:
    "A curated, gallery-first home for preloved treasures — clothing, tech, homeware, and rare finds, chosen for character and passed on for a second life.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Give It the Second Life — a living gallery of preloved treasures",
    description:
      "A curated, gallery-first home for preloved treasures. Every piece with a story.",
    url: "/",
    type: "website",
  },
};

const jsonLd = { "@context": "https://schema.org", "@graph": [websiteJsonLd, organizationJsonLd] };

export default async function HomePage() {
  // A small curated strip (newest first) that funnels visitors into the gallery.
  const featured = await getItems({ limit: PREVIEW_COUNT, offset: 0 });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — minimal, full aurora shows through */}
      <section className="flex min-h-[78vh] flex-col items-center justify-center px-6 text-center">
        <p className="tracked animate-rise text-[11px] text-fg-muted">
          Give It the Second Life
        </p>
        <h1 className="mt-6 max-w-4xl font-serif text-hero font-medium leading-[1.02] text-fg animate-rise">
          Nothing here is new.
        </h1>
        <p className="mt-7 max-w-md text-[16px] text-fg-muted animate-rise md:text-[18px]">
          And that&apos;s the point — preloved pieces, chosen for character and
          passed on for a second life.
        </p>
        <Link
          href="/gallery"
          className="tracked animate-rise mt-10 inline-flex min-h-[48px] items-center justify-center rounded-full bg-cream px-8 py-3 text-[11px] text-void transition hover:bg-white"
        >
          Enter the gallery
        </Link>
      </section>

      {/* Preview strip — a taste of the catalog, then send them in */}
      {featured.length > 0 && (
        // Carousel flows with the page (no sticky pin) so vertical scroll never
        // stalls while passing the strip. The track masks its own edges, so the
        // fan still fades off-screen rather than hard-clipping.
        <section className="veil relative px-4 py-16 md:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="mb-10 flex items-baseline justify-between gap-6">
              <p className="tracked text-[11px] text-fg-muted">Latest arrivals</p>
              <Link
                href="/gallery"
                className="tracked text-[10px] text-fg-faint underline-offset-4 transition-colors hover:text-fg hover:underline"
              >
                View the full gallery →
              </Link>
            </div>
          </div>
          {/* Carousel breaks out of the 1120 container to the full section
              width so peeking side cards fade off the screen edges rather than
              hard-clipping mid-section (the track masks its own edges). */}
          <ArrivalsCarousel items={featured} />
        </section>
      )}
    </div>
  );
}
