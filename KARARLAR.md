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

---

## Aşama 2

### K-026 · 2026-09-24 · Fotoğraf bindirmesi CSS ile (`PhotoOverlay`)

- **Karar:** §10'daki "SVG `xMidYMid slice` + `useOverlayPoint`" kalıbı yerine: `PhotoOverlay` bir boyut konteyneri (`container-type: size`). Görselin `cover` ile kapladığı dikdörtgen `cqw/cqh` birimleriyle CSS'te hesaplanıyor; bindirmeler (`DimensionLine`, `Callout`, eksenler) bu kutuya görselin piksel uzayında (`viewBox = [w, h]`) yerleşiyor. `object-position` `--photo-x/--photo-y` (0–1) ile veriliyor ve kutu hesabına aynen giriyor.
- **Gerekçe:** Aynı kilidi JS'siz ve layout okumasız sağlıyor; SSR'da doğru, lup klonunda da doğru (§9.2). SVG `preserveAspectRatio` yalnızca `xMin/xMid/xMax` destekler; mobil hero'daki `72% 50%` (§15) gibi değerlerde kilit bozulurdu, bu yöntemde bozulmuyor. 1280, 1440, 1680 ve 1920'de taş işaretinin beklenen konumdan sapması 0px ölçüldü.
- **Geri alma:** `PhotoOverlay`'i §10'daki SVG kalıbına çevirmek.

### K-027 · 2026-09-24 · Hero kılavuz çizgisi: `HeroGuide` + `coverPoint`

- **Karar:** Lup–taş çizgisi hero'ya göre konumlanan ayrı bir SVG (§10.1). Taş ucu `coverPoint()` ile (PhotoOverlay'le aynı formül), lup ucu lupun kenarındaki en yakın nokta. İkisi de yalnızca `ResizeObserver` tetiklenince ölçülüyor. `useOverlayPoint` adıyla ayrı bir kanca yazılmadı; tek kullanıcısı bu bileşen.
- **Gerekçe:** Çizginin iki ucu farklı düzenlere bağlı: lup grid'e, taş fotoğraf kırpmasına. Ölçüm şart. 1280–1920'de çizgi ucu ile taş işareti arasındaki fark 0px.
- **Geri alma:** Gerekmez.

### K-028 · 2026-09-24 · Hero görseli `loading="eager"` + `fetchPriority="high"`

- **Karar:** §13/§17'deki `priority` yerine bu iki öznitelik.
- **Gerekçe:** Next 16'da `priority` kullanımdan kalktı (`preload` geldi). Doküman `fetchPriority` ile `preload`'ı birlikte önermiyor; şartname `fetchpriority="high"` istiyor.
- **Geri alma:** `preload` prop'u.

### K-029 · 2026-09-24 · Tektaş tepsi ölçüsü taşın üstüne taşındı

- **Karar:** `Ø 5.1 mm TAŞ` ölçüsü `51→152, y 196` yerine `178→271, y 228` (hücrenin 440×550 uzayı).
- **Gerekçe:** Şartnamenin verdiği `73% 55%` kırpmasıyla taş hücrede x 178–272, y ≈ 290'da (hücre görüntüsü ızgarayla ölçüldü). Verilen koordinatlar taşın sol üstünde, boşlukta kalıyordu. Yeni değerler, hero'daki taş ölçüsünün (görselde `805→935, y 318`) aynı kırpmadan geçirilmiş hali: ölçü, hero'daki gibi taşın hemen üstünde.
- **Geri alma:** `products.ts`'te `overlay` alanı.

### K-030 · 2026-09-24 · Atölye başlığında bindirme 11px

- **Karar:** "üç kuşak." satırı için `overlap: 11`. "88px alta" ifadesi "ikinci satır birincinin üstünden 88px aşağıda başlar" diye okundu: satır kutusu 0.95 × 104 = 98.8 → 98.8 − 88 ≈ 11.
- **Gerekçe:** 88px bindirmede de 34px'te de (Vitrin'deki değer) "üç" "tezgâh,"ın g kuyruğuna biniyor. Bu satır 338px içeriden başlıyor ve tam g'nin altına denk geliyor. Vitrin'deki 34px ise orada çakışmıyor ve korundu.
- **Geri alma:** `Atolye.tsx`'te `TITLE_LAYOUT`.

### K-031 · 2026-09-24 · Burma ve Su Yolu'nda ölçü etiketi altta

- **Karar:** `Product.overlay`'e isteğe bağlı `labelSide` eklendi. Burma (`y 385`) ve Su Yolu (`y 418`) için `below`.
- **Gerekçe:** İki ölçü de parçanın altında. Üstteki etiket parçanın alt kenarına biniyordu (Aşama 1'deki not).
- **Geri alma:** Alanı kaldırmak (varsayılan: yatayda üst).

### K-032 · 2026-09-24 · Bölüm ritmi ve boşluklar

- **Karar:** Bölüm etiketi → başlık arası 24px. İçerik kadar uzayan bölümlerin (Vitrin, Atölye, Mağaza) alt boşluğu 64px. Hero başlığı alttan konumlanıyor (`pb-14`, 1440×900'de "Yakından" üstten 549px; şartname ~548). Hero'nun sağ alt notu alttan 48px.
- **Gerekçe:** Şartname üst boşlukları veriyor; etiket–başlık arası ve alt boşluklar yok. Hero 760–1000px arasında değiştiği için başlık üstten sabitlenemez.
- **Geri alma:** Figma kıyasında (K-011) güncellenir.

### K-033 · 2026-09-24 · "TEMSİLİ GÖRSEL" yerleri

- **Karar:** Hero: koordinat satırının sağında, levha no'nun altında. Vitrin: tepsi altı satırının ortasında. 10×: sol altta (§10.3). Atölye: fotoğrafın sol altında (§10.4).
- **Gerekçe:** §13 "fotoğraf olan her bölümde bir yerde" diyor; Hero ve Vitrin için yer belirtilmemiş.
- **Geri alma:** Gerekmez.

### K-034 · 2026-09-24 · Hero örnek lupu ve açıklaması

- **Karar:** Lup `Lens`'in kendi `10×` etiketi olmadan çiziliyor; `10×` soldaki açıklamanın ilk satırı. Açıklama lupa göre dikeyde ortalı, sağ kenarı lupun sol kenarından 24px uzakta.
- **Gerekçe:** §10.1 `10×`'i açıklamanın içinde veriyor; ikinci bir `10×` tekrar olurdu. Dikey konum belirtilmemiş.
- **Geri alma:** Gerekmez.

### K-035 · 2026-09-24 · 10× bölümü 1440×900 tuval üzerinde

- **Karar:** Lup, notlar ve çap ölçüsü, içerik kabıyla aynı genişlikte (≤ 1440) ve `aspect-[1440/900]` bir tuvalde. Tuval bölümde dikeyde ortalı, lup çapı `cqw` ile ölçekleniyor. Sol sütun (etiket, başlık, metin) HTML grid'de.
- **Gerekçe:** §10.3 "bölüm kendi içinde viewBox 1440×900" diyor. 1440'ta koordinatlar birebir, üstünde içerik kabıyla ortalı, altında orantılı küçülüyor.
- **Geri alma:** Gerekmez.

### K-036 · 2026-09-24 · Yeni token'lar

- **Karar:** `--text-mega` (10×: `clamp(96px, 13.9vw, 200px)`), `--text-mega-italic` (1:1: `clamp(120px, 16.7vw, 240px)`), `--tracking-item: -0.02em`, `--stat-unit-scale: 0.423` (birim/rakam: 44/104 masaüstü, 20/48 mobil).
- **Gerekçe:** §10.5, §10.4 ve §15'teki boyutlar token'da değildi. Kural 5: sabit px font boyutu yazılmaz.
- **Geri alma:** Gerekmez.

### K-037 · 2026-09-24 · "Şu an açık" `useSyncExternalStore` ile

- **Karar:** Sunucu anlık görüntüsü `null` → çalışma saatleri metni gösterilir. İstemcide dakika başlarında tetiklenen bir saate abone olunur ve durum `Europe/Istanbul` saatine göre hesaplanır.
- **Gerekçe:** Hidrasyon uyumsuzluğu olmadan §10.5'teki davranış. Efekt içinde `setState` (ESLint `react-hooks` uyarısı) gerekmiyor. 9 gün/saat senaryosu Node'da test edildi.
- **Geri alma:** Gerekmez.

### K-038 · 2026-09-24 · Footer sırası ve yüksekliği

- **Karar:** Sütunlar → wordmark (damgalar sağ üst köşesinde, akışa girmeden) → en alt satır. Wordmark alt satırla arasında boşluk bırakmadan duruyor. Footer 1440'ta ≈ 509px (şartname 440).
- **Gerekçe:** §10.6 hem "wordmark footer altına 0 boşlukla oturur" hem "en alt satır" diyor; ikisi aynı anda sağlanamıyor. "En alt satır" korundu. 440px'e sığması için wordmark'ın ya küçülmesi ya da alt satırın üstüne binmesi gerekirdi.
- **Geri alma:** Alt satırı wordmark'ın üstüne almak.

### K-039 · 2026-09-24 · Çizgi renkleri (belirtilmeyen yerler)

- **Karar:** Atölye adım tablosu ve Mağaza 10×/1:1 ayırıcısı graphite. Mağaza bilgi satırının üst çizgisi line-strong. Footer üst çizgisi graphite (§10.6).
- **Gerekçe:** §5.1: "1px çizgiler = graphite"; bölüm ayırıcıları line-strong (§7).
- **Geri alma:** Figma kıyasında güncellenir.

### K-040 · 2026-09-24 · Nav ve Footer layout'ta; Nav hero'nun üstünde

- **Karar:** `Nav` ve `Footer` `layout.tsx`'te, `#lup-content` içinde. Nav `absolute`, tam kâğıt zemin; hero fotoğrafı altından başlıyor. Nav linkleri `/#vitrin` biçiminde (ürün sayfasından da çalışsın). Kaydırmada gizlenme Aşama 5'te, mobil MENÜ Aşama 6'da.
- **Gerekçe:** §10.1'deki viewport koordinatları (taş 927, 475) fotoğrafın 900px'lik hero'yu Nav'ın altı dahil kapladığını gösteriyor.
- **Geri alma:** Gerekmez.

### K-041 · 2026-09-24 · Prettier `printWidth: 100`, `.md` hariç

- **Karar:** `.prettierrc.json`'a `printWidth: 100` eklendi; `.prettierignore`'a `*.md` eklendi.
- **Gerekçe:** Kod 100 sütunla yazıldı; 80'de uzun Tailwind sınıf satırları gereksiz kırılıyordu. Markdown kayıtları (KARARLAR, ILERLEME) elle düzenleniyor.
- **Geri alma:** Satırları silip `pnpm format`.

### K-042 · 2026-09-24 · Mağaza'daki küçük yüzük çizimi

- **Karar:** `RingFront` şimdiden yazıldı (bant, taş profili, iki tırnak; §11.2 A'nın geometrisi, ölçüsüz). Mağaza'da 48px, Tektaş Rüya ölçüleriyle (iç Ø 17.3, bant 2.2, taş Ø 5.1). Ölçüler şimdilik `Magaza.tsx`'te sabit; Aşama 3'te ürün verisine taşınacak.
- **Gerekçe:** §10.5 "RingFront SVG'nin 48px'lik hali" diyor; bileşen Aşama 3'te ölçülerle genişleyecek.
- **Geri alma:** Gerekmez.
- **Aşama 3 notu:** Ölçüler artık `products.ts`'teki `drawingSpec`'ten okunuyor (K-044).

---

## Aşama 3

### K-043 · 2026-09-24 · Levha: görünüşler veri olarak

- **Karar:** Her görünüş (`ringFrontView`, `ringTopView`, `bandSectionView`, …) `{ geometry, dims, notes }` döndürüyor. Geometri levhanın tek SVG'sine (viewBox 800×1100) giriyor; ölçüler `DimensionLine` ile, notlar `MonoLabel` ile HTML olarak aynı uzaya yerleşiyor. Çizgiler `data-draw="axis | outline | detail"` ile işaretli; Aşama 5'teki çizim sırası (eksen → kontur → detay → ölçü → etiket) buna bağlanacak.
- **Gerekçe:** §11.2 "levha tek SVG" ve §8.3 "etiketler HTML" kuralları aynı anda sağlanıyor. Parça tipleri aynı bileşenlerin parametreli hali (§11.2).
- **Geri alma:** Gerekmez.

### K-044 · 2026-09-24 · Ürün verisine `drawingSpec` eklendi

- **Karar:** `Product`'a tipine göre ayrışan `drawingSpec` (mm) eklendi; `kind` alanı `drawing` ile aynı. Tektaş şartnameden: iç Ø 17.3, bant 2.2, taş Ø 5.1, kesit 2.2 × 1.6. Diğerleri **temsili**: Burma iç Ø 18.2 (şartname), bant 1.8, 16 tur. Damla boy 24 (şartname), taş 7 × 5. Su Yolu 42 × 4.2 aralık, en 3.0, taş Ø 2.4, boy 175 (şartname: 42 taş, 17.5 cm). Armut uç 12 (şartname), taş 8 × 5.4. Telkari iç Ø 17.8, bant 2.6, taş Ø 4.3, tel Ø 0.3 (şartname).
- **Gerekçe:** Şartname yalnızca tektaş için tam ölçü veriyor. Diğer değerler karat ve boydan makul çıkarımlar. Gerçek parçalar ölçülünce yalnızca bu alan güncellenir.
- **Geri alma:** Değerleri `products.ts`'te düzeltmek.

### K-045 · 2026-09-24 · Üst görünüş 6:1 (24 birim/mm)

- **Karar:** Faset diyagramı 24 birim/mm'de çiziliyor; görünüş başlığı "ÜST GÖRÜNÜŞ — 6:1".
- **Gerekçe:** Şartname üst görünüşe ölçek vermiyor. Levha ölçeğinde (8 birim/mm) 5.1 mm'lik taş 41 birim çıkıyor; 57 fasetli diyagram okunmaz.
- **Geri alma:** `RingTop.tsx`'te `SCALE`.

### K-046 · 2026-09-24 · Bant kesiti 10:1 (40 birim/mm)

- **Karar:** Kesit 12 birim/mm yerine 40 birim/mm; başlık "KESİT A-A — 10:1".
- **Gerekçe:** 12 birim/mm'de kesit 26×19 birim kaldı, ölçü etiketleri sığmadı ve görünüş §19'daki "ikon gibi değil" kuralını karşılamadı (render edilip bakıldı). Oranlar, tarama (45°, 4 birim) ve ölçüler şartnamedeki gibi.
- **Geri alma:** `BandSection.tsx`'te `SCALE = 12`.

### K-047 · 2026-09-24 · Bant kalınlığındaki iç tutarsızlık olduğu gibi bırakıldı

- **Karar:** Ön görünüşte bant radyal kalınlığı 2.2 mm (§11.2 A: "bant 2.2 mm → dış r 86.8"), kesitte kalınlık 1.6 mm, genişlik 2.2 mm (§11.2 C). İkisi de şartnamedeki gibi çizildi.
- **Gerekçe:** Ön görünüşteki radyal ölçü kesitteki kalınlıkla aynı olmalı; şartname iki farklı değer veriyor. Tasarım kararı üretmemek için ikisi de korundu. **Kuyumcu/tasarımcı onayı gerekiyor.**
- **Geri alma:** `drawingSpec.band` ya da `section.thickness`.
- **Çözüm (2026-09-24, kullanıcı onayı):** Kesit doğru: genişlik 2.2 mm, kalınlık 1.6 mm. Ön görünüşteki halka kalınlığı 1.6 mm: iç Ø 17.3 → iç r 69.2, dış r (8.65 + 1.6) × 8 = 82.0. Ön görünüşteki ölçü etiketi "1.6 mm". Hero'daki "BANT 2.2 mm" bandın genişliğidir, değişmedi. Uygulama: tektaşın `drawingSpec`'inden ayrı `band` alanı kaldırıldı; ön görünüş halka kalınlığını `section.thickness`'tan okuyor, böylece iki değer bir daha ayrışamaz. Mağaza'daki 48px çizim de aynı değeri kullanıyor. Toplam yükseklik buna göre 22.3 mm'ye indi.

### K-048 · 2026-09-24 · Levha yazıları

- **Karar:** Ölçüler birimsiz ("17.3"); sağ üstte "ÖLÇEK 2:1 / ÖLÇÜLER mm". Her görünüşün altında başlık: "ÖN GÖRÜNÜŞ", "ÜST GÖRÜNÜŞ — 6:1", "KESİT A-A — 10:1", "DÜZ AÇILIM". Taşlı ön görünüşlerde bandın altında kesit işareti "A · A".
- **Gerekçe:** Teknik çizim alışkanlığı; kalabalık levhada her ölçüde "mm" tekrarı okunmayı zorlaştırıyor. Şartname yalnızca "KESİT A-A" başlığını veriyor.
- **Geri alma:** `copy.ts` → `productPage`.
- **İstisna (K-047 çözümü):** Ön görünüşteki halka kalınlığı etiketi kullanıcı isteğiyle birimli ("1.6 mm"). Aynı ölçü burma ve telkari ön görünüşlerinde de birimli ("1.8 mm", "2.6 mm"); diğer levha ölçüleri birimsiz.

### K-049 · 2026-09-24 · Kesit taraması hesapla kırpılıyor

- **Karar:** Tarama çizgileri `clipPath` yerine dışbükey profil çokgenine göre hesapla kırpılıyor (Cyrus–Beck).
- **Gerekçe:** Lup klonu tüm `id`'leri siliyor (§9.2); `clip-path: url(#…)` klonda kırılır, tarama profilden taşardı.
- **Geri alma:** Gerekmez.

### K-050 · 2026-09-24 · `DimensionLine`'a `knockout` ve `extendEnd`

- **Karar:** `knockout`: etiketin arkası kâğıt, altındaki eksen yazının içinden geçmez (eksen üstündeki çap ölçüleri). `extendEnd`: dar ölçüde çizgi dışarı uzar, etiket ucuna oturur (bant kalınlığı, §11.2 A "dışarı çıkan ok").
- **Gerekçe:** Teknik çizim kuralları; §8.3'teki etiket konumlamasıyla uyumlu.
- **Geri alma:** Gerekmez.

### K-051 · 2026-09-24 · Sertifika ayrıntıları

- **Karar:** Parçada olmayan bilgilerin satırı atlanıyor (Burma'da taş satırları yok; kesim yalnızca tektaşta). İkinci damga ayar etiketinin ilk parçası ("18K · 750" → "18K", "22 AYAR · 916" → "22 AYAR"). Durum satırı "ŞU AN VİTRİNDE · KAPALIÇARŞI" (sipariş üzerine olanlarda "SİPARİŞ ÜZERİNE · …"). İmza 200×60 kutuda tek `<path>` (birden çok alt yol), 1.5px, `role="img"` + etiket.
- **Gerekçe:** §11.3'teki tablo tektaş örneği; diğer parçalar için genelleme.
- **Geri alma:** `Certificate.tsx`.

### K-052 · 2026-09-24 · Ürün sayfası yerleşimi

- **Karar:** Levha sütunu 1440'a kadar sol kenar boşluğuna taşıyor (`-ml` kenar boşluğu); 1440 üstünde ortalanan kabın solunda kalıyor. Sütunlar arası 1px graphite çizgi ara boşluğun ortasında. Sertifika `lg`'de `sticky; top: 120px`. Nav altında satır: sol "← TEZGÂHA DÖN" (`/#vitrin`), sağ "LEVHA 0X / 06". `dynamicParams = false` → bilinmeyen slug 404.
- **Gerekçe:** §11.1. 1440 üstünde tam ekran kenarına taşımak kap dışı ölçüm gerektirir; levha zaten kendi kesim izleriyle çerçeveli.
- **Geri alma:** Gerekmez.

### K-053 · 2026-09-24 · Antet tablosu değerleri

- **Karar:** USTA "M. Sönmez" (`site.master.name`'den türetilir), ÖLÇEK "2:1", TARİH tüm parçalarda "03.2026".
- **Gerekçe:** Şartname tarihi yalnızca tektaş için veriyor.
- **Geri alma:** `copy.ts` → `productPage.titleBlock`.

### K-054 · 2026-09-24 · Levhadaki kırmızı taş işareti bütçe dışı

- **Karar:** Ön görünüşte taşın üstündeki kırmızı işaret (Ø8) "damga dili" sayıldı; ürün sayfasının odak kırmızıları buton + Nav randevu.
- **Gerekçe:** §11.2 "taşın üstünde kırmızı işaret" ile §11.3 "sayfanın tek odak kırmızısı buton" ancak §5.1'deki "küçük işaret noktaları bütçeye girmez" kuralıyla birlikte tutarlı.
- **Geri alma:** `dot="graphite"`.

---

## Aşama 4

### K-055 · 2026-09-24 · Lupun yapısı

- **Karar:** `Loupe.tsx` yalnızca işaretlemeyi render eder. Tüm davranış `useLoupe.ts`'teki React dışı, emir kipindeki bir denetleyicide: işaretçi olayları, GSAP ticker'daki kare döngüsü, klonlama, ResizeObserver. Dışarıdan tazeleme için `refreshLoupe()` dışa açık (100 ms debounce). Şimdilik `HeroGuide`, `OpenStatus` ve `LoupeHint` çağırıyor; Aşama 5'te animasyon bitişleri çağıracak. `src/lib/gsap.ts` (§14.1) lup ticker'ı için bu aşamada eklendi.
- **Gerekçe:** Kare başına React render'ı olmasın; her karede yalnızca `style.transform` yazılır. Lenis ile aynı saat (§9.3).
- **Geri alma:** Gerekmez.

### K-056 · 2026-09-24 · Tepsi hücreleri link olsa da büyütülür (`data-loupe-magnify`)

- **Karar:** §9.4'teki "link üstünde lup küçülür, sistem imleci gelir" kuralından tepsi hücreleri muaf. Hücrelerde lup etkin ve imleç gizli; tıklanabilirliği hover'da beliren "İNCELE →" ve graphite çerçeve gösteriyor. Diğer tüm linklerde (Nav, "Tezgâha in", butonlar, footer) kural aynen geçerli.
- **Gerekçe:** Hücrenin tamamı link (§10.2) ve Vitrin notu "İMLECİ BİR PARÇANIN ÜZERİNE GETİRİN" diyor. Kural aynen uygulanınca lup tam parçaların üstünde kapanıyordu. §10.2'deki "lup zaten büyütüyor, bu yüzden hover sade" ifadesi de hücrede lupun açık olduğunu varsayıyor.
- **Geri alma:** `TrayCell.tsx`'ten `data-loupe-magnify`'ı kaldırmak.

### K-057 · 2026-09-24 · Boşta durumunun tanımı

- **Karar:** Lup şu durumlarda boşta (yalnız dış halka): 1.2 sn fare hareketi yoksa; etkileşimli öğe (K-056 hariç), `data-loupe-off` alanı ya da içerik kabının dışındaki kenar boşluğu üstündeyse (`max(--grid-margin, (genişlik − 1312) / 2)`); klon kurulamadıysa. Kaydırma da etkinlik sayılır: fare dururken sayfa kaydırılırsa lup boşa düşmez.
- **Gerekçe:** §9.1 "etkileşimli olmayan kenar boşlukları" ifadesi kenar boşluğu olarak okundu. Kaydırmada içerik lupun altında aktığı için lupun kapanması amaca ters (§9.3: "içerik altında akar").
- **Geri alma:** `useLoupe.ts` → `onScroll`, `onPointerMove`.

### K-058 · 2026-09-24 · Klondaki yapışkan öğeler

- **Karar:** Klon kaydırılmadığı için sertifikanın `sticky` konumu klonda oluşmuyordu. `data-loupe-sticky` işaretli öğeler klonda `relative` yapılıyor; doğal konumları ve kayma sınırları klon kurulurken bir kez ölçülüyor. Kaydırmadaki yerleri her karede kaydırma değerinden hesaplanıp `transform` ile veriliyor (karede layout okuması yok). Burma sayfasında 0, 200, 400 ve 800px kaydırmada canlı sayfa ile klon aynı konumda ölçüldü.
- **Gerekçe:** §9.2'deki klon yaklaşımında sticky ele alınmıyordu. Ürün sayfasında sertifika yapışık.
- **Geri alma:** Gerekmez.

### K-059 · 2026-09-24 · Katmanlar ve kenar çizgisi

- **Karar:** `.loupe` ve `.loupe-ring` kalıcı olarak `will-change: transform` (küçük katmanlar). Sahnede `will-change` yalnızca lup etkinken (§9.8). 1px kenar ve nişan, sahnenin üstündeki `::before` katmanında; sahnenin başlangıç noktası camın kenarıyla aynı.
- **Gerekçe:** Transform'u JS'le değişen ama katmanı olmayan öğe her karede yeniden boyanır. Tracing ile ölçüldü: ana sayfada ve ürün sayfasında lup hareketi boyunca 0 Layout, 0 Paint.
- **Geri alma:** Gerekmez.

### K-060 · 2026-09-24 · Lupta SVG çizgileri de 3.3× kalınlaşır

- **Karar:** Klondaki `vector-effect: non-scaling-stroke` çizgiler lupta 3.3 kat kalın görünür; bu olduğu gibi bırakıldı.
- **Gerekçe:** `non-scaling-stroke` üst öğelerdeki CSS transform'ları hesaba katmaz. Sonuç gerçek bir lupla aynı (her şey aynı oranda büyür) ve vektör olduğu için keskin (§9.4).
- **Geri alma:** Gerekmez.

### K-061 · 2026-09-24 · Dokunmatik ayrıntılar

- **Karar:** Basılı tutma sayılmadan önce 10px kayma payı; daha fazla kayarsa normal kaydırma. Lup açıkken ve basılı tutarken uzun basma menüsü ve metin seçimi kapalı (`html[data-loupe-touch]`). İlk ziyaret ipucu hero'da "↓ TEZGÂHA İN"in altında; kaba imleçte görünür, lup bir kez açılınca hem sayfadan hem lupun kopyasından kalkar. Konumu Aşama 6'da mobil düzenle birlikte gözden geçirilecek.
- **Gerekçe:** §9.6. Kayma payı olmadan her dokunuş 180 ms sonra lup açardı. Uzun basma menüsü lupla çakışıyordu.
- **Geri alma:** `LOUPE.touchSlop`, `globals.css`.

### K-062 · 2026-09-24 · `requestIdleCallback` yedeği

- **Karar:** `requestIdleCallback` yoksa (Safari) klon 200 ms sonra kurulur.
- **Gerekçe:** §17 klonun boşta kurulmasını istiyor; Safari bu API'yi desteklemiyor.
- **Geri alma:** Gerekmez.

---

## Aşama 5

### K-063 · 2026-09-24 · Çizgi çizimi DrawSVGPlugin ile

- **Karar:** Ölçü okları, kılavuz çizgiler, eksenler ve levha çizimi `gsap/DrawSVGPlugin` ile (dasharray + dashoffset). Tek seferlik girişler bitince çizim stilleri temizleniyor (`clearDraw`); sonraki boyut değişimlerinde çizgiler kısalmıyor.
- **Gerekçe:** Eklenti `gsap` paketinin içinde (3.13'ten beri ücretsiz); yeni bağımlılık değil. `non-scaling-stroke` çizgileri ekran boyunda ölçüyor; elle `getTotalLength` hesabı bu çizgilerde yanlış çıkardı.
- **Geri alma:** `helpers.ts`'te `drawSVG` yerine elle `strokeDashoffset`.

### K-064 · 2026-09-24 · Giriş bölgeleri JS gelene kadar gizli

- **Karar:** `<head>`'deki küçük betik, hareket izni varsa `<html>`'e `js-anim` ekler. CSS `html.js-anim:not(.anim-ready) [data-intro]` bölgelerini (hero, ürün sayfası) gizler. Bölüm animasyonları başlangıç durumlarını kurduktan sonra `MotionReady` `anim-ready` ekler. JS 4 sn içinde gelmezse gizleme kalkar. JS kapalıysa ve reduced motion'da hiç gizlenmez. `<html>`'de `suppressHydrationWarning` (sınıfları hidrasyondan önce betik, sonra Lenis/lup ekliyor).
- **Gerekçe:** Giriş animasyonları ekranın üstünde; gizleme olmadan içerik önce görünüp sonra kaybolur, ardından animasyonla gelirdi.
- **Geri alma:** Betiği ve CSS kuralını kaldırmak.

### K-065 · 2026-09-24 · Animasyon mimarisi

- **Karar:** Her bölümün animasyonu ayrı bir istemci bileşeninde (`src/components/motion/*Motion.tsx`). Bileşen bölümüne boş bir `<span hidden>` çapa koyar, kapsam çapanın ebeveynidir; sunucu bileşenleri değişmedi. `useMotion` her şeyi `gsap.matchMedia` içinde kurar: `(prefers-reduced-motion: no-preference)` yoksa hiçbir şey kurulmaz ve içerik SSR'daki son halinde kalır. `useGSAP` söküm yapar.
- **Gerekçe:** §14.2. Bölümler sunucuda render olmaya devam ediyor; hareket yalnızca istemci katmanında.
- **Geri alma:** Gerekmez.

### K-066 · 2026-09-24 · Kaydırmaya bağlı öğeler lupta aynalanıyor

- **Karar:** Scrub/pin'li öğeler (`data-loupe-sync`) lupun kopyasında her karede aynalanıyor: canlı öğenin satır içi stili klona yazılıyor (layout okuması yok). Pin'lenen öğe `position: fixed` olduğunda klonda kaydırma kadar `translate` ile aşağı itiliyor. Kapsam: hero parallax katmanları, 10× bölümü (pin + lup + notlar + ölçü), Atölye fotoğraf içi parallax, durum noktası nabzı.
- **Gerekçe:** §9.5 yalnızca tek seferlik animasyonların bitince tazelenmesini tanımlıyor. Scrub'lı içerik sürekli değişiyor ve pin'lenen bölüm klonda sayfanın başına düşüyordu. Testte 10× pin'liyken lup dev lupun merkezini doğru gösterdi (`translate: 0 3100px` = scrollY).
- **Geri alma:** `syncWithLoupe` çağrılarını kaldırmak (lup scrub'lı içerikte eski hali gösterir).

### K-067 · 2026-09-24 · Hero parallax'ı lup katmanını da taşıyor

- **Karar:** Örnek lup ve kılavuz çizgi ayrı bir katmanda (`data-hero-lens-layer`); fotoğrafla aynı parallax'ı (`yPercent 0 → 12`) alıyor. Kılavuz çizgi ölçüme bağlı olduğu için `HeroGuide` içinde, girişin saatine göre 0.8 sn'de çiziliyor.
- **Gerekçe:** Yalnızca fotoğraf kayarsa kılavuz çizginin taş ucu taştan kopardı.
- **Geri alma:** Parallax hedefinden `layer`'ı çıkarmak.

### K-068 · 2026-09-24 · Başlık satır maskesi

- **Karar:** Maske `clip-path`; alt kenarı satır kutusundan başlıyor ve satırla birlikte %40 aşağı açılıyor. Yan ve üst kenarlar geniş (italik taşma, İ/Ğ noktaları). Animasyon bitince maske ve transform temizleniyor.
- **Gerekçe:** Düz `overflow: hidden` son halde alt uzantıları (g, ç, ş, p) keserdi (K-019).
- **Geri alma:** `helpers.ts` → `revealHeadline`.

### K-069 · 2026-09-24 · Lenis ve anchor linkler

- **Karar:** `LenisProvider` §14.1'deki gibi, ama örnek `useState` yerine modül düzeyinde tutuluyor (`useSyncExternalStore`; efekt içinde `setState` yok). Aynı sayfadaki `#…` / `/#…` linkleri pencere yakalama evresinde Lenis'e yönlendiriliyor: `offset` = Nav yüksekliği (§8.9: −96, mobilde −64), `duration` 1.2. Başka sayfadan gelen `/#vitrin` Next'e bırakılıyor. "YUKARI ↑" (`#`) başa kaydırıyor. `lenis/dist/lenis.css` eklendi.
- **Gerekçe:** §8.9. Test: "01 VİTRİN" ve "TEZGÂHA İN" 804'e (vitrin − 96), "YUKARI" 0'a yumuşak kayıyor.
- **Geri alma:** Gerekmez.

### K-070 · 2026-09-24 · Nav sabit; aşağıda gizlenir, yukarıda gelir

- **Karar:** Nav `position: fixed`. Kaydırma Nav yüksekliğini geçince aşağı yönde `yPercent −100`, yukarı yönde 0 (0.6 sn, expo.out). Reduced motion'da hep görünür. Nav `data-loupe-off`: üstündeyken lup boşta, çünkü Nav klonda yok.
- **Gerekçe:** §8.9 süreyi vermiyor; token'daki `DURATION.base`.
- **Geri alma:** `NavMotion.tsx`.

### K-071 · 2026-09-24 · Atölye fotoğraf içi parallax %12 büyütmeyle

- **Karar:** `PhotoOverlay`'e görsel + bindirmeyi saran iç katman (`data-photo-inner`) eklendi. Parallax bu katmanı `yPercent −6 → 6` taşıyor, kenar boşluğu açılmasın diye 1.12 ölçekte.
- **Gerekçe:** §10.4. Bindirmeler fotoğrafla birlikte hareket ediyor, kilit bozulmuyor.
- **Geri alma:** Gerekmez.

### K-072 · 2026-09-24 · Scrub zaman çizelgesinde süre ölçeği

- **Karar:** 10× zaman çizelgesi 0–1 aralığında. Not ve ölçü animasyonlarının süreleri çarpanla küçültülüyor (`drawCallout(…, 0.1)`, `drawDimension(…, 0.1, 0.15)`), sona 0.15'lik bekleme eklendi.
- **Gerekçe:** §10.3'teki dilimler (0.3 → 0.7 notlar, 0.7 → 0.85 ölçü, 0.85 → 1 okuma).
- **Geri alma:** Gerekmez.

### K-073 · 2026-09-24 · Durum noktası nabzı `PulseDot`

- **Karar:** Mağaza ve sertifikadaki durum noktası tek bir istemci bileşeni (`PulseDot`): açıkken ya da vitrindeyken GSAP ile nabız (1 → 0.35, 1.6 sn, sine.inOut, yoyo). Reduced motion'da sabit. Kapalıyken nabız yok.
- **Gerekçe:** §10.5, §11.3, §14.3.
- **Geri alma:** Gerekmez.

### K-074 · 2026-09-24 · Footer alt satırı tıklanabilir (hata düzeltmesi)

- **Karar:** Footer'ın alt satırı `relative`.
- **Gerekçe:** Wordmark'ın konumlu kabının taşan kutusu alt satırın üstünde boyanıyor, "YUKARI ↑" tıklamalarını yakalıyordu (test sırasında bulundu).
- **Geri alma:** Gerekmez.

### K-075 · 2026-09-24 · GSAP `nullTargetWarn: false`

- **Karar:** Kırılıma göre bulunmayan hedefler (1024 altında hero lupu) konsola uyarı yazmıyor.
- **Gerekçe:** Uyarılar gürültüydü; hedefler bilerek yok.
- **Geri alma:** `lib/gsap.ts`.

### K-076 · 2026-09-24 · Mobil menü: `body`'ye açılan panel, Lenis durur

- **Karar:** `NavMenu` (§8.9), `MENÜ` düğmesiyle `document.body`'ye portal olarak açılan tam ekran kâğıt panel (`role="dialog"`, `aria-modal`, `data-loupe-off`). Üstte marka + `KAPAT`, ortada numaralı bölümler (Display M), altta `RANDEVU →`. Açıkken Lenis durur. Escape, `KAPAT` ya da bir bölüm seçilince kapanır ve odak `MENÜ`'ye döner. Anchor kaydırması `lib/lenis.tsx`'teki `ANCHOR_EVENT` (`lup:anchor`) olayını yayınlıyor; menü bu olayda önce `lenis.start()` çağırıp sonra kapanıyor.
- **Gerekçe:** Nav kaydırmada transform aldığı için panel Nav'ın içinde sabit kalamaz. `lenis.start()` içte `reset()` çağırıp sürmekte olan `scrollTo` animasyonunu durduruyor. Menü kapanırken başlatılırsa bölüme kaydırma iptal oluyordu (testte bulundu).
- **Geri alma:** `NavMenu.tsx`'i sil, `Nav.tsx`'te bağlantıları mobilde de göster.

### K-077 · 2026-09-24 · Dokunma hedefi: `tap` yardımcı sınıfı

- **Karar:** `@utility tap`: yalnızca `(pointer: coarse)` altında `inline-flex`, `min-height/min-width: 44px`, dikeyde ortalı. Metin bağlantılarında (Nav, hero "TEZGÂHA İN", geri, telefon, footer, `Button` link varyantı, menü) kullanılıyor. Marka bağlantısı her zaman `min-h-11`, görünüm değişmiyor.
- **Gerekçe:** §15, "dokunma hedefleri ≥ 44×44". Fare kullanan masaüstünde metin satırlarının yüksekliği ve hizası bozulmasın.
- **Geri alma:** `globals.css`'ten `tap`'i kaldır.

### K-078 · 2026-09-24 · 10× bölümü 1024 altında dikey düzen, tablette pin'li

- **Karar:** 1440×900 tuval yalnızca ≥ 1024'te. Altında `data-makro-stack` var: başlık → metin → lup → çap ölçüsü → numaralı not listesi (Mono). Lup çapı `min(560px, genişlik − 32)`. Lup üstündeki 1–4 numaralı noktalar iç dairenin koordinatından (`inLens`) yerleşiyor, çap ölçüsü aynı oranla (663 → 1135) iç çapa oturuyor. Tablette (768–1023) yığın pin'li: `center center`, `+=100%`, scrub 0.6; lup 0.35 → 1, noktalar sırayla, notlar noktalarıyla birlikte, ölçü en sonda. Mobilde pin yok, noktalar ve notlar görünür olunca sırayla beliriyor.
- **Gerekçe:** §15. Tablette "pin'li ama lup 560px" isteniyor. 768'de masaüstü tuvali lupu 373px'e indirir ve sağdaki notlar ekrandan taşar. Bu yüzden tablet de dikey düzeni kullanıyor, pin'i masaüstünden alıyor.
- **Geri alma:** `Makro.tsx`'teki `lg:hidden` yığını ve `MakroMotion`'daki tablet dalı.

### K-079 · 2026-09-24 · Ürün detay mobil: levha pencereleri ve bölünmüş sertifika

- **Karar:** Mobilde levha tam boyutta çizilip `PlateWindow` ile kırpılıyor. Kırpma kutuları levha biriminde ve tipe göre (`plateCrops`):
  - tektaş: ön görünüş + lup `[230,90,540,370]`, üst görünüş + kesit `[110,620,590,290]`;
  - telkari: sağdaki tel notu için genişletilmiş `[218,135,516,390]`;
  - su yolu: alçak düz açılım `[190,220,380,230]`;
  - diğerleri: `[200,160,450,340]`.

  Pencerede antet ve sağ üstteki levha no/ölçek gösterilmiyor (`windowed`): levha no sayfanın başında, antet pencerelerin altında 2 sütunlu ızgarada (`TitleBlock layout="grid"`). İkinci pencere ekran okuyucudan gizli. Sertifika ikiye bölünüyor: `head` (no + ad + alt başlık, çerçevesiz) levhanın üstünde, `body` (açıklama, satırlar, imza, damgalar) altında. WhatsApp butonu (`CertificateCta`) sayfanın altına yapışık: `sticky bottom-0`, `safe-area` boşluğuyla.
- **Gerekçe:** §15'teki "gerekirse levha 2 parçaya bölünür" ve "etiketler min 9px" şartları. Etiketler HTML ve sabit boyutlu, levha 350px'e sığdırılınca birbirinin üstüne biniyordu. Pencerede sağ üst levha no/ölçek lupun altında kalıyordu. Test: altı ürünün hiçbirinde pencere kenarında kesilen etiket yok.
- **Geri alma:** `page.tsx`'te `md:hidden` pencere bloğunu kaldır, levhayı mobilde de tam göster.

### K-080 · 2026-09-24 · Tepsi hücresi 1024 altında sadeleşiyor

- **Karar:**
  - < 1024: veri satırı, "İNCELE →" ve telkari notu gizli; ad hücrenin altına iniyor (16px içeride).
  - < 768: ad 16px, no/damga/ad 12px içeride, ölçü etiketleri 9px (Mono S), telkari lupundaki "10×" etiketi gizli.
  - Veri satırı bağlantının `aria-label`'ında kalıyor.
- **Gerekçe:** §15'te mobilde veri satırı gizli. Tablette 3 kolon kalıyor (§15), ama 768'de hücre ≈ 229px: ad iki satıra bölünüp fotoğrafın ve ölçünün üstüne biniyordu, telkari notu lupun üstüne düşüyordu. "İNCELE →" yalnızca hover'da çıkıyor, dokunmatikte anlamı yok. Mobilde "10×" etiketi 916 damgasıyla çakışıyordu.
- **Geri alma:** `TrayCell.tsx`'teki `max-lg:` sınıfları.

### K-081 · 2026-09-24 · Kesim izleri mobilde 8px içeride

- **Karar:** `PlateFrame` köşe izleri < 768'de köşeden 8px içeride (masaüstünde 24px).
- **Gerekçe:** 20px'lik mobil kenar boşluğunda 24px içerideki iz, sağ üstteki levha numarasının üstüne biniyordu.
- **Geri alma:** `PlateFrame.tsx`'teki `CORNERS`.

### K-082 · 2026-09-24 · Mobil ve tablet yerleşim ayrıntıları

- **Karar:**
  - İki satırlı başlıkların ikinci satırı mobilde 1 kolon içeride (`indentMobile: "cols-1"`, hero, Vitrin, Atölye).
  - Mobilde bölüm üst boşluğu 96px.
  - Hero:
    - mobilde en az 600px yüksek;
    - "TEMSİLİ GÖRSEL" notu mobilde sağ üstte;
    - sağ alt not tablette 6. kolondan başlıyor, "bakın." ile çakışmıyor.
  - Vitrin notu < 1024'te başlığın altında, sola hizalı.
  - Tepsi mobilde 2 kolon; ayırıcılar kolon sayısına göre.
  - Atölye istatistikleri < 1024'te yan yana, adımlar 2×2.
  - Mağaza: tablette yan yana, mobilde alt alta.
  - Footer: tablette 2×2, mobilde alt satır tek sütun.
- **Gerekçe:** §15. Mobildeki hero yüksekliği 100svh. 600px alt sınırı, alçak ekranlarda başlık ile notun üst üste binmesini önlüyor.
- **Geri alma:** İlgili bölüm dosyalarındaki `max-md:` / `max-lg:` sınıfları.

### K-083 · 2026-09-24 · 10× metni 1024–1279'da daralıyor

- **Karar:** ≥ 1024'te 10× gövde metninin genişliği `min(360px, 37vw − 128px)`: lupun sol kenarı (tuvalin %37'si), eksen taşması (40px), ara (24px) ve kenar boşluğu (64px) düşülerek. 1024'te 251px, 1280'de 346px, 1440'ta 360px.
- **Gerekçe:** 1024'te 360px'lik metin lupun halkasının ve yatay eksenin üstüne biniyordu.
- **Geri alma:** `Makro.tsx`, `lg:max-w-[…]`.

### K-084 · 2026-09-24 · Levha no/ölçek bloğu lupun üstünde kalıyor

- **Karar:** Levhanın sağ üstündeki blok `top: min(48px, 12.125cqw − 48px)`: lupun üst kenarı (levha y 97 = genişliğin %12.125'i) eksi blok yüksekliği (38px) ve ara (10px). 1440'ta 48px (değişmedi), 1280'de 40, 768'de 35, 1024'te 22px. Lupla arası her genişlikte 8–14px.
- **Gerekçe:** Blok sabit 48px'teydi, lup levhayla ölçeklenip yukarı çıkıyordu. Levhanın daraldığı 768–1280 aralığında son satır ("ÖLÇÜLER mm") lup halkasına değiyordu.
- **Geri alma:** `TechnicalPlate.tsx`, `data-plate-meta` üzerindeki `style`.

### K-085 · 2026-09-25 · Burma levhası: bant yüzeyi açılımı ve tel kesiti

- **Karar:** Üst görünüş yerine bant yüzeyi açılımı (§11.2 `twist`), 6:1:
  - orta çevre (π × 20.0 = 62.8 mm) boyunca düz şerit;
  - iki telin burgu sınırları S eğrisi;
  - 2.5 tur çiziliyor, gerisi su yolundaki gibi kırılma çizgisi ve "···";
  - ölçüler: tur adımı 3.9, şerit eni 1.8, "62.8 · 16 × 3.9".

  Sağ altta A-A kesiti 20:1: kesikli zarf (Ø 1.8) içinde yan yana iki tel (Ø 0.9), ayrı parça oldukları için taramaları ters yönde. Ön görünüşe "A · A" işareti eklendi. Açılım, sol ölçü etiketi levha kenarına yaslanmasın diye 25 birim sağda.
- **Gerekçe:** Şartname açılımı istiyor ama ölçek vermiyor. 1.8 mm'lik şerit 2:1'de 14 birim kalıp çizgiler seçilemiyor. Tel 10:1'de 36 birim, tarama okunmuyor. Kesit görünüşü "en az 3 ölçü, kesit taraması şart" kuralı için eklendi.
- **Geri alma:** `TwistViews.tsx`, `TechnicalPlate.tsx` → `plateFor`.

### K-086 · 2026-09-25 · Yeni görünüşler için temsili ölçüler; damla kancası önden düz

- **Karar:** `drawingSpec`'e temsili değerler eklendi (K-044 gibi):
  - damla taş derinliği 3.2, armut 3.4;
  - su yolu yuva yüksekliği 2.2;
  - zincir halkası 1.6 × 1.2, tel Ø 0.3.

  Kodda sabit olanlar:
  - kutu duvarı 0.3, tabanı 0.4, taban deliği Ø 1.0;
  - tırnak r 0.28;
  - menteşe dili 0.3 × 0.9;
  - menteşe boşluğu 0.2.

  Damlanın ön görünüşünde kanca artık tek düz tel. Kıvrımı görüş doğrultusunda olduğu için profili yan görünüşe taşındı.
- **Gerekçe:** Şartname bu parçalar için yalnızca boy/karat veriyor. Kancanın önden kıvrık çizilmesi teknik olarak yanlıştı; yan görünüş eklenince iki görünüş çelişecekti. **Gerçek parçalar ölçülünce güncellenmeli.**
- **Geri alma:** `products.ts`, `TennisViews.tsx` sabitleri, `DropEarringFront.tsx`.

### K-087 · 2026-09-25 · Mobil levha pencereleri: geniş görünüşler ayrı pencerede, başlık aralığı 52

- **Karar:** Alttaki görünüşler, tek pencerede levha ≈ 0.6 ölçeğin altına düşmüyorsa birlikte (tektaş, damla, armut, telkari), düşüyorsa her biri kendi penceresinde (burma, su yolu: 3 pencere). Altında ölçü etiketi olan görünüşlerde ölçü çizgisinden görünüş başlığına 44 yerine 52 birim (`TITLE_GAP`). Masaüstünde fark ≈ 8px.
- **Gerekçe:** Levha etiketleri sabit boyutlu HTML. Levha küçüldükçe etiketler birbirine yaklaşıyor. Otomatik ölçümde tektaşın alt penceresinde "Ø 5.1" ile "ÜST GÖRÜNÜŞ" Aşama 6'dan beri çakışıyormuş. Şimdi 390, 768, 1024, 1440'ta altı levhada kesilen ya da çakışan etiket yok.
- **Geri alma:** `plateCrops`, `types.ts` → `TITLE_GAP`.

### K-088 · 2026-09-25 · Damla ve armut: faset diyagramı, yan görünüş, zincir halkası

- **Karar:**
  - Damla:
    - ön görünüş;
    - üst görünüş 6:1: armut faset diyagramı (kontur, 8 köşeli tabla, 8 faset);
    - yan görünüş 2:1: taç önde, köşk arkada, rundisti saran yuva, halka ve kancanın profili; ölçüler taş derinliği ve kanca derinliği.
  - Armut:
    - ön görünüş;
    - yan görünüş 4:1, başlıkta ölçek ("YAN GÖRÜNÜŞ — 4:1");
    - zincir halkası detayı 20:1: ortadaki halka önden, komşuları yandan ve deliğinden geçerek; ölçüler boy, en, tel çapı.
- **Gerekçe:** §11.2 `drop-earring` ("üst görünüş = armut faset diyagramı", "kanca profili") ve `pear-pendant` ("ön + yan görünüş, zincir halkası"). 12 mm'lik uç 2:1'de yandan 27 birim derinlikte kalıyordu.
- **Geri alma:** `PearViews.tsx`, `ChainLink.tsx`.

### K-089 · 2026-09-25 · Sayfa geçişi doğrudan `document.startViewTransition` ile

- **Karar:** Vitrin ya da şerit hücresine tıklanınca (`PartLink`, `lib/partTransition.ts`):
  - `document.startViewTransition({ update, types: ["part-open"] })` çağrılır; fotoğrafa `part-hold` adı yalnızca geçiş boyunca verilir;
  - güncelleme `router.push` ile başlar, yeni sayfa commit olunca (`MotionReady` yerleşim efekti, `pageReady`) biter;
  - animasyon: sayfanın geri kalanı 240 ms'de söner, fotoğraf yerinde kalır, yeni sayfa 240 ms sonra gelir ve levha çizilir;
  - Nav iki sayfada aynı olduğu için yerinde durur (`site-header`);
  - yeni sayfa 3.5 sn'de gelmezse geçiş atlanır, gezinme sürer.
  - View Transitions yoksa içerik sönüp yeni sayfada yeniden yanar. Reduced motion'da geçiş yok. Geri linki geçişsiz.
  - Lup, yeni sayfada klon yenilenene kadar yalnız dış halka olarak kalır (eski sayfayı büyütmesin).
- **Gerekçe:** §11.5. Önce Next 16'nın önerdiği React `<ViewTransition>` + `Link transitionTypes` denendi, ama `startViewTransition` hiç çağrılmadı. Commit uygun şeritteydi, ama silinen sayfa alt ağacında ViewTransition bayrağı görünmedi; kök neden bulunamadı. Şartname zaten `document.startViewTransition`'ı adıyla anıyor.
- **Geri alma:** `TrayCell.tsx`'te `PartLink` yerine `Link`; `globals.css`'teki geçiş kuralları.

### K-090 · 2026-09-25 · Diğer parçalar şeridi

- **Karar:**
  - Yerleşim:
    - mevcut parça hariç 5 parça doğal sırada;
    - hücre `TrayCell compact` (240px, 4:5): no, damga, ölçü (9px) ve ad; veri satırı, "İNCELE" ve telkari notu yok;
    - şerit ekran kenarına kadar kayar, ilk hücre içerik kabının kenarıyla hizalı başlar; kaydırma çubuğu gizli.
  - Kaydırma:
    - yerel `overflow-x: auto` + `scroll-snap-type: x mandatory`;
    - masaüstünde fareyle sürükleme: 4px eşik, bırakınca en yakın hücreye yumuşak oturma, sürükleme sonrası tıklama linki açmaz;
    - Lenis yatay hareketlere karışmaz (`data-lenis-prevent-horizontal`).
  - Lup: klon iç kaydırmayı `data-loupe-scroll` ile izler.
- **Gerekçe:** §11.4. Trackpad'in yatay hareketlerinde deltaY sıfır olmadığı için Lenis onları engelliyordu. Lup klonu kopyalanırken iç kaydırma konumu taşınmıyor; yoksa kaymış şeritte lup yanlış hücreyi büyütürdü. 1440'ta 5 × 240 = 1200 içerik genişliğine sığar, kaydırma yalnızca daha dar ekranlarda gerekir.
- **Geri alma:** `OtherParts.tsx`, `DragScroll.tsx`, `useLoupe.ts` → `onInnerScroll`.

### K-091 · 2026-09-25 · Telkari levhası: detay B ve lup

- **Karar:**
  - Ön görünüş:
    - sağ altta, 48.75°'deki kıvrım halkasında "B" dairesi;
    - kesit görünüşü olmadığı için "A · A" işareti kaldırıldı;
    - sağ yandaki "TELKARİ · TEL Ø 0.3" notu kaldırıldı.
  - Detay B (8:1, daire içinde): dairenin içi hesapla kırpılır; tel çift çizgiyle kalınlığıyla (Ø 0.3) görünür. Ölçüler tel çapı ve halka dış çapı; tel çapı notun yerine detayda.
  - Tektaş gibi sağ üstte lup (`telkari-makro.jpg`) ve taş işareti.
- **Gerekçe:** §11.2 `filigree` ("4× büyütülmüş detay, daire içinde, DETAY B, tel Ø 0.3"). Telkari taşlı bir yüzük; `macro` görseli veride vardı ama kullanılmıyordu.
- **Geri alma:** `FiligreeFront.tsx`, `plateFor` → `filigree`.

### K-092 · 2026-09-25 · Su yolu levhası: yuva detayı ve kesit

- **Karar:**
  - Düz açılım (değişmedi) + ortadaki yuvada "A" işaretleri.
  - Yuva detayı 10:1:
    - kutu yuva, yuvarlak pırlanta faset diyagramı ve 4 tırnak;
    - sağda menteşe dili ve komşu halkanın başı (kırılma çizgisiyle), dillerin girdiği yuvalar kesikli.
  - A-A kesiti 10:1:
    - duvarlar ve delikli taban taramalı;
    - taş kesit düzleminde profil olarak (taranmaz);
    - tırnaklar düzlemin arkasında görünür kenar.
- **Gerekçe:** §11.2 `tennis` ("yuva detayı büyütülmüş"). Kesit, "kesit taraması şart" kuralı için.
- **Geri alma:** `TennisViews.tsx`.

### K-093 · 2026-09-25 · Ortak tarama modülü

- **Karar:** Kesit taraması `drawings/hatch.ts`'te toplandı: dışbükey çokgen ve daire kırpma (hesapla, K-049), çoklu çizgi kırpma (detay B). 45° çizgiler levhanın ortak ızgarasına oturuyor; aynı parçanın komşu bölgeleri hizalı taranıyor. Bant kesiti bu modüle taşındı.
- **Gerekçe:** Burma, su yolu ve telkari aynı kırpmaya ihtiyaç duydu.
- **Geri alma:** Gerekmez.

### K-094 · 2026-09-25 · Mağaza krokisi yapılmadı

- **Karar:** §10.5'teki isteğe bağlı çizgi kroki eklenmedi.
- **Gerekçe:** Kroki dükkânı cadde üzerinde işaretliyor. "Kalpakçılar Cd. No. 12"nin gerçek konumu bilinmiyor (adres ve telefon temsili). Yanlış yeri gösteren bir kroki ziyaretçiyi yanıltır. Kuyumcudan konum alınınca eklenebilir.
- **Geri alma:** —

### K-095 · 2026-09-25 · Hero girişinin LCP'ye giren kısmı CSS ile, ilk boyamada

- **Karar:**
  - Hero fotoğrafı (0 → 1 opaklık, 1.04 → 1 ölçek), başlık satırlarının maske açılışı (0.3/0.45 sn) ve alt not (masaüstünde 1.4 sn, mobilde başlıkla birlikte 0.6 sn) CSS animasyonuyla, ilk boyamada başlıyor.
  - Bu öğeler `data-intro-keep` ile ön gizlemenin (K-064) dışında; fotoğrafın üstündeki bindirmeler JS'e kadar gizli.
  - Taş işareti, kılavuz çizgi, lup ve ölçüler yine GSAP zaman çizelgesinde.
  - Animasyonlar `#lup-content` ile sınırlı, lup klonunda yeniden oynamıyor.
- **Gerekçe:** §17 LCP < 2.5 sn. Önce hero'nun tamamı hidrasyonu bekliyordu; LCP (hero metni) 4.4 sn'ydi. Chrome ekranı kaplayan görseli "arka plan" sayıp LCP adayı yapmıyor, bu yüzden LCP hero'daki en büyük metin.
- **Geri alma:** `globals.css` → `intro-*`; `HeroMotion` fotoğraf ve başlık adımları.

### K-096 · 2026-09-25 · Açılış iş yükü

- **Karar:**
  - Görünümün altındaki bölümlerin (Vitrin, 10×, Atölye, Mağaza) animasyon kurulumu ilk yüklemede boşta çalışıyor (`useMotion(…, { defer: true })`). Adreste çapa varsa ya da sayfa içi gezinmede hemen kuruluyor.
  - Bölümler `<Suspense>` sınırlarında: hidrasyon parçalara bölünüyor.
  - Dokunmatik birincil cihazda lup klonu ilk dokunuşta kuruluyor.
  - `ScrollTrigger.refresh()` yalnız fontlar `load`'dan sonra gelirse (ScrollTrigger `load`'da zaten kendisi yeniliyor).
  - `FitText` genişliği canvas `measureText` ile ölçüyor (DOM yerleşimi zorlanmıyor).
  - Levha çizimi:
    - yalnız görünen levhalar;
    - mobil pencerede yalnız pencereyle kesişen şekiller;
    - aşağıdaki pencereler ekrana girince;
    - başlangıç hali ölçümsüz (`stroke-dasharray: 0 100000`), tweens kendi anında başlıyor.
- **Gerekçe:** §17 TBT < 200 ms. Ölçüm DrawSVG'nin `non-scaling-stroke` çizgilerde şekil başına ekran dönüşümü okuduğunu gösterdi; üç tam levhada bu tek bir 1 sn'lik görev demekti. Ürün sayfası mobil Performance 56–58'den 83–88'e çıktı.
- **Geri alma:** İlgili dosyalar: `useMotion.ts`, `PlateMotion.tsx`, `helpers.ts` (`UNDRAWN`, `drawDimension` `lazy`), `FitText.tsx`, `useLoupe.ts` (`deferred`), `page.tsx` (Suspense).

### K-097 · 2026-09-25 · Mobilde LCP öğeleri ilk boyamada hazır

- **Karar:** Mobilde (< 768):
  - hero başlığının ilk satırı ("Yakından") maske açılışı olmadan ilk boyamada var; "bakın." açılışla geliyor;
  - ürün sayfasında sertifika başlığı (no, ad, alt başlık) ve yapışık WhatsApp butonu ilk boyamada; sertifika gövdesi açılışla geliyor.

  Masaüstünde değişiklik yok.
- **Gerekçe:** LCP, sayfadaki en büyük metnin boyandığı an. Maskeyle gelen başlık LCP'yi animasyon süresi kadar geciktiriyor ve Lighthouse o ana kadar çalışan JS'i de LCP'ye katıyor.
- **Geri alma:** `globals.css` (`@media (width < 48rem)` bloğu), `page.tsx`'te `data-intro-keep`, `PlateMotion` sertifika filtresi.

### K-098 · 2026-09-25 · Damga kırmızısı #C8321E → #C7311D

- **Karar:** `--color-stamp` bir birim koyulaştı.
- **Gerekçe:** Kâğıt üzerinde #C8321E 4.49:1; §16'nın varsaydığı ≈ 4.7 değil. "RANDEVU AL" / "MAĞAZADA 1:1 GÖRÜN" buton metni (kâğıt, kırmızı üstünde) WCAG AA'nın 4.5:1 sınırının altındaydı. #C7311D 4.55:1; fark gözle seçilmiyor.
- **Geri alma:** `tokens.css`, `tokens.ts`.

### K-099 · 2026-09-25 · Klavye: atlama linki ve bölüm linklerinde odak

- **Karar:**
  - "İçeriğe geç" `#lup-content`'in ilk öğesi, odakta görünür.
  - Aynı sayfadaki bölüm linkleri (Lenis) kaydırmayla birlikte odağı hedefe taşıyor (gerekirse `tabindex="-1"`, programla odaklanan öğede çerçeve yok).
  - Mobil menü, bölüme gidildiyse odağı düğmeye geri çekmiyor.
- **Gerekçe:** §16. Lenis varsayılan kaydırmayı engellediği için tarayıcı odağı taşımıyordu; klavyeyle gelen kişi Nav'da kalıyordu.
- **Geri alma:** `lib/lenis.tsx`, `NavMenu.tsx`, `layout.tsx`.

### K-100 · 2026-09-25 · SEO ve paylaşım

- **Karar:**
  - `metadataBase` Vercel ortamından: yayında alan adı, önizlemede dal ya da dağıtım adresi, yerelde localhost.
  - Paylaşım görseli `opengraph-image.tsx`: kâğıt zemin, kesim izleri, lup dairesinde `lup-detay.jpg`, altta "SÖNMEZ — SİTEDE 10×. MAĞAZADA 1:1." (Geist Mono Medium); derlemede bir kez üretiliyor.
  - Twitter `summary_large_image`.
  - Ürün sayfası başlık ve açıklamasını paylaşıma da veriyor, görseli üstten devralıyor.
  - Ana sayfada `JewelryStore` JSON-LD; ürünlerde `Product` yok.
  - `icon.svg`: kâğıt kare, 1px daire, artı. Statik dosya CSS değişkeni okuyamıyor; renk değerleri token'larla aynı.
  - OG görseli için `tokens.ts`'e `COLOR` eklendi.
- **Gerekçe:** §18. `robots: noindex, nofollow` önceki aşamalardan açık.
- **Geri alma:** Gerekmez.

### K-101 · 2026-09-25 · Kurşun gri kontrastı

- **Durum:** `--color-lead` (#8A857C) kâğıt üzerinde 3.08:1. §16 ≈ 3.4 varsayıyordu; WCAG AA küçük metin için 4.5:1 istiyor. Lighthouse'ta takılan öğeler:
  - 9–10px Mono etiketler (ör. "TEMSİLİ GÖRSEL", "ÖLÇEK 1:1 — LEVHA");
  - Atölye adımlarının 16px açıklamaları.

  Erişilebilirlik puanı yine de 96 (hedef ≥ 95).
- **Seçenek:** #6E6A62 (4.53:1) AA'yı geçer ama ikincil metni belirgin koyulaştırır.
- **Karar (2026-09-25, kullanıcı):** Token ikiye ayrıldı:
  - `--color-lead` #6E6A62 metinde (etiket, veri satırı, açıklama; kâğıtla 4.53:1);
  - `--color-lead-line` #8A857C metin olmayan öğelerde (uzatma çizgisi, eksen, ikon).

  Bugünkü eksen ve uzatma çizgileri §8.3–8.4'teki gibi grafitin %45/%35 opaklığıyla çiziliyor (kâğıtta bu tona yakın), onlar değişmedi. Accessibility 100.
- **Geri alma:** `tokens.css`, `tokens.ts`.

### K-102 · 2026-09-25 · Yerel Lighthouse ölçümleri ve bütçe

- **Durum** (mobil, benzetimli, yerel üretim derlemesi; K-103 sonrası, 3 koşu):

  | Sayfa | Performance | Accessibility |
  |---|---|---|
  | Ana sayfa | 81 / 90 / 90 | 100 |
  | Tektaş | 90 / 89 / 81 | 100 |
  | Telkari | 79–83 | 100 |

  CLS 0. TBT 50–410 ms: tembel animasyon paketi ölçüm penceresine denk gelirse yükseliyor. JS ilk yük 152KB gzip (bütçe 180KB, önce ~200KB).
- **Not:**
  - Yerelde (`localhost`) JS ilk boyamadan önce çalıştığı için Lighthouse LCP'ye hidrasyonu da katıyor (gözlenen LCP = FCP ≈ 250 ms iken benzetim 3.4–3.8 sn). Animasyon kapalıyken de aynı; kodla değil gerçek ağda ölçülmeli (§17: Vercel önizlemesi).
  - SEO 63: bilinçli `noindex`.
- **Geri alma:** —

### K-103 · 2026-09-25 · Animasyon ve lup kodu hidrasyondan sonra

- **Karar:**
  - Hidrasyondan sonra ayrı pakette (`next/dynamic`, `ssr: false`) gelenler:
    - bölüm animasyonları (`motion/lazy`: Hero, Nav, Vitrin, 10×, Atölye, Mağaza, levha);
    - hero kılavuz çizgisi;
    - imleç lupu (`loupe/lazy`);
    - GSAP çekirdeği, ScrollTrigger ve DrawSVG (`lib/gsap`, `lib/scroll`).
  - Lenis GSAP gelene dek kendi `requestAnimationFrame` döngüsünde; gelince GSAP ticker'ına geçip ScrollTrigger'a bağlanıyor (aynı saat, §14.1).
  - `refreshLoupe` küçük bir modülde (`loupe/refresh`); çağıranlar lup kodunu ilk yüke çekmiyor.
  - Durum noktası nabzı GSAP yerine CSS animasyonu (aynı tanım: 1 → 0.35, 1.6 sn, gidip gelen; reduced motion'da sabit).
  - Giriş gizlemesi (K-064):
    - sahibi (HeroMotion/PlateMotion) başlangıç durumlarını kurunca `introReady()` ile kalkıyor;
    - sayfa içi gezinmede yeniden açılıyor, sahip aynı commit'te hazırsa açılmıyor;
    - 3 sn güvenlik zamanlayıcısı var.
- **Gerekçe:** §17 "sayfa başına ilk yük ≤ 180 KB gzip". Ölçüm: ana sayfa 185KB (ScrollTrigger çıkınca) → 180KB (lup ve kılavuz çizgi çıkınca, bütçenin 86 bayt üstü) → 152KB (GSAP çekirdeği çıkınca). Test: hero bindirmeleri ilk `anim-ready` karesinde zaten başlangıç halinde (bir an görünüp kaybolma yok). Hareket, geçiş, şerit, menü, klavye ve lup testleri (masaüstü ve dokunmatik) yeniden geçti.
- **Geri alma:** Bölümlerde `motion/lazy` yerine doğrudan içe aktarma; `lib/gsap`'a ScrollTrigger ve DrawSVG kaydı.

### K-104 · 2026-09-28 · Mobilde yakınlaştırma kapalı

- **Karar:** Mobilde iki parmakla ve çift dokunuşla yakınlaştırma kapalı:
  - `layout.tsx` → `viewport`: `maximumScale: 1`, `userScalable: false`;
  - `globals.css` → `html { touch-action: pan-x pan-y }`. iOS Safari 10+ `user-scalable=no`'yu yok sayıyor, bu kural orada da çalışıyor.

  Başka öğede `touch-action` kullanılmıyor. Lup basılı tutması ve şerit kaydırması etkilenmiyor.
- **Gerekçe:** Kullanıcı isteği (inceleme A.1): büyütmeyi lup üstleniyor.
- **Bilinen yan etki:** WCAG 1.4.4'e aykırı. Lighthouse `meta-viewport` denetimi başarısız, Accessibility 100'ün altına düşer (≈ 90–95). Bilinçli karar; düzeltilmeyecek.
- **Geri alma:** `layout.tsx`'teki `viewport` export'unu ve `globals.css`'teki `touch-action` kuralını sil.

### K-105 · 2026-09-28 · Masaüstünde lup basılı tutunca açılır

- **Karar** (fare/kalem, `pointerType !== "touch"`):
  - Lup normalde kapalı, sistem imleci olduğu gibi. Linkler, metin seçimi ve sürükleme her zamanki gibi çalışıyor.
  - Sol tık basılıyken dış halka ve üstünde tutma süresinde dolan 1px kırmızı yay beliriyor (`html[data-loupe-holding]`). 2 sn (`LOUPE.mouseHoldMs`) dolunca lup imlecin ortasında açılıyor; imleç gizleniyor, metin seçimi kapanıyor (`html.loupe-open`).
  - Tutma şu durumlarda iptal:
    - 10px'ten fazla hareket (`LOUPE.touchSlop`);
    - sağ tık, `blur`, pencereden çıkış, `pointercancel`.
  - Basılıyken:
    - lup her yerde büyütüyor, yalnızca `data-loupe-off` alanlarında (Nav, footer, mobil menü) dış halkaya dönüyor;
    - link üstünde küçülme, kenar boşluğu ve 1.2 sn boşta kuralları kalktı (K-056 ve K-057'nin fare kısmının yerine geçer; `LOUPE.idleMs` silindi).
  - Bırakınca lup kapanıyor ve bırakmayı izleyen tek tıklama yutuluyor, link üstünde bırakınca sayfa değişmiyor (`lib/clickGuard`). Aynı yutma dokunmatik basılı tutmada da var (inceleme 2.3). Lenis'in anchor işleyicisi yakalama evresinde önce çalıştığı için o da `clickSwallowed()`'a bakıyor.
  - Basılıyken:
    - tarayıcının sürükle-bırakı engelleniyor (titreme tutmayı bozmasın; yan etkisi: sitede görsel/link sürükleme yok);
    - lup açıkken `selectstart` engelleniyor;
    - şerit (`DragScroll`) sürüklemeye başlamıyor.
  - Reduced motion: lerp 1, yay dolmadan tam daire; süre aynı.
  - `data-loupe-magnify` lupta işlevsiz kaldı; hücre seçicisi olarak `data-tray-cell` adını aldı (VitrinMotion).
- **Kırmızı bütçesi:** Yay sayfadaki üç odak kırmızısına (§8.1) sayılmıyor: kalıcı değil, yalnızca basılı tutarken görünen geçici bir etkileşim göstergesi.
- **Dokunmatik:** Değişmedi (180 ms basılı tutma, parmağın 60px üstünde).
- **Gerekçe:** Kullanıcı isteği (inceleme A.2): lup sürekli açık olmasın, imleç normal kalsın.
- **Geri alma:** Bu commit'i geri al (`useLoupe.ts`, `Loupe.tsx`, `globals.css` lup kuralları, `clickGuard.ts`).

### K-106 · 2026-09-28 · Hero'da cihaza göre kullanım bilgisi

- **Karar:**
  - Hero notundan "İMLECİNİZ BİR LUPTUR." çıktı. Notun altında cihaza göre tek satır çifti, kalıcı:
    - `pointer: fine`: "SOL TIKA 2 SN BASILI TUTUN — LUP AÇILIR. BIRAKINCA KAPANIR.";
    - `pointer: coarse`: "BİR PARÇAYA BASILI TUTUN — LUP AÇILIR.".
  - Renk damga kırmızısı (`tone="stamp"`). "10×" etiketleri gibi mono damga dili sayıldı, sayfanın üç odak kırmızısına (§8.1) girmiyor (K-054 ile aynı ayrım).
  - Lup kopyasında görünmüyor (`data-loupe-hide`).
  - Vitrin notu: "BİR PARÇAYA BASILI TUTUP YAKINDAN BAKIN."
  - İlk ziyaret ipucu (`LoupeHint`, `hint.ts`, "görüldü" kaydı) silindi; bilgi artık hep görünür.
- **Sapma:** İncelemede örnek lup notu "SOL TIK · 2 SN = LUP" tek metindi. Bu not ≥ 1024px'te görünüyor; yatay iPad gibi dokunmatik ekranda yanlış talimat olurdu. İlk satır da cihaza göre ikiye ayrıldı: fare "SOL TIK · 2 SN = LUP", dokunmatik "BASILI TUT = LUP".
- **Gerekçe:** İnceleme A.3: imleç artık lup değil; cihaza göre doğru talimat.
- **Geri alma:** `copy.ts` → `hero.howTo`, `hero.lens.howTo`; `Hero.tsx`'teki iki satır çifti.
