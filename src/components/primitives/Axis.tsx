import { Hairline, type Coord } from "./Hairline";

type AxisProps = {
  from: readonly [Coord, Coord];
  to: readonly [Coord, Coord];
  /** Varsayılan %45 (§8.4); hero taş ekseni %50, 10× bölümü %40. */
  opacity?: number;
};

/** Kesikli eksen (§8.4): 8-3-2-3, 1px. Bir <svg> içinde kullanılır; renk currentColor. */
export function Axis({ from, to, opacity = 0.45 }: AxisProps) {
  return (
    <Hairline from={from} to={to} strokeOpacity={opacity} strokeDasharray="8 3 2 3" data-axis />
  );
}
