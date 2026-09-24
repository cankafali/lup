import { photoNote, vitrin } from "@/content/copy";
import { products } from "@/content/products";
import { PlateFrame } from "@/components/layout/PlateFrame";
import { Button } from "@/components/primitives/Button";
import { Headline, type HeadlineLine } from "@/components/primitives/Headline";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { VitrinMotion } from "@/components/motion/VitrinMotion";
import { TrayCell } from "./TrayCell";

/** İkinci satır 3. kolondan başlar ve 34px bindirir. */
const TITLE_LAYOUT: Pick<HeadlineLine, "indent" | "overlap">[] = [
  {},
  { indent: "cols-2", overlap: 34 },
];

/** 02 — Vitrin (§10.2). */
export function Vitrin() {
  return (
    <PlateFrame plate={2} id="vitrin" labelledBy="vitrin-baslik" className="pt-[150px] pb-16">
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
          <div className="pointer-events-none absolute inset-0 grid-lup items-end max-lg:hidden">
            <MonoLabel tone="lead" className="col-span-3 col-start-10 block text-right">
              {vitrin.note}
            </MonoLabel>
          </div>
        </div>

        {/* Tepsi: 3×2, aralıksız; dış çerçeve line-strong, ayırıcılar line */}
        <ul data-tray className="mt-[100px] grid grid-cols-3 border border-line-strong">
          {products.map((p) => (
            <li
              key={p.slug}
              className="border-line [&:not(:nth-child(3n))]:border-r [&:nth-child(-n+3)]:border-b"
            >
              <TrayCell product={p} />
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-baseline justify-between gap-4">
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
