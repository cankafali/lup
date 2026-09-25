import { productPage } from "@/content/copy";
import { Axis } from "@/components/primitives/Axis";
import type { Pt } from "@/lib/overlay";
import { BEZEL, pearPath } from "./pear";
import { MM, fmt, TITLE_GAP, type PlateView } from "./types";

/**
 * Armut kolye ucu ön görünüşü (§11.2 `pear-pendant`): armut taş çerçevede, askı halkası ve
 * zincirin başlangıcı. Ölçüler: uç boyu (askı dahil), taş boyu, taş eni.
 */
export function pearPendantFrontView(
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
  const bailRy = (stoneTop - BEZEL * 1.4 - top) / 2;
  const bailY = top + bailRy;

  const totalX = cx - r - 34;
  const lengthX = cx + r + 30;
  const widthY = bottom + 22;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[cx, top - 70]} to={[cx, bottom + 14]} />
          <Axis from={[cx - r - 22, roundY]} to={[cx + r + 22, roundY]} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="outline">
          <path d={pearPath([cx, bottom], L + BEZEL * 2.4, W + BEZEL * 2)} />
          <path d={pearPath([cx, stoneBottom], L, W)} />
          <ellipse cx={cx} cy={bailY} rx={bailRy * 0.55} ry={bailRy} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="detail">
          <path d={pearPath([cx, roundY + r * 0.45], L * 0.5, W * 0.55)} />
          {/* Zincirin ilk iki halkası; devamı kesikli */}
          <ellipse cx={cx} cy={top - 7} rx={2.6} ry={6} />
          <ellipse cx={cx} cy={top - 18} rx={6} ry={2.6} />
          <path d={`M ${cx} ${top - 22} L ${cx} ${top - 60}`} strokeDasharray="2 3" />
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
