# Teknik notlar

Geliştiriciler için ayrıntılar. Genel bakış, kurulum ve içerik düzenleme için [README](../README.md).

## Yığın

- Next.js 16 (App Router, Turbopack), React 19.2, TypeScript (strict), Tailwind CSS v4.
- Animasyon: GSAP 3 (ScrollTrigger, DrawSVG) ve Lenis (yumuşak kaydırma).
- Test: Vitest ve Playwright. Paket yöneticisi pnpm.

## Kod kuralları

- Türkçe metin yalnızca `src/content/`'te.
- Renk, yazı, grid ve süre değerleri yalnızca `src/styles/tokens.css` ve `src/lib/tokens.ts`'te.
- Şartnameden sapan her karar [`KARARLAR.md`](../KARARLAR.md)'de: tarih, karar, gerekçe, geri alma.
- Kod yorumlarındaki `§9.2` gibi atıflar uygulama şartnamesinin bölümlerine (şartname repoda değil). `K-…` atıfları `KARARLAR.md`'ye.
- Animasyon ve lup kodu hidrasyondan sonra ayrı pakette yüklenir (`motion/lazy.tsx`, `loupe/lazy.tsx`). İlk yük JS bütçesi 180 KB gzip; şu an ≈ 156 KB.

## Lup nasıl çalışır

- `#lup-content` (Nav, sayfa, footer) bir kez klonlanır. Klon, lupun içinde 3.3× ölçekli bir sahnede durur.
- Lup hareket ettikçe yalnızca sahnenin `transform`'u değişir. Konum GSAP ticker'ında, Lenis ile aynı saatte yumuşatılır.
- Klon fontlar ve görseller yüklendikten sonra, tarayıcı boştayken kurulur; boyut ve sayfa değişiminde yenilenir. Dokunmatik cihazda ilk dokunuştan sonra kurulur.
- Lup ilk kez açılınca klondaki görseller yüksek çözünürlüklü, optimize kopyalarına geçer (`lib/hires.ts`).
- Kod: `src/components/loupe/` (`useLoupe.ts` davranış, `cloneContent.ts` klon, `Loupe.tsx` görünüm).

| Durum | Fare / kalem | Dokunmatik |
|---|---|---|
| Kapalı | Normal imleç; linkler, metin seçimi, sürükleme her zamanki gibi | — |
| Basılı tutarken | Dış halka ve 2 sn'de dolan kırmızı yay; 10px hareket, sağ tık, pencereden çıkış iptal eder | 180 ms |
| Açık | İmleç gizli, lup her yerde büyütür; `data-loupe-off` alanlarında yalnızca halka | Parmağın 60px üstünde; sayfa kaymaz |
| Bırakınca | Kapanır; izleyen tıklama yutulur (link açılmaz) | Aynı |

Süreler ve boyutlar `LOUPE` token'ında (`src/lib/tokens.ts`).

## `data-*` öznitelik sözlüğü

Davranış taşıyan öznitelikler; yeni bölüm eklerken bakılacaklar bunlar. Bileşen içi stil kancaları (`data-dim-*`, `data-callout-*` gibi) bileşenlerinin içinde kalır.

**Lup**

| Öznitelik | Nereye | Ne yapar |
|---|---|---|
| `data-loupe-hide` | Klonda olmaması gereken öğe (Nav, "10×" etiketleri, kullanım bilgisi, atlama linki) | Klondan silinir |
| `data-loupe-off` | Büyütülmeyecek alan (Nav, footer, mobil menü) | Basılıyken lup yalnızca dış halka |
| `data-loupe-sync` | Kaydırmaya bağlı (scrub/pin) animasyonlu öğe | Satır içi stili her karede klona aynalanır |
| `data-loupe-sticky` | `position: sticky` öğe (sertifika) | Klonda kaydırmaya göre transform ile taşınır |
| `data-loupe-scroll` | Kendi içinde kayan kap (diğer parçalar şeridi) | Yatay kaydırma klona aynalanır |
| `data-hires` | `<img>` | Lup ilk açılınca klondaki görsel bu adrese geçer |
| `data-loupe` | Lup kökü | `data-state` (off / idle / active), `data-mode` (mouse / touch), `data-ready` (clone / ring) |

`<html>` üzerindeki durumlar:

- `loupe-open` sınıfı: lup açık; imleç gizli, metin seçimi kapalı.
- `data-loupe-holding`: fareyle basılı tutuluyor.
- `data-loupe-touch`: dokunmatik lup açık.

**Giriş animasyonu**

| Öznitelik | Ne yapar |
|---|---|
| `data-intro` | Bölge JS animasyonu kurulana kadar gizli (`html.js-anim:not(.anim-ready)`). JS 4 sn'de gelmezse gizleme kalkar, `intro-skipped` eklenir ve giriş animasyonu hiç kurulmaz. |
| `data-intro-keep` | `data-intro` içinde gizlenmeyen kısım: ilk boyamada CSS ile girer (hero fotoğrafı, başlık, not). LCP JS'i beklemez. |

**Çizim ve bindirme**

| Öznitelik | Ne yapar |
|---|---|
| `data-draw="axis \| outline \| detail"` | Levha çiziminde sıra: eksenler → dış kontur → iç detay (PlateMotion) |
| `data-plate`, `data-plate-window` | Teknik levha ve mobildeki penceresi; pencereler ekrana girince çizilir |
| `data-plate-note`, `data-plate-meta`, `data-plate-guide` | Levhada son açılan notlar, antet ve lupa giden kılavuz çizgi |
| `data-dimension` (+ `data-animate`) | Ölçü çizgisi; `data-animate` ile girişte çizilir |
| `data-callout` | Nokta + çizgi + etiketli çağrı notu |
| `data-lens` | Statik lup dairesi (fotoğraf) |
| `data-photo-overlay`, `data-photo-inner`, `data-photo-frame` | Fotoğraf ve ona kilitli bindirme kutusu (object-fit: cover hesabı CSS'te) |
| `data-grid-lines` | Zemindeki sabit kolon çizgileri; klonda mutlak konuma geçer |

**Bölüm kancaları (`components/motion/`)**

| Öznitelik | Ne |
|---|---|
| `data-hero-*` | Hero parçaları |
| `data-tray`, `data-tray-cell` | Vitrin tepsisi ve hücresi |
| `data-part-photo` | Sayfa geçişinde yerinde kalan fotoğraf |
| `data-makro-*` | 10× bölümü |
| `data-atolye-photo`, `data-count` | Atölye fotoğrafı ve sayaç |
| `data-compare`, `data-compare-block` | Mağaza 10× ↔ 1:1 karşılaştırması |
| `data-anim-label` | Bölüm etiketi |
| `data-headline-mask`, `data-headline-line` | Başlık maskesi |
| `data-certificate`, `data-cert-row`, `data-stamp` | Sertifika girişi |
| `data-signature` | İmza |
| `data-status-dot` + `data-open` | Açık/kapalı nabzı |
| `data-dragging` | Şerit sürüklenirken (JS koyar) |

Diğer: `data-lenis-prevent-horizontal` (Lenis yatay kaydırmaya karışmaz).

## Görseller

- Kaynaklar `public/images`'ta. Sayfada `next/image` ile, lupta `/_next/image?…&w=1920` ile WebP/AVIF olarak sunulur.
- Bulanık yer tutucular `src/content/blur.ts`'te; `node scripts/blur.mjs` yeniden üretir (Next'in getirdiği `sharp` ile, ek bağımlılık yok).
- Paylaşım görselleri (`src/app/**/opengraph-image.tsx`, ortak parçalar `src/lib/og.tsx`) derlemede ya da ilk istekte üretilir. Fontlar `src/assets/fonts`'ta (Geist, OFL lisansı).

## Kendi sunucunda çalıştırma

- `next start`, Docker ya da VPS'te görsel optimizasyonu `sharp` ister.
- `pnpm-workspace.yaml`'da `sharp`'ın kurulum betiği kapalı (`allowBuilds: sharp: false`); hazır ikili paketlerle çalışıyor. Hedef platformda `/_next/image` hata verirse `sharp: true` yapıp yeniden kur.
- Adres Vercel dışında `NEXT_PUBLIC_SITE_URL` ile verilir.

## Testler

| Komut | Ne |
|---|---|
| `pnpm test` | Vitest birim testleri (`src/**/*.test.ts`): açık/kapalı hesabı, saat eki, çizim geometrisi, bindirme hesabı |
| `pnpm test:e2e` | Playwright duman testleri (`e2e/`): önce `pnpm build`. Yerelde tarayıcı indirmeden `PW_CHANNEL=msedge pnpm test:e2e` |

GitHub Actions her push (master) ve PR'da lint, typecheck, biçim, birim testi, derleme ve uçtan uca testleri çalıştırır (`.github/workflows/ci.yml`).
