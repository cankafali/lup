/**
 * Lupta büyütülen görselin yüksek çözünürlüklü kopyası (§9.2, inceleme 3.1): Next'in görsel
 * optimizasyonundan (WebP/AVIF). Kaynaklar 928–1376px; 1920 sınırı orijinal çözünürlüğü korur,
 * ham JPEG'in ağırlığını (toplam ≈ 5 MB) taşımaz. `w` deviceSizes'ta, `q` qualities'te olmalı.
 */
export const hiresUrl = (src: string, w = 1920, q = 75) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;
