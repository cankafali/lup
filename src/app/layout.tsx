import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { GridLines } from "@/components/layout/GridLines";
import { Nav } from "@/components/layout/Nav";
import { site } from "@/content/site";
import "./globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: `%s — ${site.brandFull}`,
    default: `${site.brandFull} — Yakından bakın.`,
  },
  description: site.description,
  // Pitch aşaması: kuyumcu onaylayana kadar indekslenmez (§18).
  robots: { index: site.indexable, follow: site.indexable },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrument.variable}`}
    >
      <body>
        {/* Lup bu düğümü klonlar (§9.2). overflow-x: clip — kenara taşan eksen/çizgiler
            yatay kaydırma üretmesin; clip kaydırma kabı oluşturmadığı için sticky bozulmaz. */}
        <div id="lup-content" className="relative overflow-x-clip">
          <GridLines />
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
