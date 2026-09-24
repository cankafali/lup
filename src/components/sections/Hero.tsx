import { hero, photoNote, plate } from "@/content/copy";
import { LoupeHint } from "@/components/loupe/LoupeHint";
import { PlateFrame } from "@/components/layout/PlateFrame";
import { Axis } from "@/components/primitives/Axis";
import { Callout } from "@/components/primitives/Callout";
import { DimensionLine } from "@/components/primitives/DimensionLine";
import { Headline, type HeadlineLine } from "@/components/primitives/Headline";
import { Lens } from "@/components/primitives/Lens";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { PhotoOverlay } from "@/components/primitives/PhotoOverlay";
import { pct, type Pt, type ViewBox } from "@/lib/overlay";
import { HeroGuide } from "./HeroGuide";

// Bindirme koordinatları hero-tektas.jpg'nin piksel uzayında (§10.1).
const IMG: ViewBox = [hero.image.w, hero.image.h];
const STONE: Pt = [869, 404];
const SECTION_MARK: Pt = [880, 520];

/** Satır 1: optik düzeltme −8px. Satır 2: 3. kolondan başlar, −20px bindirir. */
const TITLE_LAYOUT: Pick<HeadlineLine, "indent" | "overlap">[] = [
  { indent: -8 },
  { indent: "cols-2", overlap: 20 },
];

/** 01 — Hero (§10.1). */
export function Hero() {
  return (
    <PlateFrame
      plate={1}
      header={false}
      labelledBy="hero-baslik"
      className="h-svh max-h-[1000px] min-h-[760px] overflow-hidden"
    >
      <div className="absolute inset-0">
        <PhotoOverlay
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.w}
          height={hero.image.h}
          sizes="100vw"
          priority
          className="size-full"
        >
          <svg
            aria-hidden
            className="absolute inset-0 size-full text-graphite"
            viewBox={`0 0 ${IMG[0]} ${IMG[1]}`}
            preserveAspectRatio="none"
          >
            <Axis from={[869, 282]} to={[869, 546]} opacity={0.5} />
          </svg>
          <DimensionLine
            viewBox={IMG}
            from={[805, 318]}
            to={[935, 318]}
            label={hero.overlay.stone}
            animate
          />
          <MonoLabel
            aria-hidden
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: pct(SECTION_MARK[0], IMG[0]),
              top: pct(SECTION_MARK[1], IMG[1]),
            }}
          >
            {hero.overlay.section}
          </MonoLabel>
          <Callout
            viewBox={IMG}
            point={[1210, 338]}
            to={[1210, 372]}
            label={hero.overlay.band}
            labelAt={[1210, 380]}
            labelAlign="end"
            dotSize={8}
          />
          {/* Taş işareti: sayfanın üç odak kırmızısından biri */}
          <Callout viewBox={IMG} point={STONE} dot="stamp" />
        </PhotoOverlay>
      </div>

      {/* Nav altındaki ikinci satır */}
      <div className="absolute inset-x-0 top-24 max-md:hidden">
        <div className="container-lup flex justify-between pt-4">
          <MonoLabel size="s" tone="lead">
            {hero.coords}
          </MonoLabel>
          <p className="text-right">
            <MonoLabel size="s" tone="lead" className="block">
              {plate.label(1, plate.total)}
            </MonoLabel>
            <MonoLabel size="s" tone="lead" className="block">
              {photoNote}
            </MonoLabel>
          </p>
        </div>
      </div>

      {/* Örnek lup: 4. kolonun başı, üstten 172px; 1024 altında gizli */}
      <div className="absolute inset-x-0 top-[172px] hidden lg:block">
        <div className="container-lup">
          <div className="grid-lup">
            <div data-hero-lens className="relative col-span-3 col-start-4">
              <Lens src="/images/lup-hero.jpg" alt={hero.lens.alt} diameter={240} ring={8} />
              <p className="absolute top-1/2 right-[calc(100%+24px)] w-max -translate-y-1/2">
                <MonoLabel tone="stamp" className="block">
                  {hero.lens.mark}
                </MonoLabel>
                <MonoLabel className="mt-1 block">{hero.lens.caption}</MonoLabel>
              </p>
            </div>
          </div>
        </div>
      </div>

      <HeroGuide fit={{ w: IMG[0], h: IMG[1] }} stone={STONE} />

      <div className="absolute inset-x-0 bottom-0">
        <div className="relative container-lup pb-14">
          <Headline
            as="h1"
            id="hero-baslik"
            size="xl"
            srLabel={hero.srTitle}
            lines={hero.title.map((line, i) => ({
              ...line,
              ...TITLE_LAYOUT[i],
            }))}
          />
          <div className="pointer-events-none absolute inset-x-(--grid-margin) bottom-12 grid-lup">
            <div className="pointer-events-auto col-span-3 col-start-10 max-w-[240px] max-lg:col-span-4 max-lg:col-start-5">
              <MonoLabel className="block">{hero.note}</MonoLabel>
              <a
                href={hero.down.href}
                className="mt-5 inline-block font-mono text-mono whitespace-pre underline-offset-4 hover:underline"
              >
                {hero.down.label}
              </a>
              <LoupeHint text={hero.loupeHint} className="mt-3" />
            </div>
          </div>
        </div>
      </div>
    </PlateFrame>
  );
}
