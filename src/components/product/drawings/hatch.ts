import type { Pt } from "@/lib/overlay";

/**
 * Kesit taraması (§11.2 C): 45°, 4 birim aralık. Çizgiler `clipPath` yerine hesapla kırpılır;
 * lup klonu `id`'leri sildiği için `url(#…)` klonda kırılır (K-049).
 * Çizgiler levhanın ortak ızgarasına oturur: yan yana iki parçanın taraması hizalı kalır.
 */
export const HATCH_GAP = 4;

type Seg = [Pt, Pt];

/** Dışbükey çokgenle bir doğru parçasının kesişimi (Cyrus–Beck). */
export function clipToConvex(poly: readonly Pt[], a: Pt, b: Pt): Seg | null {
  let t0 = 0;
  let t1 = 1;
  const d: Pt = [b[0] - a[0], b[1] - a[1]];
  // Çokgenin yönünden bağımsız: iç taraf ağırlık merkezine göre belirlenir.
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

/** Daireyle bir doğru parçasının kesişimi. */
export function clipToCircle([cx, cy]: Pt, r: number, a: Pt, b: Pt): Seg | null {
  const d: Pt = [b[0] - a[0], b[1] - a[1]];
  const f: Pt = [a[0] - cx, a[1] - cy];
  const A = d[0] * d[0] + d[1] * d[1];
  const B = 2 * (f[0] * d[0] + f[1] * d[1]);
  const C = f[0] * f[0] + f[1] * f[1] - r * r;
  const disc = B * B - 4 * A * C;
  if (A === 0 || disc <= 0) return null;
  const s = Math.sqrt(disc);
  const t0 = Math.max(0, (-B - s) / (2 * A));
  const t1 = Math.min(1, (-B + s) / (2 * A));
  if (t0 >= t1) return null;
  return [
    [a[0] + d[0] * t0, a[1] + d[1] * t0],
    [a[0] + d[0] * t1, a[1] + d[1] * t1],
  ];
}

/**
 * Sınır kutusunu kaplayan 45° çizgi ailesi. `dir` 1: sol alttan sağ üste (x + y sabit),
 * −1: sağ alttan sol üste (x − y sabit). Komşu parçalar ters yönde taranır.
 */
function family(
  [minX, minY, maxX, maxY]: [number, number, number, number],
  gap: number,
  dir: 1 | -1,
): Seg[] {
  const step = gap * Math.SQRT2;
  const y0 = maxY + 1;
  const y1 = minY - 1;
  const lo = dir === 1 ? minX + minY : minX - maxY;
  const hi = dir === 1 ? maxX + maxY : maxX - minY;
  const lines: Seg[] = [];
  for (let k = Math.ceil(lo / step) * step; k <= hi; k += step) {
    lines.push(
      dir === 1
        ? [
            [k - y0, y0],
            [k - y1, y1],
          ]
        : [
            [k + y0, y0],
            [k + y1, y1],
          ],
    );
  }
  return lines;
}

const bounds = (pts: readonly Pt[]): [number, number, number, number] => [
  Math.min(...pts.map((p) => p[0])),
  Math.min(...pts.map((p) => p[1])),
  Math.max(...pts.map((p) => p[0])),
  Math.max(...pts.map((p) => p[1])),
];

/** Dışbükey çokgenin taraması. */
export function hatchConvex(poly: readonly Pt[], dir: 1 | -1 = 1, gap = HATCH_GAP): Seg[] {
  return family(bounds(poly), gap, dir).flatMap(([a, b]) => {
    const seg = clipToConvex(poly, a, b);
    return seg ? [seg] : [];
  });
}

/** Dairenin taraması. */
export function hatchCircle(center: Pt, r: number, dir: 1 | -1 = 1, gap = HATCH_GAP): Seg[] {
  const [cx, cy] = center;
  return family([cx - r, cy - r, cx + r, cy + r], gap, dir).flatMap(([a, b]) => {
    const seg = clipToCircle(center, r, a, b);
    return seg ? [seg] : [];
  });
}

/** Çoklu çizginin daire içinde kalan parçaları (büyütülmüş detay görünüşleri). */
export const clipPolylineToCircle = (pts: readonly Pt[], center: Pt, r: number) =>
  clipPolyline(pts, (a, b) => clipToCircle(center, r, a, b));

/** Çoklu çizginin dışbükey çokgen içinde kalan parçaları. */
export const clipPolylineToConvex = (pts: readonly Pt[], poly: readonly Pt[]) =>
  clipPolyline(pts, (a, b) => clipToConvex(poly, a, b));

/** Çoklu çizginin kırpma bölgesinde kalan parçaları (`clip`: parça → kalan parça). */
export function clipPolyline(pts: readonly Pt[], clip: (a: Pt, b: Pt) => Seg | null): Pt[][] {
  const runs: Pt[][] = [];
  let run: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const seg = clip(pts[i] as Pt, pts[i + 1] as Pt);
    if (!seg) {
      if (run.length) runs.push(run);
      run = [];
      continue;
    }
    const [a, b] = seg;
    const last = run[run.length - 1];
    if (last && Math.hypot(last[0] - a[0], last[1] - a[1]) < 1e-6) run.push(b);
    else {
      if (run.length) runs.push(run);
      run = [a, b];
    }
  }
  if (run.length) runs.push(run);
  return runs;
}

/** Çizgi parçalarını tek bir path'e çevirir (çok sayıda <line> yerine). */
export const segmentsPath = (segs: readonly Seg[]) =>
  segs
    .map(
      ([a, b]) => `M ${a[0].toFixed(2)} ${a[1].toFixed(2)} L ${b[0].toFixed(2)} ${b[1].toFixed(2)}`,
    )
    .join(" ");
