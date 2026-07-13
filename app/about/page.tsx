import type { Metadata } from "next";
import Link from "next/link";

const MISSION =
  "We give well-made things a second life. Give It the Second Life is a curated, gallery-first home for preloved pieces of every kind — clothing, tech, homeware, and the occasional rare find — chosen for character, not volume.";

export const metadata: Metadata = {
  title: "About",
  description: MISSION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Give It the Second Life",
    description: MISSION,
    url: "/about",
    type: "website",
  },
};

const STEPS = [
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
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      name: "About | Give It the Second Life",
      description: MISSION,
      url: "/about",
    },
    {
      "@type": "Organization",
      name: "Give It the Second Life",
      description: MISSION,
      url: "/",
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="veil px-4 pb-24 pt-28 md:px-10 lg:px-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-[1000px]">
        {/* Hero */}
        <header className="rise max-w-[720px]">
          <p className="tracked text-[10px] text-fg-faint">Our story</p>
          <h1 className="mt-4 font-serif text-hero font-medium leading-[1.02] text-fg">
            Why preloved
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-fg-muted">
            The best things aren&apos;t always new. This is a small gallery of
            preloved pieces — anything from a jacket to a gadget to a set of
            wheels — chosen with care and passed on, so they can be loved again
            instead of forgotten.
          </p>
        </header>

        {/* Mission */}
        <section className="mt-24 max-w-[760px] border-t border-hairline pt-14">
          <h2 className="font-serif text-h2 font-medium text-fg">
            Extend the lifecycle of beautiful things
          </h2>
          <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-fg-muted">
            <p>
              We make things and throw them away faster than ever. We believe a
              well-made object — a coat, a camera, a car — deserves more than one
              owner. Everything here is preloved: already made, still good, and
              ready for its next chapter.
            </p>
            <p>
              This is a gallery, not a marketplace. Curated over crowded. We
              favour a handful of pieces with real character over an endless
              feed, and we tell you the story behind each one so you know
              exactly what you&apos;re giving a home to.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-24">
          <p className="tracked text-[10px] text-fg-faint">How it works</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="glass rounded-3xl p-7">
                <p className="tracked text-[10px] text-fg-faint">{step.n}</p>
                <h3 className="mt-4 font-serif text-[22px] font-medium text-fg">
                  {step.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-fg-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Seller intro */}
        <section className="mt-24 max-w-[760px] border-t border-hairline pt-14">
          <p className="tracked text-[10px] text-fg-faint">The curator</p>
          <h2 className="mt-4 font-serif text-h2 font-medium text-fg">
            Curated with care
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-fg-muted">
            We curate and rehome well-loved pieces so they can live a second
            life. Everything in this gallery is chosen, photographed, and good
            enough to keep — we just believe good things are meant to keep
            moving. If a piece speaks to you, message us and let&apos;s find it a
            new home.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-24 border-t border-hairline pt-14">
          <h2 className="font-serif text-h3 font-medium text-fg">
            Something in here is waiting for you.
          </h2>
          <Link
            href="/gallery"
            className="tracked mt-7 inline-flex min-h-[48px] items-center justify-center rounded-full bg-cream px-8 py-3 text-[11px] text-void transition hover:bg-white"
          >
            Explore the gallery
          </Link>
        </section>
      </div>
    </div>
  );
}
