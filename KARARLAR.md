# KARARLAR

Şartnamede cevabı olmayan ya da şartnameden sapmayı gerektiren kararlar. Her kayıt: tarih · karar · gerekçe · geri alma yolu.

---

### K-001 · 2026-09-24 · Proje mevcut `lup/` klasörünün köküne kuruldu

- **Karar:** `pnpm create next-app lup` iç içe `lup/lup/` üretmesin diye iskelet geçici bir klasörde oluşturulup mevcut `Desktop/lup/` köküne taşındı.
- **Gerekçe:** Çalışma klasörü zaten `lup`; şartname "proje klasörünün içinde çalış" diyor.
- **Geri alma:** Gerekmez; klasör yapısı şartnamedeki §4 ile aynı.

### K-002 · 2026-09-24 · pnpm global olarak kuruldu

- **Karar:** Makinede pnpm yoktu; `npm install -g pnpm` ile kuruldu (pnpm 12.6.0). `package.json`'da `packageManager: pnpm@12.6.0`.
- **Gerekçe:** Şartname paket yöneticisi olarak pnpm istiyor; `corepack enable` Program Files altında yönetici izni ister.
- **Geri alma:** `npm uninstall -g pnpm`.

### K-003 · 2026-09-24 · Next.js 16.3.6

- **Karar:** `create-next-app@latest` Next 16.3.6 kurdu; olduğu gibi bırakıldı.
- **Gerekçe:** Şartname "Next.js 15+" diyor; 16 bu aralıkta.
- **Geri alma:** `pnpm add next@15 eslint-config-next@15`.

### K-004 · 2026-09-24 · `lint` script'i `eslint .`

- **Karar:** Şartnamedeki `"lint": "next lint"` yerine `"lint": "eslint ."`.
- **Gerekçe:** Next 16'da `next lint` komutu kaldırıldı (`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`). ESLint doğrudan, create-next-app'in ürettiği flat config (`eslint.config.mjs`, `next/core-web-vitals` + `next/typescript`) ile çalışır.
- **Geri alma:** Next 15'e dönülürse script `next lint` yapılabilir.

### K-005 · 2026-09-24 · `tokens.css` Aşama 0'da eklendi

- **Karar:** `src/styles/tokens.css` §5.2'deki içerikle birebir Aşama 0'da oluşturuldu; `globals.css` yalnızca onu import ediyor.
- **Gerekçe:** Aşama 0 kabul kriteri "boş sayfa kâğıt renginde"; kâğıt rengi sabit hex olarak başka bir yere yazılamaz (kural 5).
- **Geri alma:** Gerekmez.

### K-006 · 2026-09-24 · `noindex` Aşama 0'dan itibaren açık

- **Karar:** `layout.tsx` metadata'sında `robots: { index: false, follow: false }` şimdiden var. Aşama 8'de `site.ts`'teki `indexable` bayrağına bağlanacak.
- **Gerekçe:** Vercel önizlemesi erken açılırsa bile site indekslenmesin (§18, Asla listesi).
- **Geri alma:** Bayrak `indexable: true` yapılınca kalkar.

### K-007 · 2026-09-24 · create-next-app varsayılanları temizlendi

- **Karar:** `public/*.svg` (Next/Vercel logoları), `src/app/favicon.ico`, şablon sayfa ve koyu tema CSS'i silindi. `layout.tsx`'teki `next/font/google` Geist yüklemesi kaldırıldı; fontlar Aşama 1'de §6'daki gibi `geist` paketiyle bağlanacak.
- **Gerekçe:** Vercel üçgeni favicon'u pitch sitesinde görünmesin; koyu zemin Asla listesinde. Favicon Aşama 8'de (§18) SVG olarak gelecek.
- **Geri alma:** Gerekmez.

### K-008 · 2026-09-24 · create-next-app'in `AGENTS.md` / `CLAUDE.md` dosyaları korundu

- **Karar:** Next 16'nın ürettiği `AGENTS.md` (ajanlara "Next 16 dokümanlarını `node_modules/next/dist/docs/` içinden oku" notu) ve onu içeren `CLAUDE.md` silinmedi.
- **Gerekçe:** `next dev` bu bloğu her çalıştırmada yeniden yazıyor; silmek yalnızca kirli çalışma ağacı üretir.
- **Geri alma:** İki dosyayı silmek.

### K-009 · 2026-09-24 · Prettier Tailwind eklentisi `globals.css`'e bağlandı

- **Karar:** `.prettierrc.json` → `prettier-plugin-tailwindcss`, `tailwindStylesheet: ./src/app/globals.css`. `.prettierignore`: `.next`, `node_modules`, `pnpm-lock.yaml`, `public`.
- **Gerekçe:** Tailwind v4'te `tailwind.config` olmadığı için eklenti token'ları CSS giriş dosyasından okur.
- **Geri alma:** Dosyaları silmek.

### K-010 · 2026-09-24 · `typecheck` script'i `next typegen && tsc --noEmit`

- **Karar:** Şartnamedeki `tsc --noEmit` önüne `next typegen` eklendi.
- **Gerekçe:** Next 16'nın global `LayoutProps` / `PageProps` tipleri `.next/types` altında üretiliyor; temiz klonda `tsc` tek başına `Cannot find name 'LayoutProps'` hatası veriyor. `next typegen` build yapmadan yalnızca bu tipleri üretir (Next dokümanındaki önerilen kullanım).
- **Geri alma:** Script'i `tsc --noEmit` yapmak; o zaman typecheck `pnpm build`'den sonra çalıştırılmalı.

---

## Aşama 1

### K-011 · 2026-09-24 · Figma'ya bu aşamada bakılamadı

- **Karar:** Aşama 1 yalnızca şartnameden uygulandı.
- **Gerekçe:** Figma MCP, Starter planın çağrı limitine takıldı. Çelişkide zaten şartname kazanıyor.
- **Geri alma:** Limit açılınca `00 — Tasarım Sistemi` sayfasıyla kıyas yapılıp farklar buraya yazılacak.

### K-012 · 2026-09-24 · Display boyutları token'da doğrudan `clamp()`

- **Karar:** `--text-display-xl/l/m` değerleri §6'daki `clamp()` ifadeleri (1440 değeri yorumda). Ayrı `.text-display-*` CSS sınıfı yazılmadı. Satır yüksekliği, harf aralığı ve ağırlık Tailwind v4'ün `--text-*--line-height/--letter-spacing/--font-weight` alt token'larıyla verildi. 1440 referans değerleri TS tarafında `DISPLAY_REF`.
- **Gerekçe:** §5.2 (px) ile §6 (clamp) aynı sınıf adını tanımlıyor. Tek tanım yeri token olsun, Tailwind'in ürettiği `text-display-*` ile çakışan ikinci bir sınıf olmasın.
- **Geri alma:** Token'ları px yapıp §6'daki sınıfları `@layer utilities` içine eklemek.

### K-013 · 2026-09-24 · Duyarlı grid CSS değişkenleriyle

- **Karar:** `--grid-cols` (12/8/4), `--grid-margin`, `--grid-gutter` `tokens.css`'te `:root` üzerinde kırılımlara göre değişiyor. `container-lup` ve `grid-lup`, `@utility` olarak `globals.css`'te. İçerik genişliği için `--grid-max: 1312px` eklendi.
- **Gerekçe:** §7'deki üç düzen tek sınıf çiftiyle çalışsın; §7'deki kod 12 kolona sabitti.
- **Geri alma:** Gerekmez.

### K-014 · 2026-09-24 · `MonoLabel`'da `text-transform` yok

- **Karar:** Mono etiket metinleri `src/content`'te büyük harfle yazılır; bileşen `uppercase` uygulamaz. `Button` ve `Stamp` `uppercase` uygular (içlerinde birim yok).
- **Gerekçe:** Şartnamedeki Mono örnekleri birimleri küçük yazıyor (`Ø 5.1 mm`, `3.4 g`, `0.50 ct`, `No. 01`). `uppercase` bunları `MM`, `G`, `CT`, `NO.` yapardı. `i → İ` dönüşümü `lang="tr"` ile doğru; `/_kit`'te doğrulandı.
- **Geri alma:** `MonoLabel`'a `uppercase` eklemek (birimler bozulur).

### K-015 · 2026-09-24 · `#lup-content` bir `<div>`; `<main>` sayfalarda

- **Karar:** `layout.tsx`: `<div id="lup-content">` içinde `GridLines` + sayfa. Sayfalar kendi `<main>`'ini render eder. Nav ve Footer (Aşama 2) aynı sarmalayıcının içinde, `<main>`'in dışında olacak.
- **Gerekçe:** §9.2 `<main id="lup-content">` diyor ve Nav'ın klonun içinde olmasını bekliyor (`data-loupe-hide`). §16 ise `header > nav`, `main > section`, `footer` yer işaretleri istiyor. Nav ile Footer `<main>` içinde olursa banner/contentinfo yer işareti olmazlar.
- **Geri alma:** `<div>`'i `<main>` yapmak.

### K-016 · 2026-09-24 · `#lup-content` üzerinde `overflow-x: clip`

- **Karar:** Kenara taşan eksen ve çizgiler yatay kaydırma üretmesin diye sarmalayıcı yatayda kırpıyor.
- **Gerekçe:** `/_kit`'te 390px'te Lens eksenleri sayfayı 473px'e taşırdı. Mobilde 10× lupu (350px + 40px eksen taşması) aynı sorunu yaşar. `clip` kaydırma kabı oluşturmaz, `position: sticky` bozulmaz.
- **Geri alma:** Sınıfı kaldırmak.

### K-017 · 2026-09-24 · `GridLines` z-index `-10`

- **Karar:** Şartnamedeki `z-index: 0` yerine `-z-10`.
- **Gerekçe:** `z-index: 0` olan sabit bir katman, konumlanmamış normal akış içeriğinin (fotoğraflar dahil) **üstüne** boyanır. Amaç "sayfanın arkasında". Negatif z, kök kâğıt zemininin üstünde, içeriğin altında kalır.
- **Geri alma:** `z-0` yapıp içeriği `relative z-10` bir katmana almak.

### K-018 · 2026-09-24 · `DimensionLine` ve `Callout` kendi katmanı olan bindirmeler

- **Karar:** İkisi de konumlu bir kapsayıcıyı dolduran katman: `viewBox` prop'u + `preserveAspectRatio="none"` SVG, HTML etiketler ve noktalar yüzde ile konumlanıyor. Çentik (±5) viewBox biriminde; çizgi `non-scaling-stroke` ile her ölçekte 1px. `labelSide` varsayılanı: yatay çizgide üst, dikey çizgide sağ. Uzatma çizgileri etiketin karşı yönünde. `DimensionLine` `aria-hidden` (§16: ölçü bilgisi veri satırında metin olarak var). `Axis` ise tek bir `<line>`; bir `<svg>` içinde kullanılır.
- **Gerekçe:** §8.3 "SVG + mutlak konumlu span, konum yüzde" diyor. `none` eşlemesi ile yüzde konumlar birebir örtüşür. Fotoğraf üstü (`slice`) bindirmeler için `useOverlayPoint` Aşama 2'de `PhotoOverlay` ile gelecek.
- **Geri alma:** Gerekmez.

### K-019 · 2026-09-24 · `Headline` girinti ve bindirme birimleri

- **Karar:** `indent: "cols-N"` = N kolon + N ara, başlığın genişliğine göre `calc()`. Başlık tam içerik genişliğinde durmalı. Sayı olarak verilen `indent` ve `overlap` 1440 referansında px; başlık boyutuyla orantılı ölçeklenir (`--hl-u`). Satır maskesi (`overflow: hidden`) Aşama 5'te animasyonla birlikte eklenecek; şimdilik `data-headline-mask` / `data-headline-line` işaretleri var.
- **Gerekçe:** Akışkan başlıkta sabit px bindirme dar ekranda satırları üst üste bindirir. Maske statik halde Türkçe aksanları (İ, Ğ) ve alt uzantıları (ş, ç, g) keserdi.
- **Geri alma:** Gerekmez.

### K-020 · 2026-09-24 · `PlateFrame` ayrıntıları

- **Karar:** Kesim izleri graphite, bölüm kutusunun (tam genişlik) köşelerine göre konumlanıyor. Levha no, üst çizginin 24px altında, içerik sağ kenarına hizalı. `header={false}` ile çizgi ve no gizlenebiliyor (hero'da Nav satırı üstleniyor).
- **Gerekçe:** Şartname kesim izinin rengini ve levha no'nun dikey konumunu vermiyor; "1px çizgi = graphite" kuralı ve kesim izi hizası seçildi.
- **Geri alma:** Figma kıyasında (K-011) güncellenir.

### K-021 · 2026-09-24 · `Lens` ölçekleme, eksen ve etiket

- **Karar:** İç çap `min(Dpx, D/1440 × 100vw)`. Eksen taşması halkanın dış kenarından ölçülüyor (`axes: true` → 24px, ya da `{h, v}`). `10×` etiketi `outside`: dış çemberin 45° noktasının dışında; `inside`: iç çemberin 45° noktasının içinde (10× bölümü). Etiket `data-loupe-hide`.
- **Gerekçe:** §8.7 "responsive'de ölçeklenir" diyor ama yöntemi vermiyor. Eksenin hangi kenardan taştığı da belirtilmemiş.
- **Geri alma:** Gerekmez.

### K-022 · 2026-09-24 · `Button` oku bileşende

- **Karar:** `→` bileşen tarafından ayrı bir `<span>` olarak eklenir (hover'da 6px kayar). İçerik metinlerine ok yazılmaz. `variant="link"`: Mono 10px, yalnızca metin altı çizili. İç rota (`/…`) `next/link`, diğerleri `<a>`, `external` → `target="_blank" rel="noopener noreferrer"`.
- **Gerekçe:** §8.8 oku ayrı hareket eden bir öğe olarak tanımlıyor.
- **Geri alma:** Gerekmez.

### K-023 · 2026-09-24 · Damga açısı metinden türetiliyor

- **Karar:** Açı, `seed` prop'undan ya da verilmezse damga metninden hash ile −1.5° … +1.5° (0.1° adım). `rotate` prop'u sabit açı verir (sertifikadaki −2°, +1°, −1°).
- **Gerekçe:** §8.1 "id'den türetilen deterministik değer". Damganın ayrı bir id'si yok.
- **Geri alma:** Gerekmez.

### K-024 · 2026-09-24 · `/_kit` rotası `%5Fkit` klasöründe

- **Karar:** Kit sayfası `src/app/%5Fkit/page.tsx`. Prod'da `notFound()`. Kit'teki örnek metinler sayfanın içinde (`src/content`'te değil).
- **Gerekçe:** Next'te `_` ile başlayan klasörler özel klasördür, rota üretmez (`%5F` URL'de `_` olur). Kit geçici bir geliştirme aracı, site içeriği değil.
- **Geri alma:** Kit işi bitince klasör silinir.

### K-025 · 2026-09-24 · Genel `:focus-visible` stili

- **Karar:** `globals.css` `@layer base`: tüm odaklanabilir öğelerde 2px graphite outline, 3px offset (§8.8, §16). Tepsi hücresi (Aşama 2) kendi `outline-offset: -2px` değerini verir.
- **Gerekçe:** Aynı kural hem Button'da hem erişilebilirlik bölümünde geçiyor; tek yerde tanımlandı.
- **Geri alma:** Gerekmez.
