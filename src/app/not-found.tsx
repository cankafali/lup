import type { Metadata } from "next";
import Link from "next/link";
import { notFoundPage, productPage } from "@/content/copy";
import { PlateFrame } from "@/components/layout/PlateFrame";
import { Headline } from "@/components/primitives/Headline";
import { MonoLabel } from "@/components/primitives/MonoLabel";

export const metadata: Metadata = { title: notFoundPage.title };

/** Bilinmeyen adres ve olmayan parça (inceleme 6): levha dilinde, tezgâha dönüş linkiyle. */
export default function NotFound() {
  return (
    <main id="icerik" tabIndex={-1} className="pt-(--nav-h)">
      <PlateFrame
        plate={0}
        header={false}
        labelledBy="bulunamadi-baslik"
        className="flex min-h-[calc(100svh-var(--nav-h))] items-center py-24"
      >
        <div className="container-lup w-full">
          <MonoLabel tone="lead" className="block">
            {notFoundPage.label}
          </MonoLabel>
          <Headline
            as="h1"
            id="bulunamadi-baslik"
            size="l"
            className="mt-6"
            lines={notFoundPage.heading.map((line, i) => ({
              ...line,
              ...(i === 1 ? { indent: "cols-1" as const } : {}),
            }))}
          />
          <MonoLabel className="mt-10 block">{notFoundPage.note}</MonoLabel>
          <Link
            href={productPage.back.href}
            className="mt-6 tap inline-block font-mono text-mono underline-offset-4 hover:underline"
          >
            <span aria-hidden>{productPage.back.arrow}</span> {productPage.back.label}
          </Link>
        </div>
      </PlateFrame>
    </main>
  );
}
