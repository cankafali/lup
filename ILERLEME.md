# İLERLEME

| Aşama | Başlangıç | Bitiş | Durum |
|---|---|---|---|
| 0 — Kurulum | 2026-09-24 | 2026-09-24 | Tamam |
| 1 — Token'lar, tipografi, grid, primitives | 2026-09-24 | 2026-09-24 | Tamam |
| 2 — Ana sayfa statik | 2026-09-24 | 2026-09-24 | Tamam |
| 3 — Ürün detay statik | 2026-09-24 | 2026-09-24 | Tamam |
| 4 — Lup | 2026-09-24 | 2026-09-24 | Tamam |
| 5 — Animasyonlar | 2026-09-24 | 2026-09-24 | Tamam |
| 6 — Mobil ve tablet | 2026-09-24 | 2026-09-24 | Tamam |
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

- ~~Aşama 3: `RingFront` ölçüleri ürün verisine; `/parca/[slug]` rotası~~ → yapıldı.
- Aşama 4: Tepsi, Makro ve Hero görsellerinde `data-hires` hazır; Nav `data-loupe-hide`, Footer `data-loupe-off` hazır.
- Aşama 5: Nav kaydırmada gizlenme; `OpenStatus` nabzı (`data-status-dot`); istatistik sayma; hero parallax; 10× pin.
- Aşama 6: Mobil MENÜ, tepsi 2 kolon, 10× dikey düzen, Vitrin notunun mobil yeri (şu an `< lg` gizli).
- Figma kıyasında bakılacaklar: hero'da taş ekseninin `Ø 5.1 mm` etiketinden geçmesi, 10×'te yatay eksenin `TABLA` etiketinden geçmesi (ikisi de şartname koordinatlarının sonucu), footer yüksekliği (K-038), Atölye bindirmesi (K-030).

---

## Aşama 3 — Ürün detay sayfası statik

**Yapılanlar**

- `/parca/[slug]`: `generateStaticParams` (6 parça, SSG), `dynamicParams = false` (bilinmeyen slug → 404), `generateMetadata` (`{ad} — No. {certNo}`, açıklama).
- `TechnicalPlate`: tek SVG levha (800×1100), kesim izleri, sağ üstte levha no + ölçek, antet tablosu.
- Çizimler: `RingFront` (ön), `RingTop` (faset diyagramı), `BandSection` (taramalı D kesit), `TitleBlock`; `TwistFront`, `DropEarringFront`, `TennisFront` (düz açılım), `PearPendantFront`, `FiligreeFront`.
- Tektaş: ön görünüşte kırmızı taş işareti + levhanın sağ üstünde statik lup (Ø170, `lup-detay.jpg`) ve 1px kılavuz çizgi.
- `Certificate`: başlık satırı, ad (56px), italik alt başlık (28px, `--text-subtitle`), açıklama, özellik satırları, imza SVG'si, üç damga (−2°, +1°, −1°), WhatsApp butonu, durum satırı, alt not. Masaüstünde `sticky top: 120px`.
- Mağaza'daki küçük yüzük çizimi artık `drawingSpec`'ten okunuyor.

**Kabul**

- [x] 6 slug statik üretiliyor (build çıktısında `●`); `/parca/yok` → 404.
- [x] `solitaire` levhası tam: ön görünüş, üst görünüş (faset diyagramı), bant kesiti (taramalı), antet, lup bağlantısı.
- [x] Diğer 5 tip: ön görünüş (düz açılım) + antet.
- [x] Sertifika tüm satırlar, imza, damgalar, WhatsApp butonu. Mesaj doğru kodlanmış: link çözülünce "Merhaba, sitede Tektaş Rüya (No. 0147) parçasını gördüm. …" birebir çıkıyor.
- [x] Teknik çizimler ikon gibi değil: her görünüşte eksen, en az 3 ölçü, uzatma çizgileri var. Tektaş ön görünüşünde 4 ölçü (iç çap, bant, toplam yükseklik, taş çapı), üst görünüşte 3 (rundist, tabla, tırnak aralığı), kesitte 3 (genişlik, kalınlık, yan duvar). Diğer tiplerde 3–4 ölçü. Altı levha 1440×900'de render edilip kontrol edildi.
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm build` temiz.

**Açık kalanlar (sonraki aşamalara)**

- ~~K-047: bant kalınlığı ön görünüşte 2.2, kesitte 1.6~~ → çözüldü (kullanıcı onayı): halka kalınlığı 1.6 mm, dış r 82.0, etiket "1.6 mm".
- Aşama 5: levha çizim sırası (`data-draw`), sertifika girişi (`data-cert-row`, `data-stamp`), durum noktası nabzı.
- Aşama 6: mobil sıralama (önce sertifika başlığı, sonra levha, sonra satırlar; buton altta sabit).
- Aşama 7: diğer 5 tipin üst görünüşü/kesiti/detayı, "Diğer parçalar" şeridi (§11.4), sayfa geçişi (§11.5).

---

## Aşama 4 — Lup

**Yapılanlar**

- `src/components/loupe/`: `Loupe.tsx` (işaretleme), `useLoupe.ts` (denetleyici + `refreshLoupe`), `cloneContent.ts` (klon temizliği, hi-res, yapışkan ölçümü), `hint.ts` + `LoupeHint.tsx` (mobil ilk ziyaret ipucu).
- `src/lib/gsap.ts` (§14.1); `LOUPE` token'larına `ringMobile`, `touchSlop`, `idleMs`, `stretch`, `crosshair`.
- `globals.css`: `.loupe*` görünüm durumları, imleç kuralları (`html.has-loupe`), dokunmatik seçim kapatma.
- `layout.tsx`: `<Loupe />` `#lup-content`'in kardeşi. Tepsi hücreleri `data-loupe-magnify`, sertifika `data-loupe-sticky`.
- Klon tazeleme: ResizeObserver (150 ms), rota değişimi, `HeroGuide` çizgisi, `OpenStatus` metni, ipucu kalkınca.

**Kabul** (CDP ile headless Edge'de, gerçek fare ve dokunma olaylarıyla test edildi)

- [x] §9'daki maddeler: iç Ø 200 / halka 16 (mobil 140 / 12), `10×` etiketi, nişan, 3.3× büyütme, lerp 0.15, ±%4 esneme. Boşta: 1.2 sn hareketsizlik, link, kenar boşluğu. Pencere dışı → görünmez. Klon: id yok, `inert`, Nav ve lens etiketleri çıkarılmış.
- [x] Masaüstünde fare: lup merkezi imleçte (taş üstünde merkez 931.9, 473.0; sahne dönüşümü formülle birebir).
- [x] Mobilde basılı tut: 180 ms sonra açılır, parmağın 60px üstünde. Sürüklerken sayfa kaymaz; hızlı kaydırmada açılmaz; parmak kalkınca kaybolur.
- [x] Hi-res: lup ilk açılınca 10 görselin 10'u orijinale geçiyor, `srcset` siliniyor; büyütülen fotoğraf keskin (görüntüyle kontrol edildi).
- [x] Linklerin üstünde lup küçülüyor, sistem imleci `pointer`; içerikte imleç gizli (K-056 istisnası: tepsi hücreleri).
- [x] 60fps: Tracing'de lup hareketi boyunca ana sayfada ve ürün sayfasında 0 Layout, 0 Paint. Karede yalnızca stil güncelleme + kompozit; lup yeni alanlar açtıkça GPU'da raster işleri.
- [x] Ürün sayfasında SVG çizimler lupla keskin büyüyor (vektör).
- [x] Kapalı durumlar: reduced motion'da lup tek karede hedefte ve esneme yok. Klon hatasında yalnızca halka kalıyor, hata konsola yazılıyor. JS kapalıyken `has-loupe` sınıfı eklenmiyor, normal imleç.
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm build` temiz.

**Açık kalanlar (sonraki aşamalara)**

- ~~Aşama 5: `refreshLoupe()` ve 10× pin'inin klonda ele alınması~~ → yapıldı (K-066).
- Aşama 6: ipucunun mobil düzendeki yeri (K-061).
- Gerçek cihaz testi (iOS Safari: uzun basma, titreşim yok) Aşama 8'de.

---

## Aşama 5 — Animasyonlar

**Yapılanlar**

- `src/lib/lenis.tsx` (Lenis + GSAP ticker + ScrollTrigger, anchor linkler), `src/lib/gsap.ts`'e DrawSVGPlugin.
- `src/components/motion/`: `useMotion`, `helpers` (ölçü, not, başlık maskesi, bölüm başlığı, temizlik, lup aynalama), `HeroMotion`, `VitrinMotion`, `MakroMotion`, `AtolyeMotion`, `MagazaMotion`, `NavMotion`, `PlateMotion`, `MotionReady`, `intro.ts`, `introScript.ts`; `PulseDot`.
- §14.3 envanterinin tamamı: hero girişi + parallax, başlıklar + etiketler, tepsi hücreleri + ölçüler (+ hover'da yeniden çizim), 10× pin + scrub, Atölye fotoğrafı + notlar + iç parallax, sayaçlar, Mağaza 10× / 1:1, durum noktası nabzı, levha çizimi, sertifika girişi (damga vurma). Ayrıca Nav gizle/göster ve Lenis ile anchor kaydırma.
- Lup: `data-loupe-sync` aynalaması (K-066); animasyon bitişlerinde `refreshLoupe()`.

**Kabul** (CDP ile headless Edge'de, tekerlek ve tıklama olaylarıyla)

- [x] Lenis + ScrollTrigger entegrasyonu; §14.3 envanteri. Hero girişi 0.7 / 1.3 / 1.9 / 3.2 sn karelerinde şartnamedeki sırayla. Ürün sayfası: eksen → kontur → detay → ölçü → etiket; sertifika 0.4 sn'den itibaren satır satır, damgalar en sonda.
- [x] Animasyon bitişlerinde lup klonu tazeleniyor: Vitrin girişinden sonra klondaki hücreler ve başlık son halinde. Pin'li 10×'te klon her karede aynalanıyor.
- [x] Reduced motion'da hiçbir hareket yok, içerik tam görünür: `js-anim` yok, pin yok, transform/clip yok, sayaçlar son değerinde, Nav sabit.
- [x] Hızlı kaydırmada ScrollTrigger konumları kaymıyor: 90 tekerlek olayıyla en alta inince tüm tek seferlik girişler tetiklenmiş; pin bitince 10× bölümü aralayıcının dibinde (2560 + 1080 = 3640). `ScrollTrigger.refresh()` fontlar ve görseller yüklenince (`MotionReady`).
- [x] Nav aşağı kaydırmada gizleniyor (`translateY(−96)`), yukarıda geri geliyor. Anchor linkler Lenis ile yumuşak kayıyor.
- [x] Konsolda hata yok.
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm build` temiz.

**Açık kalanlar (sonraki aşamalara)**

- Aşama 6: Mobilde 10× pin yok (kod hazır, düzen Aşama 6'da); mobil MENÜ açıkken Nav gizlenmemeli.
- Aşama 7: sayfa geçişi (§11.5) bu animasyon sistemiyle birlikte ele alınacak.
- Aşama 8: hero `data-intro` gizlemesinin LCP'ye etkisi Lighthouse'ta ölçülecek.

## Aşama 6 — Mobil ve tablet

**Yapılanlar**

- Nav: mobilde marka + `MENÜ`; tam ekran menü paneli (`NavMenu`, K-076). Tablette 8 kolona sıkışmış masaüstü Nav'ı.
- Yardımcılar:
  - `tap` (K-077);
  - başlıkta `indentMobile`;
  - `PhotoOverlay`'de `positionMobile` (hero 72% 50%);
  - `useMotion`'a `wide` (≥ 1024) koşulu;
  - `ANCHOR_EVENT`.
- Bölümler:
  - hero (lup ve kılavuz gizli, taş işareti ve çap ölçüsü kalıyor, not başlığın altında);
  - Vitrin (2 kolon, sade hücre, K-080);
  - 10× (dikey düzen, tablette pin, K-078);
  - Atölye (2 not, 3 hücre istatistik, 2×2 adım);
  - Mağaza (alt alta, tek sütun bilgi);
  - Footer (2×2).
- Ürün detay: sertifika başlığı üstte, levha pencereleri (`PlateWindow`), 2 sütunlu antet, sertifika gövdesi, yapışık WhatsApp butonu (K-079).
- Düzeltmeler:
  - kesim izleri mobilde (K-081);
  - 1024'te 10× metni (K-083);
  - tablette hero notu (K-082);
  - levha no/ölçek bloğu 768–1280 aralığında lupun üstünde (K-084).

**Kabul** (CDP ile headless Edge'de; mobil ölçüm dokunma emülasyonuyla, `pointer: coarse`)

- [x] Yatay kaydırma yok: 360, 390, 768, 900, 1024, 1280, 1440, 1920 genişliklerinde ana sayfada ve iki ürün sayfasında `scrollWidth == innerWidth`.
- [x] 390'da ana sayfa ve ürün sayfasında 44px'ten küçük dokunma hedefi yok.
- [x] Mobil menü:
  - açılınca odak `KAPAT`'ta ve Lenis duruyor;
  - Escape ile kapanınca odak `MENÜ`'ye dönüyor;
  - "Atölye"ye dokununca panel kapanıyor, bölüm Nav'ın altına (64px) kayıyor.
- [x] 10×:
  - mobilde pin yok, noktalar ve notlar görünür;
  - 768'de yığın pin'li (aralayıcı 1856 = 832 + 1024), lup 0.35 → 1, noktalar ve notlar sırayla, ölçü sonda;
  - pin bitince yerinde.
- [x] Ürün sayfası (390):
  - altı üründe levha pencerelerinde kesilen etiket yok;
  - yapışık buton alttan 12px, 56px yüksek;
  - footer'a gelince akışta kalıyor.
- [x] Tablet (768): Nav tek satır, tepsi 3 kolon, ürün detay tek sütun.
- [x] Masaüstü (1440) değişmedi.
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm build` temiz.

**Açık kalanlar (sonraki aşamalara)**

- Gerçek cihaz testi (iOS Safari'de `svh`, `safe-area`, dokunarak lup) bu ortamda yapılamadı.
- Aşama 7: yeni görünüşler eklendikçe `plateCrops` kutuları güncellenecek (burma, damla, armut, su yolu, telkari için şu an tek pencere).
- Figma karşılaştırması: Figma MCP kotası açılınca.
