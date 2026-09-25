import { site } from "@/content/site";
import { SITE_URL } from "@/lib/siteUrl";

/** schema.org gün adları; `site.hours.open` 0 = Pazar. */
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Mağaza yapısal verisi (§18): `JewelryStore` — ad, adres, saatler, telefon, konum.
 * Ürünler için `Product` yok: fiyat olmadığından sahte teklif üretilmez.
 */
export function StoreJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: site.brandFull,
    url: SITE_URL.href,
    image: new URL("/opengraph-image", SITE_URL).href,
    description: site.description,
    foundingDate: String(site.founded),
    telephone: site.phone.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.district,
      addressRegion: site.address.city,
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.coords.lat,
      longitude: site.address.coords.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: site.hours.open.map((d) => DAYS[d]),
      opens: site.hours.from,
      closes: site.hours.to,
    },
    sameAs: [site.instagram.url],
  };

  return (
    <script
      type="application/ld+json"
      // "<" kaçışı: veri içindeki bir "</script>" betiği erken kapatmasın
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
