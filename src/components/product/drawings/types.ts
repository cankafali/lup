import type { DimensionLineProps } from "@/components/primitives/DimensionLine";
import type { Pt, ViewBox } from "@/lib/overlay";

/** Teknik levhanın koordinat uzayı (§11.2). */
export const PLATE: ViewBox = [800, 1100];

/** Levha ölçeği: 1 mm = 8 birim (≈ 2:1). */
export const MM = 8;

/** Görünüş merkezleri (§11.2): A ön görünüş, B üst görünüş, C kesit. */
export const CENTER = {
  front: [400, 320],
  top: [220, 760],
  section: [580, 760],
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
