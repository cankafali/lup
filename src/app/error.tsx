"use client";

import { useEffect } from "react";
import Link from "next/link";
import { errorPage } from "@/content/copy";
import { PlateFrame } from "@/components/layout/PlateFrame";
import { Headline } from "@/components/primitives/Headline";
import { MonoLabel } from "@/components/primitives/MonoLabel";

/**
 * Kök hata sınırı (inceleme 6): sayfa içindeki bir istemci hatası (ör. bölüm animasyonu) sayfanın tamamını
 * düşürmesin. Nav ve footer yerinde kalır; "Yeniden dene" bölümü yeniden çizer.
 */
export default function RootError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="icerik" tabIndex={-1} className="pt-(--nav-h)">
      <PlateFrame
        plate={0}
        header={false}
        labelledBy="hata-baslik"
        className="flex min-h-[calc(100svh-var(--nav-h))] items-center py-24"
      >
        <div className="container-lup w-full">
          <MonoLabel tone="lead" className="block">
            {errorPage.label}
          </MonoLabel>
          <Headline
            as="h1"
            id="hata-baslik"
            size="l"
            className="mt-6"
            lines={errorPage.title.map((line, i) => ({
              ...line,
              ...(i === 1 ? { indent: "cols-1" as const } : {}),
            }))}
          />
          <MonoLabel className="mt-10 block">{errorPage.note}</MonoLabel>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2">
            <button
              type="button"
              onClick={() => retry()}
              className="tap font-mono text-mono uppercase underline decoration-1 underline-offset-4"
            >
              {errorPage.retry}
            </button>
            <Link
              href={errorPage.home.href}
              className="tap font-mono text-mono underline-offset-4 hover:underline"
            >
              <span aria-hidden>{errorPage.home.arrow}</span> {errorPage.home.label}
            </Link>
          </div>
        </div>
      </PlateFrame>
    </main>
  );
}
