import { magaza } from "@/content/copy";
import { getProduct } from "@/content/products";
import { site } from "@/content/site";
import { PlateFrame } from "@/components/layout/PlateFrame";
import { Button } from "@/components/primitives/Button";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { RingFront } from "@/components/product/drawings/RingFront";
import { waLink } from "@/lib/whatsapp";
import { OpenStatus } from "./OpenStatus";

/** Küçük yüzük çizimi: Tektaş Rüya'nın ön görünüşü, levhadaki ölçülerle. */
const ICON_SPEC = getProduct("tektas-ruya")?.drawingSpec;

/** 05 — Mağaza (§10.5). Harita yok. */
export function Magaza() {
  return (
    <PlateFrame
      plate={5}
      id="magaza"
      labelledBy="magaza-baslik"
      className="min-h-[900px] pt-[110px] pb-16"
    >
      <div className="container-lup">
        <h2 id="magaza-baslik">
          <MonoLabel>{magaza.label}</MonoLabel>
        </h2>

        {/* Büyük karşılaştırma: iki yarım, ortada 1px dikey çizgi */}
        <div className="relative mt-10 grid-lup min-h-[420px]">
          <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-graphite" />
          <div className="col-span-6 flex flex-col">
            <MonoLabel tone="lead">{magaza.site.label}</MonoLabel>
            <p data-compare="site" className="mt-4 text-mega">
              {magaza.site.figure}
            </p>
            <div className="mt-auto flex items-end gap-6 pt-8">
              <svg
                aria-hidden
                viewBox="-92 -99 184 192"
                className="size-12 shrink-0 text-graphite [&_*]:[vector-effect:non-scaling-stroke]"
              >
                {ICON_SPEC?.kind === "solitaire" && (
                  <RingFront
                    innerDiameter={ICON_SPEC.innerDiameter}
                    band={ICON_SPEC.section.thickness}
                    stone={ICON_SPEC.stone}
                  />
                )}
              </svg>
              <p className="text-body whitespace-pre-line text-lead">{magaza.site.text}</p>
            </div>
          </div>
          <div className="col-span-6 flex flex-col">
            <MonoLabel tone="lead">{magaza.store.label}</MonoLabel>
            {/* İtalik 1'in ayağı sola taşar; orta çizgiye değmesin */}
            <p data-compare="store" className="mt-4 pl-[0.06em] font-serif text-mega-italic italic">
              {magaza.store.figure}
            </p>
            <p className="mt-auto pt-8 text-body whitespace-pre-line">{magaza.store.text}</p>
          </div>
        </div>

        {/* Bilgi satırı */}
        <div className="mt-16 grid-lup gap-y-10 border-t border-line-strong pt-10">
          <div className="col-span-6 flex flex-col gap-3">
            <p className="text-item">{site.address.line1}</p>
            <p className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-mono">
              <span className="whitespace-pre text-lead">{magaza.hours}</span>
              <a href={`tel:${site.phone.tel}`} className="underline-offset-4 hover:underline">
                {site.phone.display}
              </a>
            </p>
            <OpenStatus fallback={magaza.hours} />
          </div>
          <div className="col-span-4 col-start-9 flex flex-col items-start gap-5">
            {/* Sayfanın üç odak kırmızısından biri */}
            <Button href={waLink(magaza.ctaMessage)} external className="w-full">
              {magaza.cta}
            </Button>
            <Button href={site.address.mapsUrl} external variant="link">
              {magaza.directions}
            </Button>
          </div>
        </div>
      </div>
    </PlateFrame>
  );
}
