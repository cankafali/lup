/** Bir viewBox içindeki nokta. */
export type Pt = readonly [number, number];

/** Koordinat uzayı: [genişlik, yükseklik]. */
export type ViewBox = readonly [number, number];

export type Side = "above" | "below" | "left" | "right";

/** viewBox koordinatını kapsayıcıya göre yüzdeye çevirir (HTML etiketleri için). */
export const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export const SIDE_VEC: Record<Side, Pt> = {
  above: [0, -1],
  below: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

/** object-position oranları (0–1), CSS'teki `--photo-x` / `--photo-y` ile aynı anlamda. */
export type CoverFit = { w: number; h: number; x?: number; y?: number };

/**
 * `object-fit: cover` ile cw×ch kapsayıcıda gösterilen görseldeki (px, py) noktasının
 * kapsayıcıya göre konumu (px). PhotoOverlay'in CSS hesabıyla aynı formül.
 */
export function coverPoint(cw: number, ch: number, fit: CoverFit, px: number, py: number) {
  const { w, h, x = 0.5, y = 0.5 } = fit;
  const s = Math.max(cw / w, ch / h);
  return { x: (cw - w * s) * x + px * s, y: (ch - h * s) * y + py * s };
}

/** Etiketi bir noktanın verilen yanına 8px boşlukla yerleştiren sınıflar. */
export const LABEL_SIDE: Record<Side, string> = {
  above: "-translate-x-1/2 translate-y-[calc(-100%-8px)] text-center",
  below: "-translate-x-1/2 translate-y-2 text-center",
  left: "translate-x-[calc(-100%-8px)] -translate-y-1/2 text-right",
  right: "translate-x-2 -translate-y-1/2",
};
