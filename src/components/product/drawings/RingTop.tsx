import { productPage } from "@/content/copy";
import { Axis } from "@/components/primitives/Axis";
import type { Pt } from "@/lib/overlay";
import { fmt, polar, type PlateView } from "./types";

/** Üst görünüş ölçeği: 1 mm = 24 birim (6:1); faset diyagramı 2:1'de okunmaz (K-045). */
const SCALE = 24;
const TABLE = 0.57;
/** Yıldız fasetinin tabladan rundiste uzunluğu (oran). */
const STAR = 0.5;
/** Tırnak yarıçapı (mm) — §11.2 B. */
const PRONG_R = 0.45;
const PRONG_ANGLES = [45, 135, 225, 315];

/**
 * Taşın üstten görünüşü (§11.2 B): yuvarlak pırlanta faset diyagramı — rundist dairesi,
 * sekizgen tabla, 8 yıldız faseti, 8 ana taç faseti (uçurtma), 16 rundist faseti; 4 tırnak.
 */
export function ringTopView(stone: number, center: Pt): PlateView {
  const [cx, cy] = center;
  const R = (stone / 2) * SCALE;
  const Rt = TABLE * R;
  const Rs = Rt + STAR * (R - Rt);
  const pr = PRONG_R * SCALE;

  const table = Array.from({ length: 8 }, (_, k) => polar(center, Rt, k * 45));
  const facets: [Pt, Pt][] = [];
  for (let k = 0; k < 8; k++) {
    const star = polar(center, Rs, k * 45 + 22.5);
    const t0 = table[k] as Pt;
    const t1 = table[(k + 1) % 8] as Pt;
    facets.push(
      [star, t0], // yıldız / uçurtma kenarları
      [star, t1],
      [star, polar(center, R, k * 45)], // uçurtmanın alt kenarları
      [star, polar(center, R, (k + 1) * 45)],
      [star, polar(center, R, k * 45 + 22.5)], // rundist fasetlerini ayıran çizgi
    );
  }

  const prongY = cy - R * Math.SQRT1_2;
  const prongDx = R * Math.SQRT1_2;
  const topDimY = cy - R - 22;
  const bottomDimY = cy + R + 26;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[cx - R - 24, cy]} to={[cx + R + 24, cy]} />
          <Axis from={[cx, cy - R - 14]} to={[cx, cy + R + 14]} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="outline">
          <circle cx={cx} cy={cy} r={R} />
          <polygon points={table.map((p) => p.join(",")).join(" ")} />
        </g>
        <g stroke="currentColor" data-draw="detail">
          {facets.map(([a, b], i) => (
            <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
          ))}
          {PRONG_ANGLES.map((deg) => {
            const [x, y] = polar(center, R, deg);
            return <circle key={deg} cx={x} cy={y} r={pr} className="fill-paper" />;
          })}
        </g>
      </>
    ),
    dims: [
      {
        from: [cx - R, bottomDimY],
        to: [cx + R, bottomDimY],
        label: `Ø ${fmt(stone)}`,
        labelSide: "below",
        offset: bottomDimY - cy,
      },
      {
        from: [cx - Rt, cy],
        to: [cx + Rt, cy],
        label: `TABLA %${Math.round(TABLE * 100)}`,
        knockout: true,
      },
      {
        from: [cx - prongDx, topDimY],
        to: [cx + prongDx, topDimY],
        label: fmt((2 * prongDx) / SCALE),
        offset: prongY - topDimY,
      },
    ],
    notes: [{ at: [cx, bottomDimY + 44], text: productPage.views.top, align: "center" }],
  };
}
