import { productPage } from "@/content/copy";
import { Axis } from "@/components/primitives/Axis";
import type { Pt } from "@/lib/overlay";
import { clipPolylineToConvex, hatchCircle, segmentsPath } from "./hatch";
import { fmt, pathOf, polylinesPath, sampleCubic, TITLE_GAP, type PlateView } from "./types";

type TwistSpec = { innerDiameter: number; band: number; turns: number };

/** Açılım ölçeği 6:1 (24 birim/mm): 1.8 mm'lik şerit 2:1'de 14 birim kalır (K-085). */
const DEV_SCALE = 24;
/** Çizilen tur sayısı; devamı kırılma çizgisiyle kesilir (su yolu düz açılımı gibi). */
const SHOWN_TURNS = 2.5;
const BREAK_GAP = 40;
/** Kesit ölçeği 20:1 (80 birim/mm): 0.9 mm'lik tel 10:1'de 36 birim kalır. */
const SECTION_SCALE = 80;

/**
 * Burmanın bant yüzeyi açılımı (§11.2 `twist`, üst görünüş yerine): bant orta çevresi boyunca
 * düz şerit, üzerinde iki telin çapraz burgu sınırları. Her tur iki sınır (iki tel).
 * Ölçüler: tur adımı, şerit eni (tel demeti çapı), toplam çevre.
 */
export function twistDevelopmentView(spec: TwistSpec, center: Pt): PlateView {
  const [cx, cy] = center;
  const circumference = Math.PI * (spec.innerDiameter + spec.band);
  const pitchMm = circumference / spec.turns;
  const P = pitchMm * DEV_SCALE;
  const W = spec.band * DEV_SCALE;
  const shown = SHOWN_TURNS * P;
  const span = shown + BREAK_GAP;
  const x0 = cx - span / 2;
  const breakX = x0 + shown;
  const endX = x0 + span;
  const top = cy - W / 2;
  const bottom = cy + W / 2;

  // Burgu sınırı: alt kenardan üst kenara S eğrisi (telin yuvarlaklığı); şeride kırpılır.
  const run = W * 0.8;
  const strip: Pt[] = [
    [x0, top],
    [breakX, top],
    [breakX, bottom],
    [x0, bottom],
  ];
  const boundaries = [];
  for (let x = x0 - run; x < breakX; x += P / 2) {
    const curve = sampleCubic(
      [x, bottom],
      [x + run * 0.6, bottom],
      [x + run * 0.4, top],
      [x + run, top],
    );
    boundaries.push(...clipPolylineToConvex(curve, strip));
  }
  // Ölçülen tur: sınırların üst uçları x0 + k·P/2'de; ikinciden (k = 1) iki sınır sonrasına
  const firstTop = x0 + P / 2;

  const zig = Array.from({ length: 7 }, (_, i) => [
    breakX + (i % 2 ? 4 : -4),
    top - 8 + (i * (W + 16)) / 6,
  ]) as Pt[];

  const pitchY = top - 20;
  const widthX = x0 - 20;
  const totalY = bottom + 26;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[x0 - 24, cy]} to={[endX + 10, cy]} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="outline">
          <path d={`M ${breakX} ${top} L ${x0} ${top} L ${x0} ${bottom} L ${breakX} ${bottom}`} />
          <path d={pathOf(zig)} />
        </g>
        <path d={polylinesPath(boundaries)} fill="none" stroke="currentColor" data-draw="detail" />
      </>
    ),
    dims: [
      {
        from: [firstTop, pitchY],
        to: [firstTop + P, pitchY],
        label: fmt(pitchMm),
        offset: top - pitchY,
      },
      {
        from: [widthX, top],
        to: [widthX, bottom],
        label: fmt(spec.band),
        labelSide: "left",
        offset: x0 - widthX,
      },
      {
        from: [x0, totalY],
        to: [endX, totalY],
        label: `${fmt(circumference)} · ${spec.turns} × ${fmt(pitchMm)}`,
        labelSide: "below",
        offset: totalY - bottom,
      },
    ],
    notes: [
      { at: [breakX + BREAK_GAP / 2, cy - 7], text: productPage.tennisBreak, align: "center" },
      { at: [cx, totalY + TITLE_GAP], text: productPage.views.development, align: "center" },
    ],
  };
}

/**
 * Burmanın A-A kesiti: tel demetinin zarfı (kesikli, Ø bant) içinde yan yana iki tel.
 * Teller ayrı parça: taramaları ters yönde. Ölçüler: demet çapı, tel çapı.
 */
export function twistSectionView(spec: TwistSpec, center: Pt): PlateView {
  const [cx, cy] = center;
  const R = (spec.band / 2) * SECTION_SCALE;
  const r = R / 2;
  const left: Pt = [cx - r, cy];
  const right: Pt = [cx + r, cy];

  const envelopeY = cy - R - 18;
  // Tel ölçüsü zarfın altında: etiketi kesikli zarf çizgisine binmesin
  const wireY = cy + R + 14;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[cx - R - 16, cy]} to={[cx + R + 16, cy]} />
          <Axis from={[cx, cy - R - 10]} to={[cx, cy + R + 10]} />
          {/* Demetin zarfı: görünmeyen kenar gibi kesikli */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="currentColor" strokeDasharray="4 3" />
        </g>
        <g fill="none" stroke="currentColor" data-draw="outline">
          <circle cx={left[0]} cy={left[1]} r={r} />
          <circle cx={right[0]} cy={right[1]} r={r} />
        </g>
        <path
          d={segmentsPath([...hatchCircle(left, r, 1), ...hatchCircle(right, r, -1)])}
          fill="none"
          stroke="currentColor"
          data-draw="detail"
        />
      </>
    ),
    dims: [
      {
        from: [cx - R, envelopeY],
        to: [cx + R, envelopeY],
        label: `Ø ${fmt(spec.band)}`,
        offset: cy - envelopeY,
      },
      {
        from: [cx, wireY],
        to: [cx + 2 * r, wireY],
        label: `Ø ${fmt(spec.band / 2)}`,
        labelSide: "below",
        offset: wireY - cy,
      },
    ],
    notes: [{ at: [cx, wireY + TITLE_GAP], text: productPage.views.wireSection, align: "center" }],
  };
}
