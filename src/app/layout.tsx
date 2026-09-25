import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { GridLines } from "@/components/layout/GridLines";
import { Nav } from "@/components/layout/Nav";
import { Loupe } from "@/components/loupe/lazy";
import { INTRO_SCRIPT } from "@/components/motion/introScript";
import { MotionReady } from "@/components/motion/MotionReady";
import { nav } from "@/content/copy";
import { site } from "@/content/site";
import { LenisProvider } from "@/lib/lenis";
import { SITE_URL } from "@/lib/siteUrl";
import "./globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    template: `%s — ${site.brandFull}`,
    default: `${site.brandFull} — Yakından bakın.`,
  },
  description: site.description,
  // Paylaşım görseli opengraph-image.tsx'ten; Twitter og:image'a düşer
  openGraph: { type: "website", locale: "tr_TR", siteName: site.brandFull },
  twitter: { card: "summary_large_image" },
  // Pitch aşaması: kuyumcu onaylayana kadar indekslenmez (§18).
  robots: { index: site.indexable, follow: site.indexable },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // <html> sınıflarına hidrasyondan önce betik (js-anim) ve sonra Lenis/lup ekleme yapıyor
    <html
      lang="tr"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <LenisProvider>
          {/* Lup bu düğümü klonlar (§9.2). overflow-x: clip — kenara taşan eksen/çizgiler
              yatay kaydırma üretmesin; clip kaydırma kabı oluşturmadığı için sticky bozulmaz. */}
          <div id="lup-content" className="relative overflow-x-clip">
            {/* §16: ilk odaklanan öğe; odakta görünür */}
            <a
              href="#icerik"
              data-loupe-hide
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-30 focus:border focus:border-graphite focus:bg-paper focus:px-4 focus:py-3 focus:font-mono focus:text-mono"
            >
              {nav.skip}
            </a>
            <GridLines />
            <Nav />
            {children}
            <Footer />
          </div>
          {/* İçeriğin kardeşi: klonlanmaz, içeriğin üstünde sabit (§9.2) */}
          <Loupe />
          {/* En son: giriş animasyonları kurulduktan sonra gizlemeyi kaldırır */}
          <MotionReady />
        </LenisProvider>
      </body>
    </html>
  );
}
