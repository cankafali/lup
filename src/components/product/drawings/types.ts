import type { DimensionLineProps } from "@/components/primitives/DimensionLine";
import type { Pt, ViewBox } from "@/lib/overlay";

/** Teknik levhanın koordinat uzayı (§11.2). */
export const PLATE: ViewBox = [800, 1100];

/** Levha ölçeği: 1 mm = 8 birim (≈ 2:1). */
export const MM = 8;

/**
 * Görünüş merkezleri (§11.2): A ön görünüş, B üst görünüş, C kesit.
 * Telkaride B ve C yerine altta ortada büyütülmüş detay.
 */
export const CENTER = {
  front: [400, 320],
  top: [220, 760],
  section: [580, 760],
  detail: [400, 745],
} as const satisfies Record<string, Pt>;

export type PlateDim = Omit<DimensionLineProps, "viewBox" | "className" | "animate" | "tone">;

export type PlateNote = { at: Pt; text: string; align?: "start" | "center" | "end" };

/** Bir görünüş: SVG geometrisi (levha svg'sine girer) + HTML ölçüler ve notlar. */
export type PlateView = { geometry: React.ReactNode; dims: PlateDim[]; notes: PlateNote[] };

/** Ölçü etiketi: mm, bir ondalık ("17.3"). */
export const fmt = (mm: number) => mm.toFixed(1);

/** Kutupsal nokta (SVG ekseni: y aşağı). */
export const polar = ([cx, cy]: Pt, r: number, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

/** Nokta dizisinden kapalı ya da açık path. */
export const pathOf = (pts: readonly Pt[], close = false) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ") +
  (close ? " Z" : "");

/** Birden çok çoklu çizgiden tek path. */
export const polylinesPath = (runs: readonly (readonly Pt[])[]) =>
  runs.map((r) => pathOf(r)).join(" ");

/** Kübik Bézier üzerinde `n + 1` nokta. */
export function sampleCubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, n = 16): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    const [a, b, c, d] = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
    return [
      a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
      a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
    ] as Pt;
  });
}

/** Çizgiye dik yönde ± `d` kaydırılmış iki kopya (tel kalınlığı gösterimi). */
export function offsetPolyline(pts: readonly Pt[], d: number): [Pt[], Pt[]] {
  const normal = (i: number): Pt => {
    const a = pts[Math.max(0, i - 1)] as Pt;
    const b = pts[Math.min(pts.length - 1, i + 1)] as Pt;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
  };
  const left = pts.map(([x, y], i) => {
    const [nx, ny] = normal(i);
    return [x + nx * d, y + ny * d] as Pt;
  });
  const right = pts.map(([x, y], i) => {
    const [nx, ny] = normal(i);
    return [x - nx * d, y - ny * d] as Pt;
  });
  return [left, right];
}

/**
 * Altında ölçü etiketi olan görünüşte, ölçü çizgisinden görünüş başlığına (birim). Mobil
 * pencerede levha ≈ 0.6 ölçeğe iner; etiketler sabit boyutlu olduğundan 44 birimde başlığa biniyordu.
 */
export const TITLE_GAP = 52;
