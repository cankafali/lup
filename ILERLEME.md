# İLERLEME

| Aşama | Başlangıç | Bitiş | Durum |
|---|---|---|---|
| 0 — Kurulum | 2026-09-24 | 2026-09-24 | Tamam |
| 1 — Token'lar, tipografi, grid, primitives | 2026-09-24 | 2026-09-24 | Tamam |
| 2 — Ana sayfa statik | — | — | — |
| 3 — Ürün detay statik | — | — | — |
| 4 — Lup | — | — | — |
| 5 — Animasyonlar | — | — | — |
| 6 — Mobil ve tablet | — | — | — |
| 7 — Kalan çizim tipleri ve cilalar | — | — | — |
| 8 — Erişilebilirlik, performans, SEO, deploy | — | — | — |

---

## Aşama 0 — Kurulum

**Yapılanlar**

- Next.js 16.3.6 (App Router, `src/`, TypeScript strict + `noUncheckedIndexedAccess`), Tailwind v4, ESLint 9 (flat config).
- Bağımlılıklar: `gsap`, `@gsap/react`, `lenis`, `geist`, `clsx`; geliştirme: `prettier`, `prettier-plugin-tailwindcss`.
- Script'ler: `dev`, `build`, `start`, `lint` (`eslint .`, bkz. K-004), `typecheck` (`next typegen && tsc --noEmit`, bkz. K-010), `format`.
- `src/styles/tokens.css` (§5.2) + `globals.css` import'u; `<html lang="tr">`; boş `<main id="lup-content">`; `noindex`.
- `KARARLAR.md`, `ILERLEME.md` açıldı.
- Görseller `public/images/` altında §13'teki adlarla (9 dosya); boyutlar tabloyla birebir uyuşuyor (1376×768, 4 × 928×1152, 3 × 1024×1024, 1264×848). §13'te olmayan 5 ek görsel (1024×1024) kullanıcı isteğiyle `public/images/`'tan kaldırıldı (Geri Dönüşüm Kutusu'nda).

**Kabul**

- [x] `pnpm lint`, `pnpm typecheck`, `pnpm build` temiz.
- [x] Boş sayfa kâğıt renginde (`html` arka planı `rgb(239 235 227)` = `#EFEBE3`, tarayıcıda doğrulandı).

**Açık kalanlar (sonraki aşamalara)**

- Metadata metinleri şimdilik `layout.tsx` içinde; Aşama 2'de `src/content/site.ts`'e taşınacak.

---

## Aşama 1 — Token'lar, tipografi, grid, primitives

**Yapılanlar**

- `tokens.css`: §5.2 + akışkan display ölçeği (K-012), tüm metin rolleri için satır/aralık/ağırlık alt token'ları, `--text-display-s` (56px, §11.3), duyarlı grid değişkenleri (K-013), `--italic-scale`.
- `tokens.ts`: §5.3 + `EASE.gsapStamp` (§11.3), `DISPLAY_REF`, `CANVAS_REF`.
- Fontlar: `geist` (Sans, Mono) + `next/font/google` Instrument Serif Italic (latin + latin-ext).
- `globals.css`: `container-lup`, `grid-lup` (`@utility`), genel `:focus-visible` (K-025).
- `layout.tsx`: `<div id="lup-content">` + `GridLines` (K-015, K-016, K-017).
- Bileşenler: `GridLines`, `PlateFrame`, `Stamp`, `MonoLabel`, `Headline`, `DimensionLine`, `Axis`, `Callout`, `PaperTag`, `Lens`, `Button` + ortak `Hairline` (1px non-scaling SVG çizgi) ve `lib/overlay.ts` (viewBox → yüzde).
- `/_kit` geçici sayfası (`src/app/%5Fkit`, prod'da 404, K-024).

**Kabul**

- [x] Türkçe karakterler üç fontta doğru: ğ ı i ş ç ö ü â Ğ I İ Ş Ç Ö Ü Â için Geist Sans, Geist Mono, Instrument Serif Italic'te eksik glif yok (canvas ölçümü + görsel kontrol).
- [x] `İ` büyük harf dönüşümü doğru: `istanbul · ığdır · şişli` → `İSTANBUL · IĞDIR · ŞİŞLİ`.
- [x] 1px çizgiler: kenarlıklar 1px, SVG çizgiler `vector-effect: non-scaling-stroke` + `stroke-width: 1` (ölçeklenen SVG'de de 1px). Bu makinede DPR 1.25; Chrome kenarlığı 1 cihaz pikseline yuvarlıyor (0.8 CSS px), yani çizgi bulanık değil, tek piksel.
- [x] 1440 ölçümleri: Display XL 149.76px, italik 172px, bindirme −20px, `cols-2` girinti = 2 kolon + 2 ara; Button 56px; Lens 240+2×8 ve 170+2×16; kesim izi 16px, köşeden 24px.
- [x] Grid: 390 → 4 kolon (20/16), 800 → 8 kolon (40/20), 1024–1440 → 12 kolon (64/24), 1920 → 1312 + 2×64 ortalı. Hiçbir genişlikte yatay taşma yok.
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm build` temiz.

**Açık kalanlar (sonraki aşamalara)**

- Aşama 2: `PhotoOverlay` + `useOverlayPoint` (fotoğraf üstü, `slice` kırpmalı bindirmeler).
- Aşama 2: Tepsi ölçülerinde etiket yönü. Burma'da (y 385) varsayılan "üst" etiket yüzüğün alt kenarına biniyor; hücre bazında `labelSide` verilecek.
- Aşama 2: Metadata metinleri `layout.tsx`'ten `src/content/site.ts`'e taşınacak.
- Aşama 5: `DimensionLine animate` (işaretler hazır: `data-animate`, `data-dim-line`, `data-dim-ticks`, `data-dim-label`), `Headline` satır maskesi (`data-headline-mask`).
- Figma kıyası (K-011) limit açılınca.
- `/_kit` son aşamada silinecek.
