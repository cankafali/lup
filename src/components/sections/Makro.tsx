import { makro, photoNote } from "@/content/copy";
import { PlateFrame } from "@/components/layout/PlateFrame";
import { Callout } from "@/components/primitives/Callout";
import { DimensionLine } from "@/components/primitives/DimensionLine";
import { Headline, type HeadlineLine } from "@/components/primitives/Headline";
import { Lens } from "@/components/primitives/Lens";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { pct, type Pt, type ViewBox } from "@/lib/overlay";

/** Bölüm koordinat uzayı (§10.3): 1440×900 tuval; genişliğe göre ölçeklenir, 1440'ta birebir. */
const STAGE: ViewBox = [1440, 900];
const LENS_CENTER: Pt = [900, 450];

const TITLE_LAYOUT: Pick<HeadlineLine, "indent" | "overlap">[] = [{}, { indent: 64 }];

/** Notlar: nokta → çizgi ucu → etiketin sol üstü (bölüm koordinatı). */
const NOTES: { point: Pt; to: Pt; labelAt: Pt; label: string }[] = [
  { point: [1090, 271], to: [1262, 206], labelAt: [1270, 190], label: makro.notes.prong },
  { point: [899, 449], to: [1262, 440], labelAt: [1270, 426], label: makro.notes.table },
  { point: [1070, 620], to: [1262, 700], labelAt: [1270, 686], label: makro.notes.hammer },
  { point: [718, 620], to: [548, 680], labelAt: [400, 666], label: makro.notes.girdle },
];

/** 03 — 10× Makro (§10.3). Sayfanın ölçek kırılması: tek dev lup. */
export function Makro() {
  return (
    <PlateFrame plate={3} id="makro" labelledBy="makro-baslik" className="h-[max(900px,100svh)]">
      {/* Tuval: içerik kabıyla aynı genişlikte (≤ 1440), dikeyde ortalı */}
      <div
        data-makro-stage
        className="[container-type:inline-size] absolute inset-x-0 top-1/2 mx-auto aspect-[1440/900] w-full max-w-[calc(var(--grid-max)+2*var(--grid-margin))] -translate-y-1/2"
      >
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(LENS_CENTER[0], STAGE[0]), top: pct(LENS_CENTER[1], STAGE[1]) }}
        >
          <Lens
            src="/images/lup-detay.jpg"
            alt={makro.lensAlt}
            diameter={700}
            diameterCss="calc(700 / 1440 * 100cqw)"
            sizes="(min-width: 1024px) 49vw, 90vw"
            ring={16}
            label={makro.lensMark}
            labelPlacement="inside"
            axes={{ h: 40, v: 30 }}
            axesOpacity={0.4}
          />
        </div>

        {NOTES.map((n) => (
          <Callout
            key={n.label}
            viewBox={STAGE}
            point={n.point}
            to={n.to}
            labelAt={n.labelAt}
            label={n.label}
            dotSize={8}
          />
        ))}

        <DimensionLine
          viewBox={STAGE}
          from={[663, 846]}
          to={[1135, 846]}
          label={makro.diameter}
          labelSide="below"
          offset={30}
          animate
        />
      </div>

      <div className="relative container-lup h-full pt-[110px]">
        <div className="grid-lup">
          <div className="col-span-4">
            <MonoLabel tone="stamp" className="block">
              {makro.label}
            </MonoLabel>
            <Headline
              id="makro-baslik"
              size="m"
              className="mt-6"
              lines={makro.title.map((line, i) => ({ ...line, ...TITLE_LAYOUT[i] }))}
            />
          </div>
        </div>
        <p className="absolute top-[360px] left-(--grid-margin) max-w-[360px] text-body-l">
          {makro.body}
        </p>
        <MonoLabel size="s" tone="lead" className="absolute bottom-[35px] left-(--grid-margin)">
          {photoNote}
        </MonoLabel>
      </div>
    </PlateFrame>
  );
}
