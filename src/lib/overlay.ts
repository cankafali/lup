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

/** Etiketi bir noktanın verilen yanına 8px boşlukla yerleştiren sınıflar. */
export const LABEL_SIDE: Record<Side, string> = {
  above: "-translate-x-1/2 translate-y-[calc(-100%-8px)] text-center",
  below: "-translate-x-1/2 translate-y-2 text-center",
  left: "translate-x-[calc(-100%-8px)] -translate-y-1/2 text-right",
  right: "translate-x-2 -translate-y-1/2",
};
