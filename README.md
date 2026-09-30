# LUP — Sönmez Kuyumculuk

**Sitede 10×. Mağazada 1:1.**

Kapalıçarşı'daki Sönmez Kuyumculuk için hazırlanmış tanıtım sitesi.

- **Anlatım:** Parçalar fiyatla değil teknik çizim levhaları ve sertifikalarla anlatılıyor.
- **Lup:** Sitede her şey kasıtlı olarak küçük; yakından bakmak için bir lup var.
- **Amaç:** Ziyaretçiyi mağazaya, parçayı elde görmeye davet etmek.

| Ana sayfa | Lup | Ürün sayfası |
|---|---|---|
| ![Ana sayfa](docs/ekran-ana.jpg) | ![Lup](docs/ekran-lup.jpg) | ![Ürün sayfası](docs/ekran-urun.jpg) |

## Sitede neler var

- **Ana sayfa:** Açılış, altı parçalık vitrin, 10× büyütme bölümü, atölye ve mağaza (adres, saatler, "şu an açık / kapalı", WhatsApp'tan randevu).
- **Ürün sayfaları:** Her parça için teknik çizim levhası ve sertifika (ayar, ağırlık, taş, ölçü). "Mağazada 1:1 görün" butonu parçanın adıyla hazır bir WhatsApp mesajı açar.
- **Lup:**
  - Bilgisayarda sol tıka 2 saniye basılı tutunca açılır, bırakınca kapanır.
  - Telefonda bir parçaya basılı tutunca açılır.
- Mobil ve tablet uyumlu. Hareket azaltma tercihi olan ziyaretçiye animasyonsuz gösterilir.

> Site şu an **arama motorlarına kapalı** (`noindex`). Kuyumcu onaylayınca açılacak; aşağıda "Yayına almadan önce" bölümüne bakın.

## Bilgisayarda çalıştırma

Gerekenler: [Node.js](https://nodejs.org) 20.9 ya da üstü ve [pnpm](https://pnpm.io) (`npm install -g pnpm`).

```bash
pnpm install
pnpm dev
```

Site `http://localhost:3000` adresinde açılır; dosyalarda yaptığınız değişiklikler anında görünür.

| Komut | Ne yapar |
|---|---|
| `pnpm dev` | Geliştirme sunucusunu başlatır |
| `pnpm build` | Yayın için derler |
| `pnpm start` | Derlenmiş siteyi çalıştırır (önce `pnpm build`) |
| `pnpm lint` | Kod kurallarını denetler |
| `pnpm typecheck` | Tip denetimi |
| `pnpm test` | Birim testleri |
| `pnpm test:e2e` | Tarayıcıda uçtan uca testler (önce `pnpm build`) |

## İçerik nasıl değiştirilir

Sitedeki tüm yazılar ve bilgiler `src/content/` klasöründe; tasarıma dokunmadan buradan değiştirilir.

| Ne değişecek | Dosya | Not |
|---|---|---|
| Telefon, WhatsApp, adres, harita linki, Instagram | `src/content/site.ts` | WhatsApp numarası ülke koduyla, boşluksuz: `905xxxxxxxxx` |
| Çalışma saatleri | `src/content/site.ts` → `hours` | `open` günleri sayıyla (0 = Pazar … 6 = Cumartesi); yazıyla gösterilen `days` ve `label` da güncellenmeli |
| Sayfa metinleri, başlıklar, buton yazıları | `src/content/copy.ts` | |
| Parçalar (ad, açıklama, ayar, ağırlık, taş, ölçüler) | `src/content/products.ts` | Yeni parça için mevcut birini kopyalayıp değiştirin; çizim tipi altı türden biri olmalı |
| Fotoğraflar | `public/images/` | Değişince `node scripts/blur.mjs` çalıştırın (yüklenirken görünen bulanık önizleme) |

Kuyumcudan gelmesi beklenen bilgiler:

- **Telefon ve WhatsApp:** Şu an örnek numara; site derlenirken uyarı verir.
- **Adres, saatler, ölçüler:** Adres, çalışma saatleri ve parçaların gerçek ölçüleri teyit edilmeli (ayrıntı: [`ILERLEME.md`](ILERLEME.md), Aşama 9).

## Yayına alma

Site [Vercel](https://vercel.com) için hazır:

```bash
npx vercel login
npx vercel
```

İlk komut hesabınıza giriş yapar, ikincisi bir önizleme adresi verir. Asıl yayın için `npx vercel --prod`.

Vercel dışında bir yerde yayınlanacaksa sitenin adresi `NEXT_PUBLIC_SITE_URL` ortam değişkeniyle verilmeli (ör. `https://sonmezkuyumculuk.com`). Verilmezse WhatsApp'ta paylaşılan linklerin önizleme görseli çalışmaz.

**Yayına almadan önce**

- [ ] `site.ts`'te gerçek telefon ve WhatsApp numarası
- [ ] Adres, saatler ve parça bilgileri kuyumcudan teyitli
- [ ] Arama motorlarına açmak için `site.ts` → `indexable: true`

## Klasörler

```
src/
  content/      metinler ve bilgiler: site.ts, copy.ts, products.ts
  app/          sayfalar: ana sayfa, /parca/…, 404, paylaşım görselleri
  components/   bölümler, lup, teknik çizimler, animasyonlar
  styles/       renk ve yazı ayarları (tokens.css)
  lib/          yardımcı kodlar
public/images/  fotoğraflar
docs/           ekran görüntüleri ve teknik notlar
```

## Daha fazlası

- [`docs/TEKNIK.md`](docs/TEKNIK.md): Kullanılan teknolojiler, lupun nasıl çalıştığı, `data-*` öznitelikleri, görseller, testler.
- [`KARARLAR.md`](KARARLAR.md): Tasarım ve teknik kararların gerekçeleriyle kaydı.
- [`ILERLEME.md`](ILERLEME.md): Aşama aşama ne yapıldı, neler doğrulandı, neler açık.
