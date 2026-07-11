import type { MetadataRoute } from "next";
import { getItems } from "@/lib/data/items";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getItems();

  return [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/wishlist`, changeFrequency: "weekly", priority: 0.5 },
    ...items.map((item) => ({
      url: `${BASE_URL}/items/${item.id}`,
      lastModified: new Date(item.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
