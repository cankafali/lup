import { productPage } from "@/content/copy";
import { Axis } from "@/components/primitives/Axis";
import type { Pt } from "@/lib/overlay";
import { BEZEL, pearPath } from "./pear";
import { MM, fmt, TITLE_GAP, type PlateView } from "./types";

/**
 * Damla küpe ön görünüşü (§11.2 `drop-earring`): armut taş (damla konturu + çerçeve),
 * halka ve kanca. Ölçüler: toplam boy, taş boyu, taş eni.
 */
export function dropEarringFrontView(
  spec: { total: number; stone: { length: number; width: number } },
  center: Pt,
): PlateView {
  const [cx, cy] = center;
  const half = (spec.total / 2) * MM;
  const top = cy - half;
  const bottom = cy + half;
  const L = spec.stone.length * MM;
  const W = spec.stone.width * MM;
  const r = W / 2;
  const stoneBottom = bottom - BEZEL;
  const stoneTop = stoneBottom - L;
  const roundY = stoneBottom - r;
  const bezelTop = stoneTop - BEZEL * 1.4;
  const ringR = 4;
  const ringY = bezelTop - ringR;

  const totalX = cx - 60;
  const lengthX = cx + r + 34;
  const widthY = bottom + 22;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[cx, top - 14]} to={[cx, bottom + 14]} />
          <Axis from={[cx - r - 26, roundY]} to={[cx + r + 26, roundY]} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="outline">
          <path d={pearPath([cx, bottom], L + BEZEL * 2.4, W + BEZEL * 2)} />
          <path d={pearPath([cx, stoneBottom], L, W)} />
          <circle cx={cx} cy={ringY} r={ringR} />
          {/* Kanca önden tek tel: kıvrımı görüş doğrultusunda, profili yan görünüşte (K-086) */}
          <path d={`M ${cx} ${ringY - ringR} L ${cx} ${top}`} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="detail">
          <path d={pearPath([cx, roundY + r * 0.45], L * 0.5, W * 0.55)} />
        </g>
      </>
    ),
    dims: [
      {
        from: [totalX, top],
        to: [totalX, bottom],
        label: fmt(spec.total),
        labelSide: "left",
        offset: cx - totalX,
      },
      {
        from: [lengthX, stoneTop],
        to: [lengthX, stoneBottom],
        label: fmt(spec.stone.length),
        labelSide: "right",
        offset: lengthX - cx,
      },
      {
        from: [cx - r, widthY],
        to: [cx + r, widthY],
        label: fmt(spec.stone.width),
        labelSide: "below",
        offset: widthY - roundY,
      },
    ],
    notes: [{ at: [cx, widthY + TITLE_GAP], text: productPage.views.front, align: "center" }],
  };
}
