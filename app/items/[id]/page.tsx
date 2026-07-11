import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItem, getItems } from "@/lib/data/items";
import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
} from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ImageGallery } from "@/components/ImageGallery";
import { ConditionBadge } from "@/components/Badge";
import { WishlistButton } from "@/components/WishlistButton";
import { WhatsAppIcon } from "@/components/icons";

type Props = { params: Promise<{ id: string }> };

async function resolveItem(params: Props["params"]) {
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) return null;
  return getItem(itemId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await resolveItem(params);
  if (!item) return { title: "Item not found" };
  return {
    title: `${item.title} | Preloved ${CATEGORY_LABELS[item.category]}`,
    description: `${CONDITION_LABELS[item.condition]} condition${
      item.size ? `, size ${item.size}` : ""
    } — ${formatPrice(item.price)}. ${item.description.slice(0, 140)}`,
    openGraph: {
      title: item.title,
      description: item.description.slice(0, 200),
      images: item.images.map((image) => ({ url: image.url, alt: image.alt })),
    },
  };
}

export default async function ItemDetailPage({ params }: Props) {
  const item = await resolveItem(params);
  if (!item) notFound();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'm interested in ${item.title}. Is it still available?`,
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    description: item.description,
    image: item.images.map((image) => image.url),
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
    },
  };

  return (
    <div className="veil px-4 pb-24 pt-28 md:px-10 lg:px-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto flex max-w-[1180px] flex-col gap-10 md:flex-row lg:gap-16">
        <div className="md:w-1/2 lg:w-[55%]">
          <ImageGallery images={item.images} />
        </div>

        <div className="md:w-1/2 lg:w-[45%] md:pt-6">
          <p className="tracked text-[10px] text-fg-faint">
            {CATEGORY_LABELS[item.category]}
          </p>
          <h1 className="mt-3 font-serif text-h2 font-medium text-fg">
            {item.title}
          </h1>
          <div className="mt-5 flex items-center gap-4">
            <p className="text-[26px] text-fg">{formatPrice(item.price)}</p>
            <ConditionBadge condition={item.condition} />
          </div>

          <p className="mt-7 text-[16px] leading-[1.7] text-fg-muted">
            {item.description}
          </p>

          {(item.size || item.color || item.material) && (
            <dl className="mt-7 space-y-2.5 border-t border-hairline pt-7 text-[14px]">
              {item.size && (
                <div className="flex gap-3">
                  <dt className="w-24 tracked text-[10px] text-fg-faint">Size</dt>
                  <dd className="text-fg">{item.size}</dd>
                </div>
              )}
              {item.color && (
                <div className="flex gap-3">
                  <dt className="w-24 tracked text-[10px] text-fg-faint">Color</dt>
                  <dd className="text-fg">{item.color}</dd>
                </div>
              )}
              {item.material && (
                <div className="flex gap-3">
                  <dt className="w-24 tracked text-[10px] text-fg-faint">Material</dt>
                  <dd className="text-fg">{item.material}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-9 flex items-center gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="tracked inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-cream px-7 py-3 text-[11px] text-void transition hover:bg-white"
            >
              <WhatsAppIcon className="size-4" />
              Contact via WhatsApp
            </a>
            <div className="glass rounded-full p-3">
              <WishlistButton itemId={item.id} iconClassName="size-5" />
            </div>
          </div>

          <div className="mt-12 border-t border-hairline pt-7">
            <p className="tracked text-[10px] text-fg-faint">Seller</p>
            <p className="mt-2 font-serif text-[22px] font-medium text-fg">
              Akbar
            </p>
            <p className="mt-1.5 text-[14px] text-fg-muted">
              Curating and rehoming well-loved pieces so they can live a second
              life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const items = await getItems();
  return items.map((item) => ({ id: String(item.id) }));
}
