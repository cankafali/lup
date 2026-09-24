import Image from "next/image";
import Link from "next/link";
import { vitrin } from "@/content/copy";
import type { Product } from "@/content/products";
import { DimensionLine } from "@/components/primitives/DimensionLine";
import { Lens } from "@/components/primitives/Lens";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Stamp } from "@/components/primitives/Stamp";
import type { ViewBox } from "@/lib/overlay";

/** Hücre koordinat uzayı (§10.2): 4:5, 1440'ta ≈ 437×546. */
const CELL: ViewBox = [440, 550];

/**
 * Tepsi hücresi (§10.2). Hücrenin tamamı ürün sayfasına link.
 * Hover sade: çerçeve graphite, "İNCELE →" belirir; fotoğraf büyümez (lup zaten büyütüyor).
 * Çerçeve, komşu hücrelerle paylaşılan 1px ayırıcıların üstüne binen bir ::after ile çizilir.
 */
export function TrayCell({ product: p }: { product: Product }) {
  const o = p.overlay;

  return (
    <Link
      href={`/parca/${p.slug}`}
      aria-label={`${p.name} — ${p.dataLine}`}
      data-loupe-magnify
      className="group [container-type:inline-size] relative block aspect-[4/5] after:pointer-events-none after:absolute after:-inset-px after:border after:border-transparent after:transition-colors after:duration-(--duration-fast) after:ease-lup hover:z-10 hover:after:border-graphite focus-visible:z-10 focus-visible:outline-offset-[-2px]"
    >
      {o.kind === "lens" ? (
        // 06 — Telkari: fotoğraf yerine statik lup; merkez (220, 236), iç çap 300.
        <div className="absolute top-[42.91%] left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Lens
            src={p.image.src}
            alt={p.image.alt}
            diameter={300}
            diameterCss="calc(300 / 440 * 100cqw)"
            sizes="(min-width: 1024px) 21vw, 50vw"
            ring={8}
            label={vitrin.lensMark}
            axes
          />
        </div>
      ) : (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={p.image.src}
            alt={p.image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
            style={p.image.objectPosition ? { objectPosition: p.image.objectPosition } : undefined}
            data-hires={p.image.hires}
          />
        </div>
      )}

      {o.kind === "h" && (
        <DimensionLine
          viewBox={CELL}
          from={[o.x1, o.y]}
          to={[o.x2, o.y]}
          label={o.label}
          labelSide={o.labelSide}
          animate
        />
      )}
      {o.kind === "v" && (
        <DimensionLine
          viewBox={CELL}
          from={[o.x, o.y1]}
          to={[o.x, o.y2]}
          label={o.label}
          labelSide={o.labelSide}
          animate
        />
      )}

      <MonoLabel className="absolute top-5 left-6">{vitrin.no(p.no)}</MonoLabel>
      <Stamp seed={p.slug} className="absolute top-[17px] right-6">
        {p.karat.hallmark}
      </Stamp>

      {o.kind === "lens" && (
        <MonoLabel tone="lead" className="absolute bottom-[108px] left-6">
          {vitrin.filigree}
        </MonoLabel>
      )}

      <div className="absolute inset-x-6 bottom-[34px] flex items-end justify-between gap-4">
        <div>
          <p className="text-item">{p.name}</p>
          <MonoLabel tone="lead" className="mt-2 block">
            {p.dataLine}
          </MonoLabel>
        </div>
        <MonoLabel
          aria-hidden
          className="shrink-0 opacity-0 transition-opacity duration-(--duration-fast) ease-lup group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          {vitrin.inspect}
        </MonoLabel>
      </div>
    </Link>
  );
}
