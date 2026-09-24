import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
