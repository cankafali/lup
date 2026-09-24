import { productPage } from "@/content/copy";
import { Axis } from "@/components/primitives/Axis";
import type { Pt } from "@/lib/overlay";
import { MM, fmt, type PlateView } from "./types";

type RingFrontProps = {
  /** İç çap (mm) */
  innerDiameter: number;
  /** Bant kalınlığı (mm) */
  band: number;
  /** Yuvarlak taşın rundist çapı (mm); verilmezse düz bant. */
  stone?: number;
  /** Tırnak teli çapı (mm) */
  prong?: number;
};

/** Yuvarlak pırlanta profil oranları (rundist çapına göre). */
const CROWN = 0.15;
const PAVILION = 0.43;
const TABLE = 0.57;
const GIRDLE = 0.03;
/** Köşk ucunun bant iç yüzeyinden yukarı mesafesi (birim). */
const CULET_GAP = 2;

/** Taş profilinin dikey konumları (merkez 0,0; yukarı negatif). */
export function stoneProfile(innerDiameter: number, stoneDiameter: number) {
  const rIn = (innerDiameter / 2) * MM;
  const d = stoneDiameter * MM;
  const culetY = -rIn - CULET_GAP;
  const girdleBottom = culetY - PAVILION * d;
  const girdleTop = girdleBottom - GIRDLE * d;
  const tableY = girdleTop - CROWN * d;
  return { half: d / 2, tableHalf: (TABLE * d) / 2, culetY, girdleTop, girdleBottom, tableY };
}

/**
 * Yüzük ön görünüşü (§11.2 A): iki eş merkezli daire (bant), tepede taşın profil görünüşü
 * (rundist, taç, köşk) ve iki görünen tırnak. Merkez (0, 0); çizgi currentColor.
 * Bir <svg> içinde kullanılır; çizgilerin 1px kalması için svg'ye non-scaling-stroke verilir.
 */
export function RingFront({ innerDiameter, band, stone, prong = 0.9 }: RingFrontProps) {
  const rIn = (innerDiameter / 2) * MM;
  const rOut = rIn + band * MM;

  let stoneParts: React.ReactNode = null;
  if (stone) {
    const p = stoneProfile(innerDiameter, stone);
    const pw = prong * MM;
    const prongTop = p.girdleTop - (p.girdleTop - p.tableY) * 0.6;
    // Tırnak: ince dikdörtgen + yuvarlak uç; iç kenarı rundiste biner.
    const prongPath = (dir: 1 | -1) => {
      const inner = dir * (p.half - pw * 0.35);
      const outer = dir * (p.half + pw * 0.65);
      const base = -Math.sqrt(rOut * rOut - outer * outer);
      const cap = prongTop + pw / 2;
      return `M ${inner} ${base} L ${inner} ${cap} A ${pw / 2} ${pw / 2} 0 0 ${dir === 1 ? 1 : 0} ${outer} ${cap} L ${outer} ${base}`;
    };

    stoneParts = (
      <g data-draw="detail">
        <path
          d={`M ${-p.half} ${p.girdleTop} L ${-p.tableHalf} ${p.tableY} L ${p.tableHalf} ${p.tableY} L ${p.half} ${p.girdleTop}`}
        />
        <rect
          x={-p.half}
          y={p.girdleTop}
          width={p.half * 2}
          height={p.girdleBottom - p.girdleTop}
        />
        <path d={`M ${-p.half} ${p.girdleBottom} L 0 ${p.culetY} L ${p.half} ${p.girdleBottom}`} />
        <path d={prongPath(-1)} />
        <path d={prongPath(1)} />
      </g>
    );
  }

  return (
    <g fill="none" stroke="currentColor" strokeWidth={1} data-drawing="ring-front">
      <g data-draw="outline">
        <circle r={rOut} />
        <circle r={rIn} />
      </g>
      {stoneParts}
    </g>
  );
}

/** Ön görünüşün üst ve alt sınırı (levha koordinatı). */
export function ringFrontBounds(
  spec: { innerDiameter: number; band: number; stone?: number },
  [, cy]: Pt,
) {
  const rOut = (spec.innerDiameter / 2 + spec.band) * MM;
  const top = spec.stone ? cy + stoneProfile(spec.innerDiameter, spec.stone).tableY : cy - rOut;
  return { top, bottom: cy + rOut };
}

/**
 * Levhadaki ön görünüş (§11.2 A): eksenler + iç çap, bant kalınlığı (dışarı çıkan ok),
 * toplam yükseklik ve (taş varsa) taş çapı.
 * `band` motifi (burma, telkari) bu görünüşün üstüne ayrı geometriyle eklenir.
 */
export function ringFrontView(
  spec: { innerDiameter: number; band: number; stone?: number },
  center: Pt,
  extra?: React.ReactNode,
): PlateView {
  const [cx, cy] = center;
  const rIn = (spec.innerDiameter / 2) * MM;
  const rOut = rIn + spec.band * MM;
  const { top, bottom } = ringFrontBounds(spec, center);
  const p = spec.stone ? stoneProfile(spec.innerDiameter, spec.stone) : null;
  const totalX = cx - rOut - 24;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[cx, top - 26]} to={[cx, bottom + 26]} />
          <Axis from={[cx - rOut - 14, cy]} to={[cx + rOut + 14, cy]} />
        </g>
        <g transform={`translate(${cx} ${cy})`}>
          <RingFront innerDiameter={spec.innerDiameter} band={spec.band} stone={spec.stone} />
        </g>
        {extra}
      </>
    ),
    dims: [
      {
        from: [cx - rIn, cy],
        to: [cx + rIn, cy],
        label: `Ø ${fmt(spec.innerDiameter)}`,
        knockout: true,
      },
      // Halka kalınlığı birimiyle yazılır ("1.6 mm"); hero'daki "BANT 2.2 mm" genişliktir (K-047).
      {
        from: [cx + rIn, cy],
        to: [cx + rOut, cy],
        label: `${fmt(spec.band)} mm`,
        extendEnd: 36,
      },
      {
        from: [totalX, top],
        to: [totalX, bottom],
        label: fmt((bottom - top) / MM),
        labelSide: "left",
        offset: cx - totalX - (p ? p.tableHalf : 0),
      },
      ...(p && spec.stone
        ? [
            {
              from: [cx - p.half, top - 18] as Pt,
              to: [cx + p.half, top - 18] as Pt,
              label: `Ø ${fmt(spec.stone)}`,
              offset: cy + p.girdleTop - (top - 18),
            },
          ]
        : []),
    ],
    notes: [
      { at: [cx, bottom + 44], text: productPage.views.front, align: "center" },
      ...(p
        ? [
            {
              at: [cx - 22, bottom + 14] as Pt,
              text: productPage.sectionMark,
              align: "center" as const,
            },
            {
              at: [cx + 22, bottom + 14] as Pt,
              text: productPage.sectionMark,
              align: "center" as const,
            },
          ]
        : []),
    ],
  };
}
