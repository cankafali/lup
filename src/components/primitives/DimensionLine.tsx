import clsx from "clsx";
import { LABEL_SIDE, SIDE_VEC, pct, type Pt, type Side, type ViewBox } from "@/lib/overlay";
import { Hairline } from "./Hairline";
import { MonoLabel } from "./MonoLabel";

/** Çentiğin yarı boyu (viewBox birimi): ±5 → 10 toplam. */
const TICK = 5;
const EXTENSION_OPACITY = 0.35;

type DimensionLineProps = {
  from: Pt;
  to: Pt;
  /** "Ø 18.2 mm" */
  label: string;
  /** Varsayılan: yatay çizgide üst, dikey çizgide sağ. */
  labelSide?: Side;
  /** > 0 ise uçlardan ölçülen nesneye (etiketin karşı yönü) uzatma çizgileri. */
  offset?: number;
  tone?: "graphite" | "paper";
  /** Görünür olunca çizilsin mi (animasyon Aşama 5'te bağlanır). */
  animate?: boolean;
  /** Koordinat uzayı; bileşen bu uzayı temsil eden konumlu kapsayıcıyı doldurur. */
  viewBox: ViewBox;
  className?: string;
};

/**
 * Ölçü oku (§8.3). SVG çizgi + HTML etiket; etiket keskin render için SVG dışında,
 * konumu yüzde olarak hesaplanır. Ölçü bilgisi metin olarak başka yerde olduğundan aria-hidden.
 */
export function DimensionLine({
  from,
  to,
  label,
  labelSide,
  offset = 0,
  tone = "graphite",
  animate = false,
  viewBox,
  className,
}: DimensionLineProps) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const [w, h] = viewBox;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Çizgiye dik çentik vektörü
  const nx = (-dy / len) * TICK;
  const ny = (dx / len) * TICK;
  const side = labelSide ?? (Math.abs(dx) >= Math.abs(dy) ? "above" : "right");
  const [sx, sy] = SIDE_VEC[side];
  const ex = -sx * offset;
  const ey = -sy * offset;

  return (
    <span
      aria-hidden
      data-dimension
      data-animate={animate || undefined}
      className={clsx(
        "pointer-events-none absolute inset-0 block",
        tone === "paper" ? "text-paper" : "text-graphite",
        className,
      )}
    >
      <svg
        className="absolute inset-0 size-full overflow-visible"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        fill="none"
      >
        {offset > 0 && (
          <g opacity={EXTENSION_OPACITY} data-dim-extension>
            <Hairline from={from} to={[x1 + ex, y1 + ey]} />
            <Hairline from={to} to={[x2 + ex, y2 + ey]} />
          </g>
        )}
        <Hairline from={from} to={to} data-dim-line />
        <g data-dim-ticks>
          <Hairline from={[x1 - nx, y1 - ny]} to={[x1 + nx, y1 + ny]} />
          <Hairline from={[x2 - nx, y2 - ny]} to={[x2 + nx, y2 + ny]} />
        </g>
      </svg>
      <span
        data-dim-label
        className={clsx("absolute w-max", LABEL_SIDE[side])}
        style={{ left: pct((x1 + x2) / 2, w), top: pct((y1 + y2) / 2, h) }}
      >
        <MonoLabel tone={tone} className="block">
          {label}
        </MonoLabel>
      </span>
    </span>
  );
}
