import { productPage } from "@/content/copy";
import { Axis } from "@/components/primitives/Axis";
import type { Pt } from "@/lib/overlay";
import { fmt, pathOf, type PlateView } from "./types";

/**
 * Kesit ölçeği: 40 birim/mm (10:1). Şartnamedeki 12 birim/mm'de kesit 26×19 birim kalıp
 * ikon gibi görünüyordu (K-046).
 */
const SCALE = 40;
/** Düz yan duvarın kalınlığa oranı; üstü eliptik kubbe. */
const SIDE = 0.4;
/** Tarama: 45°, 4 birim aralık (§11.2 C). */
const HATCH_GAP = 4;
const ARC_STEPS = 24;

/** Dışbükey çokgenle bir doğrunun kesişimi (Cyrus–Beck); klonda `clipPath` id'si gerektirmesin diye. */
function clipToConvex(poly: readonly Pt[], a: Pt, b: Pt): [Pt, Pt] | null {
  let t0 = 0;
  let t1 = 1;
  const d: Pt = [b[0] - a[0], b[1] - a[1]];
  // Çokgenin yönünden bağımsız: iç taraf merkez noktasına göre belirlenir.
  const c: Pt = [
    poly.reduce((s, p) => s + p[0], 0) / poly.length,
    poly.reduce((s, p) => s + p[1], 0) / poly.length,
  ];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i] as Pt;
    const q = poly[(i + 1) % poly.length] as Pt;
    let n: Pt = [q[1] - p[1], p[0] - q[0]];
    if (n[0] * (c[0] - p[0]) + n[1] * (c[1] - p[1]) < 0) n = [-n[0], -n[1]];
    const num = n[0] * (a[0] - p[0]) + n[1] * (a[1] - p[1]);
    const den = n[0] * d[0] + n[1] * d[1];
    if (den === 0) {
      if (num < 0) return null;
      continue;
    }
    const t = -num / den;
    if (den > 0) t0 = Math.max(t0, t);
    else t1 = Math.min(t1, t);
    if (t0 > t1) return null;
  }
  return [
    [a[0] + d[0] * t0, a[1] + d[1] * t0],
    [a[0] + d[0] * t1, a[1] + d[1] * t1],
  ];
}

/**
 * Bandın A-A kesiti (§11.2 C): "D" profil — düz iç (üstte, parmağa bakan), yuvarlak dış.
 * Kesit alanı 45° taramalı. Ölçüler: genişlik, kalınlık, yan duvar.
 */
export function bandSectionView(
  section: { width: number; thickness: number },
  center: Pt,
): PlateView {
  const [cx, cy] = center;
  const W = section.width * SCALE;
  const T = section.thickness * SCALE;
  const top = cy - T / 2;
  const side = SIDE * T;
  const rx = W / 2;
  const ry = T - side;

  // Profil çokgeni: üst kenar, sağ duvar, kubbe (sağdan sola), sol duvar.
  const dome = Array.from({ length: ARC_STEPS + 1 }, (_, i) => {
    const a = (i / ARC_STEPS) * Math.PI;
    return [cx + rx * Math.cos(a), top + side + ry * Math.sin(a)] as Pt;
  });
  const profile: Pt[] = [[cx - rx, top], [cx + rx, top], ...dome];

  // 45° çizgiler: alttan sağ üste; yatay adım 4√2 → çizgiler arası dik mesafe 4.
  const hatch: [Pt, Pt][] = [];
  const rise = T + 2;
  for (let x = cx - rx - rise; x <= cx + rx; x += HATCH_GAP * Math.SQRT2) {
    const seg = clipToConvex(profile, [x, top + T + 1], [x + rise, top + T + 1 - rise]);
    if (seg) hatch.push(seg);
  }

  const widthY = top - 18;
  const thickX = cx + rx + 18;
  const sideX = cx - rx - 18;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[cx, top - 30]} to={[cx, top + T + 16]} />
        </g>
        <path d={pathOf(profile, true)} fill="none" stroke="currentColor" data-draw="outline" />
        <g stroke="currentColor" data-draw="detail">
          {hatch.map(([a, b], i) => (
            <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
          ))}
        </g>
      </>
    ),
    dims: [
      {
        from: [cx - rx, widthY],
        to: [cx + rx, widthY],
        label: fmt(section.width),
        offset: top - widthY,
      },
      {
        from: [thickX, top],
        to: [thickX, top + T],
        label: fmt(section.thickness),
        labelSide: "right",
        offset: thickX - cx,
      },
      {
        from: [sideX, top],
        to: [sideX, top + side],
        label: fmt(SIDE * section.thickness),
        labelSide: "left",
        offset: cx - rx - sideX,
      },
    ],
    notes: [{ at: [cx, top + T + 44], text: productPage.views.section, align: "center" }],
  };
}
