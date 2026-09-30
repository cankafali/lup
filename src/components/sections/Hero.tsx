import { hero, photoNote, plate } from "@/content/copy";
import { PlateFrame } from "@/components/layout/PlateFrame";
import { Axis } from "@/components/primitives/Axis";
import { Callout } from "@/components/primitives/Callout";
import { DimensionLine } from "@/components/primitives/DimensionLine";
import { Headline, type HeadlineLine } from "@/components/primitives/Headline";
import { Lens } from "@/components/primitives/Lens";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { PhotoOverlay } from "@/components/primitives/PhotoOverlay";
import { pct, type Pt, type ViewBox } from "@/lib/overlay";
import { HeroMotion } from "@/components/motion/lazy";
import { HeroGuide } from "@/components/motion/lazy";

// Bindirme koordinatları hero-tektas.jpg'nin piksel uzayında (§10.1).
const IMG: ViewBox = [hero.image.w, hero.image.h];
const STONE: Pt = [869, 404];
const SECTION_MARK: Pt = [880, 520];

/** Satır 1: optik düzeltme −8px. Satır 2: 3. kolondan (mobilde 2.) başlar, −20px bindirir. */
const TITLE_LAYOUT: Pick<HeadlineLine, "indent" | "indentMobile" | "overlap">[] = [
  { indent: -8 },
  { indent: "cols-2", indentMobile: "cols-1", overlap: 20 },
];

/** 01 — Hero (§10.1). */
export function Hero() {
  return (
    <PlateFrame
      plate={1}
      header={false}
      labelledBy="hero-baslik"
      intro
      className="h-svh max-h-[1000px] min-h-[760px] overflow-hidden max-md:min-h-[600px]"
    >
      <HeroMotion />
      <div data-hero-photo data-intro-keep className="absolute inset-0">
        <PhotoOverlay
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.w}
          height={hero.image.h}
          sizes="100vw"
          priority
          positionMobile={[0.72, 0.5]}
          className="size-full"
        >
          {/* Mobilde yalnızca taş işareti ve çap ölçüsü kalır (§15) */}
          <svg
            aria-hidden
            className="absolute inset-0 size-full text-graphite max-md:hidden"
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
            data-hero-mark
            className="absolute -translate-x-1/2 -translate-y-1/2 max-md:hidden"
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
            name="band"
            className="max-md:hidden"
          />
          {/* Taş işareti: sayfanın üç odak kırmızısından biri */}
          <Callout viewBox={IMG} point={STONE} dot="stamp" name="stone" />
        </PhotoOverlay>
      </div>

      {/* Nav altındaki ikinci satır */}
      <div data-hero-meta className="absolute inset-x-0 top-24 max-md:hidden">
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

      {/* Mobilde koordinat satırı gizli; temsili görsel notu sağ üstte */}
      <MonoLabel
        size="s"
        tone="lead"
        className="absolute top-[76px] right-(--grid-margin) md:hidden"
      >
        {photoNote}
      </MonoLabel>

      {/* Örnek lup + kılavuz çizgi: fotoğrafla aynı parallax katmanında (taşa kilitli kalsın) */}
      <div data-hero-lens-layer className="pointer-events-none absolute inset-0">
        {/* 4. kolonun başı, üstten 172px; 1024 altında gizli */}
        <div className="absolute inset-x-0 top-[172px] hidden lg:block">
          <div className="container-lup">
            <div className="grid-lup">
              <div data-hero-lens className="relative col-span-3 col-start-4">
                <Lens src="/images/lup-hero.jpg" alt={hero.lens.alt} diameter={240} ring={8} />
                <p
                  data-hero-caption
                  className="absolute top-1/2 right-[calc(100%+24px)] w-max -translate-y-1/2"
                >
                  <MonoLabel tone="stamp" className="block">
                    {hero.lens.mark}
                  </MonoLabel>
                  <MonoLabel className="mt-1 hidden [@media(pointer:fine)]:block">
                    {hero.lens.howTo.mouse}
                  </MonoLabel>
                  <MonoLabel className="mt-1 hidden [@media(pointer:coarse)]:block">
                    {hero.lens.howTo.touch}
                  </MonoLabel>
                  <MonoLabel className="block">{hero.lens.caption}</MonoLabel>
                </p>
              </div>
            </div>
          </div>
        </div>
        <HeroGuide fit={{ w: IMG[0], h: IMG[1] }} stone={STONE} />
      </div>

      {/* Başlık ve not ilk boyamada CSS ile girer (K-095) */}
      <div data-intro-keep className="absolute inset-x-0 bottom-0">
        <div className="relative container-lup pb-14 max-md:pb-8">
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
          {/* Sağ alt metin; mobilde başlığın altına iner (§15) */}
          <div className="pointer-events-none absolute inset-x-(--grid-margin) bottom-12 grid-lup max-md:pointer-events-auto max-md:static max-md:mt-6 max-md:block">
            <div
              data-hero-note
              className="pointer-events-auto col-span-3 col-start-10 max-w-[240px] max-lg:col-span-3 max-lg:col-start-6"
            >
              <MonoLabel className="block">{hero.note}</MonoLabel>
              {/* Kullanım bilgisi (K-106): cihaza göre biri; lupun kopyasında yok */}
              <MonoLabel
                tone="stamp"
                data-loupe-hide
                className="mt-3 hidden [@media(pointer:fine)]:block"
              >
                {hero.howTo.mouse}
              </MonoLabel>
              <MonoLabel
                tone="stamp"
                data-loupe-hide
                className="mt-3 hidden [@media(pointer:coarse)]:block"
              >
                {hero.howTo.touch}
              </MonoLabel>
              <a
                href={hero.down.href}
                className="mt-5 tap inline-block font-mono text-mono whitespace-pre underline-offset-4 hover:underline max-md:mt-3"
              >
                <span aria-hidden>{hero.down.arrow}</span>
                {"  "}
                {hero.down.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </PlateFrame>
  );
}
