import Image from "next/image";
import { vitrin } from "@/content/copy";
import type { Product } from "@/content/products";
import { DimensionLine } from "@/components/primitives/DimensionLine";
import { Lens } from "@/components/primitives/Lens";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Stamp } from "@/components/primitives/Stamp";
import type { ViewBox } from "@/lib/overlay";
import { PartLink } from "./PartLink";

/** Hücre koordinat uzayı (§10.2): 4:5, 1440'ta ≈ 437×546. */
const CELL: ViewBox = [440, 550];

/**
 * Sıkışık hücre sınıfları: tepside mobilde (< 768) ya da her genişlikte (`compact`, §11.4 şeridi).
 * Tepsinin tablet sadeleştirmesi (< 1024) `max-lg:` ile ayrıca verilir.
 */
const SMALL = {
  // Ölçü etiketi 9px (§15)
  dim: ["max-md:[&_[data-dim-label]>span]:text-mono-s", "[&_[data-dim-label]>span]:text-mono-s"],
  // Telkari lupundaki "10×" damgayla çakışır: gizli (K-080)
  lens: ["max-md:[&_[data-lens]>span]:hidden", "[&_[data-lens]>span]:hidden"],
  no: ["top-5 left-6 max-md:top-3 max-md:left-3", "top-3 left-3"],
  stamp: ["top-[17px] right-6 max-md:top-[10px] max-md:right-3", "top-[10px] right-3"],
  bottom: [
    "inset-x-6 bottom-[34px] max-lg:inset-x-4 max-lg:bottom-4 max-md:inset-x-3 max-md:bottom-3",
    "inset-x-3 bottom-3",
  ],
  name: [
    "text-item max-md:text-body max-md:font-medium max-md:tracking-item",
    "text-body font-medium tracking-item",
  ],
} as const;

type TrayCellProps = {
  product: Product;
  /** Diğer parçalar şeridi (§11.4): 240px'lik küçük hücre; ad dışındaki metinler yok. */
  compact?: boolean;
};

/**
 * Tepsi hücresi (§10.2). Hücrenin tamamı ürün sayfasına link.
 * Hover sade: çerçeve graphite, "İNCELE →" belirir; fotoğraf büyümez (lup zaten büyütüyor).
 * Çerçeve, komşu hücrelerle paylaşılan 1px ayırıcıların üstüne binen bir ::after ile çizilir.
 * < 1024 (hücre ≈ 175–310px): veri satırı, "İNCELE →" ve telkari notu gizli; ad alta iner (K-080).
 */
export function TrayCell({ product: p, compact = false }: TrayCellProps) {
  const o = p.overlay;
  const cls = (key: keyof typeof SMALL) => SMALL[key][compact ? 1 : 0];

  return (
    // Sayfa geçişi (§11.5, K-089): tıklanınca yalnızca bu hücrenin fotoğrafı (data-part-photo) yerinde kalır
    <PartLink
      href={`/parca/${p.slug}`}
      aria-label={`${p.name} — ${p.dataLine}`}
      data-tray-cell
      className="group [container-type:inline-size] relative block aspect-[4/5] after:pointer-events-none after:absolute after:-inset-px after:border after:border-transparent after:transition-colors after:duration-(--duration-fast) after:ease-lup hover:z-10 hover:after:border-graphite focus-visible:z-10 focus-visible:outline-offset-[-2px]"
    >
      {o.kind === "lens" ? (
        // 06 — Telkari: fotoğraf yerine statik lup; merkez (220, 236), iç çap 300.
        <div
          data-part-photo
          className={`absolute top-[42.91%] left-1/2 -translate-x-1/2 -translate-y-1/2 ${cls("lens")}`}
        >
          <Lens
            src={p.image.src}
            alt={p.image.alt}
            diameter={300}
            diameterCss="calc(300 / 440 * 100cqw)"
            sizes={compact ? "164px" : "(min-width: 1024px) 21vw, 50vw"}
            ring={8}
            label={vitrin.lensMark}
            axes
          />
        </div>
      ) : (
        <div data-part-photo className="absolute inset-0 overflow-hidden">
          <Image
            src={p.image.src}
            alt={p.image.alt}
            fill
            sizes={compact ? "240px" : "(min-width: 1024px) 33vw, 100vw"}
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
          className={cls("dim")}
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
          className={cls("dim")}
        />
      )}

      <MonoLabel className={`absolute ${cls("no")}`}>{vitrin.no(p.no)}</MonoLabel>
      <Stamp seed={p.slug} className={`absolute ${cls("stamp")}`}>
        {p.karat.hallmark}
      </Stamp>

      {o.kind === "lens" && !compact && (
        <MonoLabel tone="lead" className="absolute bottom-[108px] left-6 max-lg:hidden">
          {vitrin.filigree}
        </MonoLabel>
      )}

      <div className={`absolute flex items-end justify-between gap-4 ${cls("bottom")}`}>
        <div>
          <p className={cls("name")}>{p.name}</p>
          {!compact && (
            <MonoLabel tone="lead" className="mt-2 block max-lg:hidden">
              {p.dataLine}
            </MonoLabel>
          )}
        </div>
        {!compact && (
          <MonoLabel
            aria-hidden
            className="shrink-0 opacity-0 transition-opacity duration-(--duration-fast) ease-lup group-hover:opacity-100 group-focus-visible:opacity-100 max-lg:hidden"
          >
            {vitrin.inspect}
          </MonoLabel>
        )}
      </div>
    </PartLink>
  );
}
