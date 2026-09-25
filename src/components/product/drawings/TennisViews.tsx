import { productPage } from "@/content/copy";
import { Axis } from "@/components/primitives/Axis";
import type { Pt } from "@/lib/overlay";
import { hatchConvex, segmentsPath } from "./hatch";
import { roundBrilliant } from "./RingTop";
import { fmt, pathOf, polar, TITLE_GAP, type PlateView } from "./types";

type TennisSpec = { pitch: number; width: number; height: number; stone: number };

/** Yuva detayı ve kesiti 10:1 (40 birim/mm). */
const SCALE = 40;
/** Halkalar arası menteşe boşluğu (mm). */
const GAP = 0.2;
/** Kutu duvarı ve taban kalınlığı, taban deliği (mm); temsili (K-086). */
const WALL = 0.3;
const FLOOR = 0.4;
const HOLE = 1;
/** Tırnak yarıçapı (mm). */
const PRONG_R = 0.28;
/** Menteşe dili: halka boyunca uzunluk ve en (mm). */
const TONGUE = { length: 0.3, width: 0.9 };

/**
 * Su yolu yuva detayı (§11.2 `tennis`, "yuva detayı büyütülmüş"): üstten bir halka — kutu
 * yuva, içte yuvarlak pırlanta faset diyagramı ve 4 tırnak, sağda menteşe dili ve komşu
 * halkanın başlangıcı (kırılma çizgisiyle), solda dilin girdiği yuva (görünmeyen, kesikli).
 * Ölçüler: yuva aralığı, en, taş çapı.
 */
export function tennisSettingView(spec: TennisSpec, center: Pt): PlateView {
  const [cx, cy] = center;
  const body = (spec.pitch - GAP) * SCALE;
  const W = spec.width * SCALE;
  const R = (spec.stone / 2) * SCALE;
  const left = cx - body / 2;
  const right = cx + body / 2;
  const top = cy - W / 2;
  const bottom = cy + W / 2;
  const next = left + spec.pitch * SCALE;
  const tongueW = (TONGUE.width / 2) * SCALE;
  const tongueL = TONGUE.length * SCALE;
  const stub = next + 22;
  const zig = Array.from({ length: 9 }, (_, i) => [
    stub + (i % 2 ? 4 : -4),
    top - 8 + (i * (W + 16)) / 8,
  ]) as Pt[];
  const { table, facets } = roundBrilliant(center, R);

  const pitchY = bottom + 22;
  const widthX = left - 20;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[left - 12, cy]} to={[stub + 10, cy]} />
          <Axis from={[cx, top - 12]} to={[cx, bottom + 12]} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="outline">
          <rect x={left} y={top} width={body} height={W} rx={6} />
          {/* Kutunun iç kenarı: taş çapında kare */}
          <rect x={cx - R} y={cy - R} width={2 * R} height={2 * R} />
          <circle cx={cx} cy={cy} r={R} />
          {/* Menteşe dili ve komşu halkanın başı */}
          <path
            d={pathOf([
              [right, cy - tongueW],
              [next, cy - tongueW],
            ])}
          />
          <path
            d={pathOf([
              [right, cy + tongueW],
              [next, cy + tongueW],
            ])}
          />
          <path
            d={pathOf([
              [stub, top],
              [next, top],
              [next, bottom],
              [stub, bottom],
            ])}
          />
          <path d={pathOf(zig)} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="detail">
          <path d={pathOf(table, true)} />
          <path d={segmentsPath(facets)} />
          {/* Önceki halkanın dili bu halkanın yuvasında: görünmeyen kenar */}
          <path
            d={pathOf([
              [left, cy - tongueW],
              [left + tongueL, cy - tongueW],
              [left + tongueL, cy + tongueW],
              [left, cy + tongueW],
            ])}
            strokeDasharray="4 3"
          />
          <path
            d={pathOf([
              [next, cy - tongueW],
              [next + tongueL, cy - tongueW],
              [next + tongueL, cy + tongueW],
              [next, cy + tongueW],
            ])}
            strokeDasharray="4 3"
          />
          {[45, 135, 225, 315].map((deg) => {
            const [x, y] = polar(center, R, deg);
            return <circle key={deg} cx={x} cy={y} r={PRONG_R * SCALE} className="fill-paper" />;
          })}
        </g>
      </>
    ),
    dims: [
      {
        from: [left, pitchY],
        to: [next, pitchY],
        label: fmt(spec.pitch),
        labelSide: "below",
        offset: pitchY - bottom,
      },
      {
        from: [widthX, top],
        to: [widthX, bottom],
        label: fmt(spec.width),
        labelSide: "left",
        offset: left - widthX,
      },
      { from: [cx - R, cy], to: [cx + R, cy], label: `Ø ${fmt(spec.stone)}`, knockout: true },
    ],
    notes: [{ at: [cx, pitchY + TITLE_GAP], text: productPage.views.setting, align: "center" }],
  };
}

/**
 * Su yolu A-A kesiti (halkanın eni boyunca, taşın ortasından): kutu yuvanın duvarları ve delikli
 * tabanı taramalı; taş kesit düzleminde profil olarak (taranmaz), tırnaklar düzlemin arkasında
 * (görünür kenar). Ölçüler: en, yükseklik.
 */
export function tennisSectionView(spec: TennisSpec, center: Pt): PlateView {
  const [cx, cy] = center;
  const W = spec.width * SCALE;
  const H = spec.height * SCALE;
  const wall = WALL * SCALE;
  const floor = FLOOR * SCALE;
  const hole = (HOLE / 2) * SCALE;
  const top = cy - H / 2;
  const bottom = cy + H / 2;
  const x0 = cx - W / 2;
  const x1 = cx + W / 2;

  // Metal: iki duvar ve deliğin iki yanındaki taban (dışbükey parçalar, aynı parça: aynı tarama)
  const parts: Pt[][] = [
    [
      [x0, top],
      [x0 + wall, top],
      [x0 + wall, bottom],
      [x0, bottom],
    ],
    [
      [x1 - wall, top],
      [x1, top],
      [x1, bottom],
      [x1 - wall, bottom],
    ],
    [
      [x0 + wall, bottom - floor],
      [cx - hole, bottom - floor],
      [cx - hole, bottom],
      [x0 + wall, bottom],
    ],
    [
      [cx + hole, bottom - floor],
      [x1 - wall, bottom - floor],
      [x1 - wall, bottom],
      [cx + hole, bottom],
    ],
  ];
  // Kesitin dış hattı: deliğin iki yanında birer "L"
  const half = (s: 1 | -1): Pt[] => [
    [cx + s * (W / 2), top],
    [cx + s * (W / 2 - wall), top],
    [cx + s * (W / 2 - wall), bottom - floor],
    [cx + s * hole, bottom - floor],
    [cx + s * hole, bottom],
    [cx + s * (W / 2), bottom],
  ];

  // Taş: rundist duvarların iç yüzüne oturur (Ø = kutunun iç eni)
  const d = spec.stone * SCALE;
  const girdleTop = top + 8;
  const girdleBottom = girdleTop + 0.03 * d;
  const tableY = girdleTop - 0.15 * d;
  const culetY = girdleBottom + 0.43 * d;
  const tableHalf = 0.57 * (d / 2);
  const r = d / 2;
  // Tırnak: duvarın üstünden yükselip tacın kenarına eğilir
  const prong = (s: 1 | -1) =>
    `M ${cx + s * (W / 2)} ${top} L ${cx + s * (W / 2 - 2)} ${top - 6} Q ${cx + s * (W / 2 - 8)} ${top - 11} ${cx + s * (W / 2 - 18)} ${top - 3} L ${cx + s * (W / 2 - wall)} ${top}`;

  const widthY = top - 28;
  const heightX = x1 + 20;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[cx, top - 34]} to={[cx, bottom + 12]} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="outline">
          <path d={`${pathOf(half(-1), true)} ${pathOf(half(1), true)}`} />
          <path d={`${prong(-1)} ${prong(1)}`} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="detail">
          <path d={segmentsPath(parts.flatMap((p) => hatchConvex(p)))} />
          <path
            d={`M ${cx - r} ${girdleTop} L ${cx - tableHalf} ${tableY} L ${cx + tableHalf} ${tableY} L ${cx + r} ${girdleTop} M ${cx - r} ${girdleTop} L ${cx + r} ${girdleTop} M ${cx - r} ${girdleBottom} L ${cx + r} ${girdleBottom} M ${cx - r} ${girdleBottom} L ${cx} ${culetY} L ${cx + r} ${girdleBottom}`}
          />
        </g>
      </>
    ),
    dims: [
      {
        from: [x0, widthY],
        to: [x1, widthY],
        label: fmt(spec.width),
        offset: top - widthY,
      },
      {
        from: [heightX, top],
        to: [heightX, bottom],
        label: fmt(spec.height),
        labelSide: "right",
        offset: heightX - x1,
      },
    ],
    notes: [{ at: [cx, bottom + 44], text: productPage.views.section, align: "center" }],
  };
}
