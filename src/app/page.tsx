import type { Metadata } from "next";
import { Suspense } from "react";
import { StoreJsonLd } from "@/components/layout/StoreJsonLd";
import { Atolye } from "@/components/sections/Atolye";
import { Hero } from "@/components/sections/Hero";
import { Magaza } from "@/components/sections/Magaza";
import { Makro } from "@/components/sections/Makro";
import { Vitrin } from "@/components/sections/Vitrin";

// Önizleme ve dal adresleri aynı içeriği yinelemesin (inceleme 6). Kökte değil burada: 404 miras almasın
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <main id="icerik" tabIndex={-1}>
      <StoreJsonLd />
      <Hero />
      {/* Hiçbiri askıya alınmaz: sınırlar yalnızca hidrasyonu parçalara böler, açılışta tek uzun
          görev olmasın (§17, K-096) */}
      <Suspense>
        <Vitrin />
      </Suspense>
      <Suspense>
        <Makro />
      </Suspense>
      <Suspense>
        <Atolye />
      </Suspense>
      <Suspense>
        <Magaza />
      </Suspense>
    </main>
  );
}
