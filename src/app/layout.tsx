import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import { GridLines } from "@/components/layout/GridLines";
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
    template: "%s — Sönmez Kuyumculuk",
    default: "Sönmez Kuyumculuk — Yakından bakın.",
  },
  description:
    "Kapalıçarşı'da 1987'den beri aynı tezgâh. Parçaları sitede 10× büyütün, mağazada 1:1 görün.",
  // Pitch aşaması: kuyumcu onaylayana kadar indekslenmez (§18).
  robots: { index: false, follow: false },
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
          {children}
        </div>
      </body>
    </html>
  );
}
