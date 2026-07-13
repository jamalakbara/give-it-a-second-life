import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/data/siteContent";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent();
  const s = seo.about;
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: "/about" },
    openGraph: {
      title: `${s.title} | Give It a Second Life`,
      description: s.description,
      url: "/about",
      type: "website",
      ...(s.ogImage ? { images: [{ url: s.ogImage }] } : {}),
    },
  };
}

export default async function AboutPage() {
  const { about } = await getContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: "About | Give It a Second Life",
        description: about.mission,
        url: "/about",
      },
      {
        "@type": "Organization",
        name: "Give It a Second Life",
        description: about.mission,
        url: "/",
      },
    ],
  };

  return (
    <div className="veil px-4 pb-24 pt-28 md:px-10 lg:px-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-[1000px]">
        {/* Hero */}
        <header className="rise max-w-[720px]">
          <p className="tracked text-[10px] text-fg-faint">{about.heroEyebrow}</p>
          <h1 className="mt-4 font-serif text-hero font-medium leading-[1.02] text-fg">
            {about.heroHeading}
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-fg-muted">
            {about.heroIntro}
          </p>
        </header>

        {/* Mission */}
        <section className="mt-24 max-w-[760px] border-t border-hairline pt-14">
          <h2 className="font-serif text-h2 font-medium text-fg">
            {about.missionHeading}
          </h2>
          <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-fg-muted">
            {about.missionBody.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-24">
          <p className="tracked text-[10px] text-fg-faint">How it works</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {about.steps.map((step) => (
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
          <p className="tracked text-[10px] text-fg-faint">{about.curatorEyebrow}</p>
          <h2 className="mt-4 font-serif text-h2 font-medium text-fg">
            {about.curatorHeading}
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-fg-muted">
            {about.curatorBody}
          </p>
        </section>

        {/* CTA */}
        <section className="mt-24 border-t border-hairline pt-14">
          <h2 className="font-serif text-h3 font-medium text-fg">
            {about.ctaHeading}
          </h2>
          <Link
            href="/gallery"
            className="tracked mt-7 inline-flex min-h-[48px] items-center justify-center rounded-full bg-cream px-8 py-3 text-[11px] text-void transition hover:bg-white"
          >
            {about.ctaButton}
          </Link>
        </section>
      </div>
    </div>
  );
}
