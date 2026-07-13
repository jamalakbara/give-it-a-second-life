// Code defaults are the source of truth for the *shape* and *fallback* of all
// admin-editable site copy + SEO. DB rows in `site_content` override these per
// top-level key; anything missing (no row, or a field added in code later)
// falls back here, so the site always renders. See lib/data/siteContent.ts.

export type HomeContent = {
  heroEyebrow: string;
  heroHeading: string;
  heroSub: string;
  heroCta: string;
  arrivalsLabel: string;
  arrivalsLink: string;
};

export type AboutStep = { n: string; title: string; body: string };

export type AboutContent = {
  heroEyebrow: string;
  heroHeading: string;
  heroIntro: string;
  /** Short mission line — also feeds the About SEO/JSON-LD description fallback. */
  mission: string;
  missionHeading: string;
  /** Body paragraphs, rendered in order. */
  missionBody: string[];
  steps: AboutStep[];
  curatorEyebrow: string;
  curatorHeading: string;
  curatorBody: string;
  ctaHeading: string;
  ctaButton: string;
};

export type ItemContent = {
  sellerLabel: string;
  sellerName: string;
  sellerBio: string;
};

export type PageSeo = {
  title: string;
  description: string;
  /** Absolute URL or path to an OG image; empty = fall back to no page image. */
  ogImage: string;
};

export type SeoContent = {
  home: PageSeo;
  gallery: PageSeo;
  about: PageSeo;
};

export type SiteContent = {
  home: HomeContent;
  about: AboutContent;
  item: ItemContent;
  seo: SeoContent;
};

export const CONTENT_KEYS = ["home", "about", "item", "seo"] as const;
export type ContentKey = (typeof CONTENT_KEYS)[number];

export const DEFAULT_CONTENT: SiteContent = {
  home: {
    heroEyebrow: "Give It a Second Life",
    heroHeading: "Nothing here is new.",
    heroSub:
      "And that's the point — preloved pieces, chosen for character and passed on for a second life.",
    heroCta: "Enter the gallery",
    arrivalsLabel: "Latest arrivals",
    arrivalsLink: "View the full gallery →",
  },
  about: {
    heroEyebrow: "Why preloved",
    heroHeading: "Give It a Second Life",
    heroIntro:
      "The best things aren't always new. This is a small gallery of preloved pieces — anything from a jacket to a gadget to a set of wheels — chosen with care and passed on, so they can be loved again instead of forgotten.",
    mission:
      "We give well-made things a second life. Give It a Second Life is a curated, gallery-first home for preloved pieces of every kind — clothing, tech, homeware, and the occasional rare find — chosen for character, not volume.",
    missionHeading: "Extend the lifecycle of beautiful things",
    missionBody: [
      "We make things and throw them away faster than ever. We believe a well-made object — a coat, a camera, a car — deserves more than one owner. Everything here is preloved: already made, still good, and ready for its next chapter.",
      "This is a gallery, not a marketplace. Curated over crowded. We favour a handful of pieces with real character over an endless feed, and we tell you the story behind each one so you know exactly what you're giving a home to.",
    ],
    steps: [
      {
        n: "01",
        title: "Browse the gallery",
        body: "Slow down and look. Every piece is photographed and described like it matters — because it does.",
      },
      {
        n: "02",
        title: "Message the seller",
        body: "Found something? Tap through to WhatsApp and talk to us directly. No accounts, no checkout maze.",
      },
      {
        n: "03",
        title: "Give it a second life",
        body: "Arrange the handover, take it home, and keep a good thing in circulation a little longer.",
      },
    ],
    curatorEyebrow: "The curator",
    curatorHeading: "Curated with care",
    curatorBody:
      "We curate and rehome well-loved pieces so they can live a second life. Everything in this gallery is chosen, photographed, and good enough to keep — we just believe good things are meant to keep moving. If a piece speaks to you, message us and let's find it a new home.",
    ctaHeading: "Something in here is waiting for you.",
    ctaButton: "Explore the gallery",
  },
  item: {
    sellerLabel: "Seller",
    sellerName: "Give It a Second Life",
    sellerBio:
      "Curating and rehoming well-loved pieces so they can live a second life.",
  },
  seo: {
    home: {
      title: "Give It a Second Life — a living gallery of preloved treasures",
      description:
        "A curated, gallery-first home for preloved treasures — clothing, tech, homeware, and rare finds, chosen for character and passed on for a second life.",
      ogImage: "",
    },
    gallery: {
      title: "Gallery",
      description:
        "Browse the full gallery of curated preloved pieces — clothing, tech, homeware, accessories, and more. Filter by category and condition, or search for something specific.",
      ogImage: "",
    },
    about: {
      title: "About",
      description:
        "We give well-made things a second life. Give It a Second Life is a curated, gallery-first home for preloved pieces of every kind — clothing, tech, homeware, and the occasional rare find — chosen for character, not volume.",
      ogImage: "",
    },
  },
};
