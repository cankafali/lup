import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { SITE_URL } from "@/lib/siteUrl";

/** Site haritası (inceleme 6): ana sayfa ve altı parça. robots.txt yalnızca site açılınca gösterir. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL.href, changeFrequency: "monthly", priority: 1 },
    ...products.map((p) => ({
      url: new URL(`/parca/${p.slug}`, SITE_URL).href,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
