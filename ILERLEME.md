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
| 7 — Kalan çizim tipleri ve cilalar | 2026-09-25 | 2026-09-25 | Tamam |
| 8 — Erişilebilirlik, performans, SEO, deploy | 2026-09-25 | — | Kod tamam; yayın ve önizleme ölçümü kullanıcıda |
| 9 — İnceleme düzeltmeleri | 2026-09-28 | 2026-09-28 | Tamam (dal `feat/lup-basili-tut`); yayın ve cihaz testi kullanıcıda |

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

## Aşama 7 — Kalan çizim tipleri ve cilalar

**Yapılanlar**

- Tam levhalar (§11.2):
  - burma: ön, bant yüzeyi açılımı 6:1, tel kesiti 20:1 (K-085);
  - damla: ön, armut faset diyagramı 6:1, yan görünüş (K-088);
  - su yolu: düz açılım, yuva detayı 10:1, yuva kesiti 10:1 (K-092);
  - armut: ön, yan görünüş 4:1, zincir halkası 20:1 (K-088);
  - telkari: ön + lup, detay B 8:1 (K-091).
- Ortak modüller: `hatch.ts` (tarama ve kırpma, K-093), `roundBrilliant`, `pearOutline`, `sampleCubic`, `offsetPolyline`.
- Mobil levha pencereleri yeni görünüşlere göre (K-087).
- Diğer parçalar şeridi (§11.4, K-090):
  - `TrayCell compact`;
  - `DragScroll`;
  - lup klonunda iç kaydırma eşlemesi (`data-loupe-scroll`).
- Sayfa geçişi (§11.5, K-089):
  - `PartLink`, `lib/partTransition.ts`;
  - `MotionReady` → `pageReady`;
  - rota değişiminde lup, klon yenilenene kadar boşta.
- Kroki: yapılmadı (K-094).

**Kabul** (CDP ile headless Edge'de)

- [x] Beş tipin levhası çiziliyor:
  - altı levhada 390, 768, 1024, 1440'ta kesilen ya da birbirine binen etiket yok (otomatik ölçüm);
  - görsel kontrol 1440 ve 390'da yapıldı.
- [x] Levha girişi yeni görünüşlerde de sırayla (eksen → kontur → detay → ölçü → etiket); bitince satır içi çizim ve kırpma stili kalmıyor.
- [x] Şerit:
  - 1280'de 48px, 1024'te 304px taşma;
  - sürükleyince kayıyor, bırakınca hücreye oturuyor (240);
  - sürükleme sonrası tıklama gezinmiyor, normal tıklama gezinir;
  - lup klonu aynı konumda;
  - mobilde kenardan kenara, sayfada yatay taşma yok.
- [x] Geçiş:
  - vitrin → ürün ve şerit → ürün: `startViewTransition` türü `part-open`, adlar `root`, `site-header`, `part-hold`, hatasız bitiyor;
  - 130 ms'de sayfa sönük, tıklanan fotoğraf yerinde;
  - yeni sayfada kaydırma 0, Lenis kesintisiz;
  - desteksiz tarayıcıda içerik sönüp (120 ms'de opaklık 0.05) yeni sayfada geri geliyor;
  - reduced motion'da ve geri linkinde geçiş yok.
- [x] Yatay taşma yok: 360–1920 arası sekiz genişlikte ana sayfa ve ürün sayfaları.
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm build` temiz.

**Açık kalanlar (sonraki aşamalara)**

- Aşama 8:
  - geliştirme sunucusu hero görseli için "LCP, `loading="eager"` ekleyin" uyarısı veriyor, `PhotoOverlay`'in öncelik ayarı kontrol edilecek;
  - Lighthouse.
- Yeni görünüşlerin ölçüleri temsili (K-086): gerçek parçalar ölçülünce `products.ts` güncellenmeli.
- Kroki için dükkânın gerçek konumu gerekiyor (K-094).
- Figma karşılaştırması: Figma MCP kotası açılınca.

## Aşama 8 — Erişilebilirlik, performans, SEO, deploy

**Yapılanlar**

- Erişilebilirlik (§16):
  - "İçeriğe geç", bölüm linklerinde odak (K-099);
  - buton kırmızısı AA (K-098);
  - kurşun gri metin/çizim ayrımı (K-101).
- Performans (§17):
  - hero girişinin LCP'ye giren kısmı CSS'le (K-095);
  - açılış iş yükü (K-096);
  - mobil LCP öğeleri (K-097);
  - animasyon ve lup kodu hidrasyondan sonra (K-103).
- SEO (§18, K-100):
  - `metadataBase`, paylaşım görseli, Twitter kartı;
  - ürün sayfası paylaşım etiketleri;
  - `JewelryStore` JSON-LD;
  - favicon;
  - `noindex, nofollow` açık.

**Kabul** (yerel üretim derlemesi, mobil Lighthouse 12 benzetimli + CDP denetimleri)

- [x] Accessibility 100 (hedef ≥ 95). İstisna (K-104, 2026-09-28): mobilde yakınlaştırma kullanıcı isteğiyle kapalı; `meta-viewport` denetimi bilerek başarısız, puan ≈ 90–95.
- [x] JS ilk yük 152KB gzip (bütçe ≤ 180KB).
- [x] CLS 0.
- [ ] Performance ≥ 90: yerelde 79–90 (K-102). LCP yerelde ölçülemiyor (`localhost` yan etkisi); Vercel önizlemesinde ölçülecek.
- [x] Yapı:
  - `lang="tr"`, header > nav, tek main, footer;
  - tek H1, bölüm başlıkları H2;
  - adsız link/buton ve alt metinsiz görsel yok;
  - dekoratif SVG'ler gizli;
  - lup `aria-hidden`, klon `inert`.
- [x] Klavye:
  - ilk Tab "İçeriğe geç" (görünür çerçeve), Enter ile odak ana içerikte;
  - Nav bölüm linki kaydırıp odağı bölüme taşıyor.
- [x] Regresyon (K-103 sonrası):
  - hızlı kaydırmada tüm girişler, pin konumu, reduced motion;
  - hero bindirmelerinde bir an görünüp kaybolma yok;
  - sayfa geçişleri (View Transition, şerit, desteksiz tarayıcı);
  - şerit sürükleme, mobil menü, dokunma hedefleri;
  - lup (masaüstü, dokunmatik basılı tutma, yapışkan aynalama);
  - levha pencereleri.
- [x] §20 taraması:
  - gölge, gradyan zemin, koyu zemin, altın rengi, yuvarlak kart köşesi yok;
  - fiyat ve satış dili, yer tutucu, TODO yok;
  - `noindex` açık.
- [ ] Vercel'e yayın ve önizleme linki: kullanıcı elle yapacak (aşağıda).
- [ ] Vercel önizlemesinde mobil Lighthouse (Performance ≥ 90).
- [ ] Gerçek cihaz testi: hero yükleniyor, basılı tutunca lup açılıyor, WhatsApp butonu uygulamayı açıyor.

**Yayın (elle)**

1. `npx vercel login`: hesapla giriş.
2. Proje klasöründe `npx vercel`: önizleme dağıtımı. İlk seferde proje bağlanır; çerçeve Next.js, ayarlar varsayılan.
3. Verilen önizleme adresini bu dosyaya yaz. (30.09: Vercel GitHub'a bağlandı; adres Aşama 9 → "PR, CI ve önizleme".)
4. Önizlemede ölçüm: [PageSpeed Insights](https://pagespeed.web.dev/) (mobil) ya da `npx lighthouse <adres> --form-factor=mobile`.
   - Vercel önizlemeleri varsayılan olarak "Vercel Authentication" ile korunur. PageSpeed için proje ayarlarında Deployment Protection'ı önizleme süresince kapatmak ya da paylaşılabilir bağlantı kullanmak gerekebilir.
   - Site `noindex, nofollow` olduğundan arama motorlarına girmez.

**Açık kalanlar**

- Yayın ve önizleme ölçümü (yukarıda).
- Figma karşılaştırması: Figma MCP Starter planın çağrı sınırında. Plan yükseltilirse ya da iki çerçeve (node 12-2 ve 6-305) PNG olarak dışa aktarılırsa yapılabilir.
- Yeni görünüşlerin ölçüleri temsili (K-086) ve dükkân konumu (kroki, K-094): kuyumcudan bilgi gelince.

## Aşama 9 — İnceleme düzeltmeleri

Kaynak: `lup-inceleme.md` (28.09.2026, dış kod incelemesi), otonom çalışma talimatıyla uygulandı.

- Dal `feat/lup-basili-tut`; `master`'a dokunulmadı.
- Her madde ayrı commit. Her commit'ten önce `pnpm lint`, `pnpm typecheck`, `pnpm build`.
- Kararlar K-104…K-111.

**Yapılanlar**

| Madde | Ne | Commit | Karar |
|---|---|---|---|
| A.1 | Mobilde yakınlaştırma kapalı (`viewport` + `touch-action`) | `1cc0939` | K-104 |
| A.2 + 2.3 | Masaüstünde lup sol tık 2 sn basılı tutunca; bırakınca kapanır, izleyen tıklama yutulur (fare ve dokunmatik) | `7c7965e` | K-105 |
| A.3 | Hero'da cihaza göre kullanım bilgisi, "imleç = lup" metinleri kalktı | `f0f7e25` | K-106 |
| 1.1 | Telefon/WhatsApp yer tutucuysa derlemede uyarı (throw değil) | `54ca943` | — |
| 2.1 | Pasif olmayan `touchmove` yalnızca lup açıkken | `016e0c3` | — |
| 2.2 | İlk dokunuşta klon boşta kurulur | `c589239` | — |
| 2.4 | Nav'a odak gelince gizliyse görünür | `871bfbc` | — |
| 2.5 | Mobil menü açıkken arka plan `inert` | `b6f2378` | — |
| 2.6 | `scroll-margin-top`; Nav yüksekliği tek token (`--nav-h`) | `8524f78` | — |
| 2.7 | Yedek (4 sn) devreye girdiyse giriş animasyonu kurulmaz | `135c313` | — |
| 2.8 | Geçiş sürerken ikinci hücre tıklaması yutulur | `07562ec` | — |
| 2.9 | Açılış saati eki saate göre (`timeSuffix`) | `de3bea1` | — |
| 2.10 | "39 yıl" ve telif yılı derleme yılından; levha tarihi ürün verisinde | `101a0a8` | — |
| 2.11 | Hero/10× ölçüleri Tektaş verisinden (çıktı birebir aynı) | `1a2faed` | — |
| 3.1 | Lupun hi-res görselleri `/_next/image` (≈ 5.1 MB → ≈ 390 KB) | `6fadd9b` | — |
| 3.4 | Klondan betik, `noscript`, `template`, `.sr-only` çıkar | `7e227f3` | — |
| 3.5 | Bulanık yer tutucu; mobil tepsi `sizes` 50vw | `d215d15` | K-107 |
| 4.2 | Yeni sekme linkleri ekran okuyucuya bildirilir | `de1a7ea` | — |
| 4.3 | Açık/kapalı durumu `role="status"` | `caea394` | — |
| 4.5 | Link okları `aria-hidden` | `566a935` | — |
| 5.1 | `--max-warnings=0`; OG `<img>` istisnası yapılandırmada | `5929332` | — |
| 5.2 | `/_kit` silindi | `c9c5433` | — |
| 5.3 | `NEXT_PUBLIC_SITE_URL` | `1827ccc` | — |
| 5.4 | OG fontu repoda (`src/assets/fonts`, OFL) | `aefce72` | — |
| 5.6 | Güvenlik başlıkları, `x-powered-by` kapalı | `50d9620` | — |
| 6 | robots + sitemap | `5e95f91` | K-108 |
| 6 | canonical | `58418c1` | — |
| 6 | 404 sayfası | `0335b4c` | — |
| 6 | kök hata sınırı (`error.tsx`) | `6cb53e9` | — |
| 6 | ürüne özel OG görseli | `5e95ef4` | K-109 |
| 7.1a | Vitest, 41 birim testi | `65dcf95` | K-110 |
| 7.2 | GitHub Actions CI | `b62bfc5` | K-110 |
| 7.1b | Playwright duman testleri (zaman kaldı, en sona) | `f0ff69e` | K-111 |
| 8 | README, `data-*` sözlüğü, ekran görüntüleri, `scripts/blur.mjs`; 3.2 `sharp` notu. 29.09: README sadeleşti, sözlük ve teknik ayrıntılar `docs/TEKNIK.md`'ye taşındı | `a923edb` | — |

**Kabul** (yerel üretim derlemesi; headless Edge + CDP betikleri ve Playwright)

- [x] Denetimler:
  - `pnpm lint` 0 uyarı, `typecheck`, `prettier --check`, `build`;
  - `pnpm test` 41/41;
  - `pnpm test:e2e` 16 geçti, 2 atlandı (mobil menü masaüstünde, fare lupu mobilde).
- [x] A.1:
  - `viewport` meta `maximum-scale=1, user-scalable=no`;
  - normal kaydırma ve lup basılı tutması çalışıyor;
  - Lighthouse Accessibility 94 (ana sayfa) / 95 (Tektaş). Yalnız `meta-viewport` düşüyor, bilinçli (K-104).
- [x] A.2:
  - açılışta lup yok, linklerde el imleci;
  - fareyle sürükleyince tutma iptal, metin seçiliyor;
  - 2 sn basılı: yay dolar (saat 12'den saat yönünde), lup açılır, imleç gizlenir;
  - basılıyken gezdirme: link üstünde küçülmüyor, footer'da halkaya dönüyor;
  - bırakınca kapanıyor, hücre üstünde bırakınca sayfa değişmiyor, ardından kısa tık ürün sayfasını açıyor;
  - sağ tık ve `blur` iptal ediyor;
  - dokunmatikte 180 ms değişmedi.
- [x] A.3:
  - masaüstünde "SOL TIKA 2 SN…", dokunmatikte (390 / 768) "BİR PARÇAYA BASILI TUTUN…";
  - `grep -rn "İMLEC" src` boş;
  - bilgi satırları lup klonunda yok;
  - 390px'te taşma yok.
- [x] 2.1:
  - dinleyici listesi: lup kapalıyken pasif olmayan `touchmove` yok, açıkken var, kalkınca gidiyor;
  - lup açıkken sayfa kaymıyor, kapalıyken kayıyor.
- [x] 2.2: 4× yavaşlatılmış CPU'da ilk dokunuşun işlenmesi 1 ms. İlk etkileşim doğrudan basılı tutma olunca lup içerikle açılıyor.
- [x] 2.4–2.6:
  - Nav gizliyken odak gelince iniyor;
  - menüde Tab panelde kalıyor, Escape odağı MENÜ'ye döndürüyor, menüden bölüme gidince odak bölümde;
  - `/#magaza` doğrudan açılınca bölüm başı Nav'ın hemen altında (96 / 64px).
- [x] 2.7: JS 5 sn gecikince hero ve levha öğeleri yedekten sonra hiç gizlenmiyor (en düşük opaklık 1).
- [x] 2.8: İki hücreye art arda tıklama: ilk geçiş tamamlanıyor, ikinci yutuluyor, sonraki tık çalışıyor.
- [x] Regresyon:
  - sayfa geçişleri (View Transition, desteksiz tarayıcı, şerit);
  - şerit sürükleme ve yapışma;
  - hızlı kaydırma, pin, reduced motion;
  - 360–1920 arası 8 genişlikte yatay taşma yok;
  - mobil menü ve dokunma hedefleri;
  - yapı denetimi (tek main, başlık sırası, adsız link yok);
  - konsol hataları temiz.
- [x] SEO:
  - `/robots.txt` (kapalı, önizleme botları hariç), `/sitemap.xml`, canonical;
  - `/parca/yok` 404 ve `noindex`;
  - ürün OG görselleri 220–355 KB.
- [x] JS ilk yük (eski tarayıcı yamaları hariç, gzip): ana sayfa 155.9 KB. `master` aynı yöntemle 151.7 KB; bütçe 180 KB.
- [ ] Lighthouse Performance ≥ 90: yerelde 89 (ana sayfa) / 90 (Tektaş). LCP yerelde hâlâ ölçülemiyor (K-102); Vercel önizlemesinde ölçülecek.
- [ ] Gerçek cihaz (aşağıda).

**Yapılamayan / kısmen**

- 3.1'in ek önerisi yapılmadı: kaynak JPEG'lerin mozjpeg ile yeniden sıkıştırılması. Kaynak görsel kalitesini değiştirir. Site artık WebP/AVIF sunuyor, fark yalnızca depo boyutunda.
- Başarısız olup geri alınan commit yok.
- `c9c5433` (5.2) commit'lendikten sonra typecheck yerelde eski bir `next dev` çıktısı (`.next/dev/types`) yüzünden düştü. Kod değil, silinen rotaya işaret eden üretilmiş dosyaydı; silinince aynı commit temiz geçti. CI temiz checkout'ta çalıştığı için etkilenmez.

**PR, CI ve önizleme** (29–30.09)

- PR [cankafali/lup#1](https://github.com/cankafali/lup/pull/1): `feat/lup-basili-tut` → `master`. Açık, çakışma yok, henüz merge edilmedi.
- CI:
  - İlk çalışmada `test:e2e` adımı 8 dakikadan uzun sürüp iptal edildi. Sebep test sunucusunun `pnpm start` sarmalayıcısıydı: kapanışta süreç ağacı ölmüyordu.
  - Düzeltme `7d28eac` (K-112): doğrudan `next start`, süre sınırları, canlı test logu, hata raporu çıktısı. Sonrasında tüm iş 1 dakikada yeşil.
- Vercel GitHub'a bağlı, her push'ta önizleme dağıtımı yapıyor. Dal önizlemesi: https://lup-git-feat-lup-basili-tut-talas2.vercel.app
  - "Vercel Authentication" ile korunuyor. PageSpeed ve kuyumcu için Deployment Protection kapatılmalı ya da paylaşılabilir link verilmeli.
- 30.09: README'deki ajan anlatımı kısaltıldı. `.claude/` (yapay zekâ asistanının yerel ayarları) repodan çıkarılıp yok sayıldı.

**Kullanıcıya bırakılanlar** (dış bilgi ya da karar gerekiyor)

- 1.1: gerçek telefon ve WhatsApp numarası. Derleme uyarıyor. Aşama 2'deki "yer tutucu yok" ifadesi bu iki değer için doğru değildi.
- 1.2: adres, koordinat, Instagram hesabı ve saatlerin (Pazartesi kapalı mı?) kuyumcudan teyidi.
- 1.3: temsili ölçüler (K-086) ve kroki (K-094). Gelmeden `indexable: true` yapılmamalı.
- 1.4: Vercel yayını, önizlemede mobil Lighthouse ve gerçek cihaz testi. Bu turda eklenen kontroller:
  - iOS Safari'de basılı tutunca sayfanın kaymadığı (2.1, dinleyici tutma anında ekleniyor);
  - WhatsApp'ta ürün linki önizlemesi (OG görseli 220–355 KB);
  - masaüstünde 2 sn basılı tutma hissi.
- 3.3: klonu bölümlerle sınırlama (büyük refaktör).
- 9: CMS, çoklu dil, analitik, kroki.
- 8 notu: şartname (`§` atıfları) repoda değil. Repo herkese açıksa belgeyi eklemek kullanıcının kararı; `docs/TEKNIK.md` atıfların neye işaret ettiğini anlatıyor.
- 5.6 notu: CSP ayrı adım. Satır içi `INTRO_SCRIPT` ve JSON-LD için hash ya da nonce gerekir.

**Talimat gereği atlananlar ve listede olmayanlar**

- Atlandı:
  - 4.1: A.2 ile gereksiz;
  - 5.5: `useLoupe` ayrıştırma, büyük refaktör.
- Uygulama listesinde yoktu, dokunulmadı:
  - 3.6: bundle analyzer, Lighthouse CI;
  - 4.4: şerit ok düğmeleri;
  - 5.7: notlar;
  - 6.7: JSON-LD `priceRange` / `hasMap`. `priceRange` fiyat dili, §20'ye aykırı.
- 7.3: dal akışı bu dalla başladı.
