import type { MetadataRoute } from "next";
import { getItems } from "@/lib/data/items";
import { canonical } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getItems();

  return [
    { url: canonical("/"), changeFrequency: "daily", priority: 1 },
    { url: canonical("/gallery"), changeFrequency: "daily", priority: 0.9 },
    { url: canonical("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: canonical("/wishlist"), changeFrequency: "weekly", priority: 0.5 },
    ...items.map((item) => ({
      url: canonical(`/items/${item.id}`),
      lastModified: new Date(item.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
