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
