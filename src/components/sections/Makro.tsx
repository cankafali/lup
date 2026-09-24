import { makro, photoNote } from "@/content/copy";
import { PlateFrame } from "@/components/layout/PlateFrame";
import { Callout } from "@/components/primitives/Callout";
import { DimensionLine } from "@/components/primitives/DimensionLine";
import { Headline, type HeadlineLine } from "@/components/primitives/Headline";
import { Lens } from "@/components/primitives/Lens";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { MakroMotion } from "@/components/motion/MakroMotion";
import { pct, type Pt, type ViewBox } from "@/lib/overlay";

/** Bölüm koordinat uzayı (§10.3): 1440×900 tuval; genişliğe göre ölçeklenir, 1440'ta birebir. */
const STAGE: ViewBox = [1440, 900];
const LENS_CENTER: Pt = [900, 450];
const LENS_D = 700;
const LENS_RING = 16;

const TITLE_LAYOUT: Pick<HeadlineLine, "indent" | "overlap">[] = [{}, { indent: 64 }];

/** Notlar: nokta → çizgi ucu → etiketin sol üstü (bölüm koordinatı). */
const NOTES: { point: Pt; to: Pt; labelAt: Pt; label: string }[] = [
  { point: [1090, 271], to: [1262, 206], labelAt: [1270, 190], label: makro.notes.prong },
  { point: [899, 449], to: [1262, 440], labelAt: [1270, 426], label: makro.notes.table },
  { point: [1070, 620], to: [1262, 700], labelAt: [1270, 686], label: makro.notes.hammer },
  { point: [718, 620], to: [548, 680], labelAt: [400, 666], label: makro.notes.girdle },
];

/** Notun lup iç dairesindeki konumu (0–1): dikey düzendeki numaralı noktalar için. */
const inLens = ([x, y]: Pt): Pt => [
  (x - (LENS_CENTER[0] - LENS_D / 2)) / LENS_D,
  (y - (LENS_CENTER[1] - LENS_D / 2)) / LENS_D,
];

/** Çap ölçüsü tuvalde 663 → 1135: lupun iç çapına göre aynı oran. */
const DIAMETER: [number, number] = [
  663 - (LENS_CENTER[0] - LENS_D / 2),
  1135 - (LENS_CENTER[0] - LENS_D / 2),
];

/**
 * 03 — 10× Makro (§10.3). Sayfanın ölçek kırılması: tek dev lup.
 * ≥ 1024: 1440×900 tuval. < 1024: dikey düzen (§15) — lup ekran genişliğinde (tablette en çok 560),
 * üstünde 1–4 numaralı noktalar, notlar altında numaralı liste, çap ölçüsü lupun altında.
 */
export function Makro() {
  return (
    <PlateFrame
      plate={3}
      id="makro"
      labelledBy="makro-baslik"
      className="max-lg:pb-16 lg:h-[max(900px,100svh)]"
    >
      <MakroMotion />
      {/* Tuval: içerik kabıyla aynı genişlikte (≤ 1440), dikeyde ortalı */}
      <div
        data-makro-stage
        className="[container-type:inline-size] absolute inset-x-0 top-1/2 mx-auto aspect-[1440/900] w-full max-w-[calc(var(--grid-max)+2*var(--grid-margin))] -translate-y-1/2 max-lg:hidden"
      >
        <div
          data-makro-lens
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(LENS_CENTER[0], STAGE[0]), top: pct(LENS_CENTER[1], STAGE[1]) }}
        >
          <Lens
            src="/images/lup-detay.jpg"
            alt={makro.lensAlt}
            diameter={LENS_D}
            diameterCss={`calc(${LENS_D} / 1440 * 100cqw)`}
            sizes="(min-width: 1024px) 49vw, 90vw"
            ring={LENS_RING}
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

      <div className="relative container-lup pt-[110px] max-md:pt-24 lg:h-full">
        <div className="grid-lup">
          <div className="col-span-4 max-lg:col-span-full">
            <MonoLabel tone="stamp" data-anim-label className="block">
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
        {/* ≥ 1024: genişlik, lupun sol kenarı (tuvalin %37'si) − eksen taşması 40 − ara 24 − kenar 64 */}
        <p className="max-w-[360px] text-body-l max-lg:mt-8 lg:absolute lg:top-[360px] lg:left-(--grid-margin) lg:max-w-[min(360px,37vw_-_128px)]">
          {makro.body}
        </p>

        {/* < 1024: dikey düzen */}
        <div data-makro-stack className="[container-type:inline-size] mt-12 lg:hidden">
          <div className="mx-auto w-fit">
            {/* Lup + numaralı noktalar (noktalar lupla birlikte büyür) */}
            <div data-makro-stack-lens className="relative">
              <Lens
                src="/images/lup-detay.jpg"
                alt={makro.lensAlt}
                diameter={LENS_D}
                diameterCss={`min(560px, 100cqw - ${2 * LENS_RING}px)`}
                sizes="(min-width: 768px) 560px, 90vw"
                ring={LENS_RING}
                label={makro.lensMark}
                labelPlacement="inside"
              />
              {NOTES.map((n, i) => {
                const [u, v] = inLens(n.point);
                return (
                  <span
                    key={n.label}
                    aria-hidden
                    data-makro-dot
                    className="absolute flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-graphite bg-paper font-mono text-mono-s"
                    style={{
                      left: `calc(${LENS_RING}px + (100% - ${2 * LENS_RING}px) * ${u})`,
                      top: `calc(${LENS_RING}px + (100% - ${2 * LENS_RING}px) * ${v})`,
                    }}
                  >
                    {i + 1}
                  </span>
                );
              })}
            </div>
            {/* Çap ölçüsü lupun altında; iç çapla aynı genişlikte */}
            <div className="relative mt-2 h-10" style={{ marginInline: LENS_RING }}>
              <DimensionLine
                viewBox={[LENS_D, 40]}
                from={[DIAMETER[0], 12]}
                to={[DIAMETER[1], 12]}
                label={makro.diameter}
                labelSide="below"
                offset={12}
                animate
              />
            </div>
          </div>
          <ol className="mx-auto mt-8 flex max-w-[560px] flex-col gap-4">
            {NOTES.map((n, i) => (
              <li key={n.label} data-makro-note className="flex gap-3">
                <MonoLabel tone="lead">{i + 1}</MonoLabel>
                <MonoLabel>{n.label}</MonoLabel>
              </li>
            ))}
          </ol>
        </div>

        <MonoLabel
          size="s"
          tone="lead"
          className="block max-lg:mt-10 lg:absolute lg:bottom-[35px] lg:left-(--grid-margin)"
        >
          {photoNote}
        </MonoLabel>
      </div>
    </PlateFrame>
  );
}
