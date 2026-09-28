/**
 * Sitenin kök adresi (§18): paylaşım görseli, JSON-LD, canonical ve site haritası mutlak adres ister.
 * Önce `NEXT_PUBLIC_SITE_URL` (Vercel dışı yayın: Netlify, VPS), sonra Vercel ortamı: yayında alan adı,
 * önizlemede dal/dağıtım adresi; hiçbiri yoksa localhost (inceleme 5.3).
 */
const explicit = process.env.NEXT_PUBLIC_SITE_URL;
const host =
  process.env.VERCEL_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : (process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL);

export const SITE_URL = new URL(explicit ?? (host ? `https://${host}` : "http://localhost:3000"));

// Üretim derlemesi localhost'a düştüyse paylaşım etiketleri başka yerde çalışmaz; derlemede uyar
if (typeof window === "undefined" && process.env.NODE_ENV === "production" && !explicit && !host) {
  console.warn(
    "⚠ siteUrl.ts: NEXT_PUBLIC_SITE_URL yok, adres localhost — paylaşım etiketleri çalışmaz",
  );
}
