# İLERLEME

| Aşama | Başlangıç | Bitiş | Durum |
|---|---|---|---|
| 0 — Kurulum | 2026-09-24 | 2026-09-24 | Tamam |
| 1 — Token'lar, tipografi, grid, primitives | — | — | — |
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
