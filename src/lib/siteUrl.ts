/**
 * Sitenin kök adresi (§18): paylaşım görseli ve JSON-LD mutlak adres ister.
 * Vercel'de yayında alan adı, önizlemede dal/dağıtım adresi; yerelde localhost.
 */
const host =
  process.env.VERCEL_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : (process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL);

export const SITE_URL = new URL(host ? `https://${host}` : "http://localhost:3000");
