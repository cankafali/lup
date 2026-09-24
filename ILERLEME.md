# İLERLEME

| Aşama | Başlangıç | Bitiş | Durum |
|---|---|---|---|
| 0 — Kurulum | 2026-09-24 | 2026-09-24 | Tamam |
| 1 — Token'lar, tipografi, grid, primitives | 2026-09-24 | 2026-09-24 | Tamam |
| 2 — Ana sayfa statik | 2026-09-24 | 2026-09-24 | Tamam |
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

- ~~Aşama 2: `PhotoOverlay` + `useOverlayPoint`~~ → yapıldı (K-026, K-027).
- ~~Aşama 2: Tepsi ölçülerinde etiket yönü~~ → yapıldı (K-031).
- ~~Aşama 2: Metadata metinleri `site.ts`'e~~ → yapıldı.
- Aşama 5: `DimensionLine animate` (işaretler hazır: `data-animate`, `data-dim-line`, `data-dim-ticks`, `data-dim-label`), `Headline` satır maskesi (`data-headline-mask`).
- Figma kıyası (K-011) limit açılınca.
- `/_kit` son aşamada silinecek.

---

## Aşama 2 — Ana sayfa statik (animasyonsuz, lupsuz)

**Yapılanlar**

- İçerik: `site.ts` (§12.1 + `indexable`, saat dilimi), `products.ts` (6 parça, §12.2), `copy.ts` (tüm bölüm metinleri). Görsel alt metinleri görsellere bakılarak yazıldı.
- `lib`: `whatsapp.ts` (§12.3), `openStatus.ts` (Europe/Istanbul), `overlay.ts`'e `coverPoint`.
- Bileşenler: `Nav`, `Footer` (+ `FitText` wordmark), `PhotoOverlay`, `HeroGuide`, `OpenStatus`, `RingFront` (48px Mağaza çizimi), bölümler `Hero`, `Vitrin` + `TrayCell`, `Makro`, `Atolye`, `Magaza`.
- `layout.tsx`: Nav + Footer, metadata `site.ts`'ten, `robots` `indexable` bayrağından.

**Kabul**

- [x] Masaüstü 1440 düzeni: yedi bölüm §10'daki ölçülerle yerleşti (CDP ile 1440×900 viewport'ta bölüm bölüm görüntü alındı). Figma v2 ile kıyas yapılamadı (K-011).
- [x] Fotoğraf bindirmeleri kilitli: 1280×800, 1440×900, 1680×1050, 1920×1080'de hero taş işaretinin beklenen konumdan sapması 0px; kılavuz çizginin taş ucu işaretle 0px farkla çakışıyor. Tepsi ve Atölye bindirmeleri hücre/fotoğraf uzayında.
- [x] "Şu an açık" doğru: 9 senaryo (açılış öncesi/sonrası, kapanış, Pazar, Pazartesi, UTC gün dönümü) Node'da test edildi; tarayıcıda hidrasyon sonrası "ŞU AN AÇIK" hesaplandı.
- [x] Yer tutucu yok: `grep -rn "\[" src/content` yalnızca TS dizilerini döndürüyor; TODO / Lorem / [LOGO] yok.
- [x] Kırmızı bütçesi: odak kırmızısı 3 (Nav "RANDEVU →", hero taş işareti, Mağaza "RANDEVU AL"). Diğer kırmızılar şartnamenin istediği `10×` etiketleri ve bütçe dışı 8 damga.
- [x] Hiçbir genişlikte yatay taşma yok (1280–1920).
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm build` temiz.

**Açık kalanlar (sonraki aşamalara)**

- Aşama 3: `RingFront` ölçüleri ürün verisine (`products.ts`) taşınacak (K-042); `/parca/[slug]` rotası (tepsi linkleri şu an 404).
- Aşama 4: Tepsi, Makro ve Hero görsellerinde `data-hires` hazır; Nav `data-loupe-hide`, Footer `data-loupe-off` hazır.
- Aşama 5: Nav kaydırmada gizlenme; `OpenStatus` nabzı (`data-status-dot`); istatistik sayma; hero parallax; 10× pin.
- Aşama 6: Mobil MENÜ, tepsi 2 kolon, 10× dikey düzen, Vitrin notunun mobil yeri (şu an `< lg` gizli).
- Figma kıyasında bakılacaklar: hero'da taş ekseninin `Ø 5.1 mm` etiketinden geçmesi, 10×'te yatay eksenin `TABLA` etiketinden geçmesi (ikisi de şartname koordinatlarının sonucu), footer yüksekliği (K-038), Atölye bindirmesi (K-030).
