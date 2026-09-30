import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Bağlantı önizlemesi yapan botlar (paylaşım görseli, §18). Arama motoru değiller; kuyumcu onaylamadan
 * da önizleme çalışsın diye kapalı sitede de izinli (K-108).
 */
const PREVIEW_BOTS = [
  "Twitterbot",
  "facebookexternalhit",
  "LinkedInBot",
  "Slackbot",
  "TelegramBot",
  "WhatsApp",
];

/**
 * robots.txt (inceleme 6). Kuyumcu onaylayana kadar (`site.indexable: false`) tüm tarama kapalı,
 * `noindex, nofollow` ile birlikte; açılınca site haritası adresi verilir.
 */
export default function robots(): MetadataRoute.Robots {
  if (!site.indexable)
    return {
      rules: [
        { userAgent: PREVIEW_BOTS, allow: "/" },
        { userAgent: "*", disallow: "/" },
      ],
    };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", SITE_URL).href,
  };
}
