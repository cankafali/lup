import { photoNote, vitrin } from "@/content/copy";
import { products } from "@/content/products";
import { PlateFrame } from "@/components/layout/PlateFrame";
import { Button } from "@/components/primitives/Button";
import { Headline, type HeadlineLine } from "@/components/primitives/Headline";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { VitrinMotion } from "@/components/motion/lazy";
import { TrayCell } from "./TrayCell";

/** İkinci satır 3. kolondan (mobilde 2.) başlar ve 34px bindirir. */
const TITLE_LAYOUT: Pick<HeadlineLine, "indent" | "indentMobile" | "overlap">[] = [
  {},
  { indent: "cols-2", indentMobile: "cols-1", overlap: 34 },
];

/** 02 — Vitrin (§10.2). */
export function Vitrin() {
  return (
    <PlateFrame
      plate={2}
      id="vitrin"
      labelledBy="vitrin-baslik"
      className="pt-[150px] pb-16 max-md:pt-24"
    >
      <VitrinMotion />
      <div className="container-lup">
        <MonoLabel data-anim-label className="block">
          {vitrin.label}
        </MonoLabel>
        <div className="relative mt-6">
          <Headline
            id="vitrin-baslik"
            size="l"
            lines={vitrin.title.map((line, i) => ({ ...line, ...TITLE_LAYOUT[i] }))}
          />
          {/* Masaüstünde başlığın alt çizgisine hizalı sağda; daha darda başlığın altında */}
          <div className="pointer-events-none absolute inset-0 grid-lup items-end max-lg:static max-lg:mt-6 max-lg:block">
            <MonoLabel
              tone="lead"
              className="col-span-3 col-start-10 block text-right max-lg:text-left"
            >
              {vitrin.note}
            </MonoLabel>
          </div>
        </div>

        {/* Tepsi: 3×2, aralıksız; dış çerçeve line-strong, ayırıcılar line */}
        <ul
          data-tray
          className="mt-[100px] grid grid-cols-3 border border-line-strong max-md:mt-12 max-md:grid-cols-2"
        >
          {products.map((p) => (
            <li
              key={p.slug}
              className="border-line max-md:odd:border-r md:[&:not(:nth-child(3n))]:border-r md:[&:nth-child(-n+3)]:border-b max-md:[&:nth-child(-n+4)]:border-b"
            >
              <TrayCell product={p} />
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-baseline justify-between gap-4 max-md:flex-col max-md:gap-1">
          <MonoLabel tone="lead">{vitrin.end(products.length)}</MonoLabel>
          <MonoLabel size="s" tone="lead">
            {photoNote}
          </MonoLabel>
          <Button href={vitrin.all.href} variant="link">
            {vitrin.all.label}
          </Button>
        </div>
      </div>
    </PlateFrame>
  );
}
