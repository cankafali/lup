import { productPage } from "@/content/copy";
import { Axis } from "@/components/primitives/Axis";
import type { Pt } from "@/lib/overlay";
import { MM, fmt, pathOf, TITLE_GAP, type PlateView } from "./types";

/** Düz açılımda çizilen yuva sayısı (§11.2 `tennis`: 42 yuvanın 5'i). */
const SHOWN = 5;
/** Kırılma çizgisinden sonra "···" ile gösterilen boşluk (birim). */
const BREAK_GAP = 64;

/**
 * Su yolu bilekliğin düz açılımı (§11.2 `tennis`): 5 yuva çizili, geri kalanı kırılma
 * çizgisi (zigzag) ve "···" ile kesilmiş. Ölçüler: yuva aralığı, en, toplam boy.
 */
export function tennisFlatView(
  spec: { count: number; pitch: number; width: number; stone: number; length: number },
  center: Pt,
): PlateView {
  const [cx, cy] = center;
  const P = spec.pitch * MM;
  const W = spec.width * MM;
  const sr = (spec.stone / 2) * MM;
  const span = SHOWN * P + BREAK_GAP;
  const x0 = cx - span / 2;
  const xs = Array.from({ length: SHOWN }, (_, k) => x0 + (k + 0.5) * P);
  const breakX = x0 + SHOWN * P + 8;
  const zig = Array.from({ length: 7 }, (_, i) => [
    breakX + (i % 2 ? 4 : -4),
    cy - W / 2 - 8 + (i * (W + 16)) / 6,
  ]) as Pt[];
  const endX = x0 + span;

  const pitchY = cy - W / 2 - 20;
  const widthX = x0 - 20;
  const totalY = cy + W / 2 + 26;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[x0 - 30, cy]} to={[endX + 10, cy]} />
          <Axis from={[xs[2] ?? cx, cy - W / 2 - 12]} to={[xs[2] ?? cx, cy + W / 2 + 12]} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="outline">
          {xs.map((x) => (
            <rect key={x} x={x - P / 2 + 1} y={cy - W / 2} width={P - 2} height={W} />
          ))}
          <path d={pathOf(zig)} />
        </g>
        <g stroke="currentColor" data-draw="detail">
          {xs.map((x) => (
            <g key={x}>
              <circle cx={x} cy={cy} r={sr} fill="none" />
              <circle cx={x} cy={cy} r={sr * 0.5} fill="none" />
              {[45, 135, 225, 315].map((deg) => {
                const a = (deg * Math.PI) / 180;
                return (
                  <circle
                    key={deg}
                    cx={x + sr * Math.cos(a)}
                    cy={cy + sr * Math.sin(a)}
                    r={1.6}
                    className="fill-paper"
                  />
                );
              })}
            </g>
          ))}
        </g>
      </>
    ),
    dims: [
      {
        from: [xs[0] ?? x0, pitchY],
        to: [xs[1] ?? x0, pitchY],
        label: fmt(spec.pitch),
        offset: cy - W / 2 - pitchY,
      },
      {
        from: [widthX, cy - W / 2],
        to: [widthX, cy + W / 2],
        label: fmt(spec.width),
        labelSide: "left",
        offset: x0 - widthX,
      },
      {
        from: [x0, totalY],
        to: [endX, totalY],
        label: `${spec.length} · ${spec.count} × ${fmt(spec.pitch)}`,
        labelSide: "below",
        offset: totalY - (cy + W / 2),
      },
    ],
    notes: [
      // Kesit düzlemi (A-A) ortadaki yuvanın ekseninde: iki uçta işaret
      { at: [(xs[2] ?? cx) + 8, cy - W / 2 - 12], text: productPage.sectionMark },
      { at: [(xs[2] ?? cx) + 8, cy + W / 2 + 12], text: productPage.sectionMark },
      { at: [breakX + BREAK_GAP / 2 - 4, cy - 7], text: productPage.tennisBreak, align: "center" },
      { at: [cx, totalY + TITLE_GAP], text: productPage.views.flat, align: "center" },
    ],
  };
}
