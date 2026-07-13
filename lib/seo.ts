// Single source of truth for SEO constants and JSON-LD builders.
// Absolute URLs come from NEXT_PUBLIC_SITE_URL (falls back to localhost in dev).
// Used by app/layout metadata, sitemap, robots, and page-level JSON-LD.

export const SITE_NAME = "Selling Preloved Items";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_DESCRIPTION =
  "Discover preloved treasures. Extend the lifecycle of well-made things. A curated gallery of preloved pieces — clothing, tech, homeware, and more.";

/** Absolute URL for a path (e.g. canonical("/gallery")). */
export function canonical(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

/** WebSite schema with a SearchAction pointing at the gallery search. */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: canonical("/"),
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${canonical("/gallery")}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/** Organization schema for the storefront brand. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: canonical("/"),
  description: SITE_DESCRIPTION,
  founder: { "@type": "Person", name: "Akbar" },
};
