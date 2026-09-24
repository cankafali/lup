/** SVG koordinatı: viewBox birimi ya da yüzde. */
export type Coord = number | `${number}%`;

type HairlineProps = Omit<React.SVGProps<SVGLineElement>, "from" | "to"> & {
  from: readonly [Coord, Coord];
  to: readonly [Coord, Coord];
};

/** SVG ölçeklense de 1px kalan düz çizgi; renk currentColor. Bir <svg> içinde kullanılır. */
export function Hairline({ from, to, ...rest }: HairlineProps) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke="currentColor"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      {...rest}
    />
  );
}
