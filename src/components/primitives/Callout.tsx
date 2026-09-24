import clsx from "clsx";
import { LABEL_SIDE, pct, type Pt, type Side, type ViewBox } from "@/lib/overlay";
import { Hairline } from "./Hairline";
import { MonoLabel } from "./MonoLabel";
import { PaperTag } from "./PaperTag";

type CalloutProps = {
  /** Koordinat uzayı; bileşen bu uzayı temsil eden konumlu kapsayıcıyı doldurur. */
  viewBox: ViewBox;
  /** İşaret noktasının merkezi. */
  point: Pt;
  /** Kılavuz çizginin ucu; verilmezse yalnızca nokta (+ etiket). */
  to?: Pt;
  label?: string;
  /** Etiketin sol üst köşesi (labelAlign="end" ise sağ üst). Verilmezse çizgi ucuna labelSide ile. */
  labelAt?: Pt;
  labelAlign?: "start" | "end";
  labelSide?: Side;
  variant?: "mono" | "tag";
  /** stamp = odak (kırmızı bütçesine girer), graphite = varsayılan, ring = paper dolgu + graphite kenar. */
  dot?: "stamp" | "graphite" | "ring";
  dotSize?: 6 | 8 | 10;
  /** Çizgi ve mono etiket rengi; fotoğrafın koyu bölgesinde paper. */
  tone?: "graphite" | "paper";
  className?: string;
};

const DOT = {
  stamp: "bg-stamp",
  graphite: "bg-graphite",
  ring: "border border-graphite bg-paper",
} as const;

const DOT_SIZE = { 6: "size-1.5", 8: "size-2", 10: "size-2.5" } as const;

/** İşaret noktası + kılavuz çizgi + etiket (§8.5). */
export function Callout({
  viewBox,
  point,
  to,
  label,
  labelAt,
  labelAlign = "start",
  labelSide = "right",
  variant = "mono",
  dot = "graphite",
  dotSize = 10,
  tone = "graphite",
  className,
}: CalloutProps) {
  const [w, h] = viewBox;
  const anchor = labelAt ?? to ?? point;

  return (
    <span
      data-callout
      className={clsx(
        "pointer-events-none absolute inset-0 block",
        tone === "paper" ? "text-paper" : "text-graphite",
        className,
      )}
    >
      {to && (
        <svg
          aria-hidden
          className="absolute inset-0 size-full overflow-visible"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          fill="none"
        >
          <Hairline from={point} to={to} data-callout-line />
        </svg>
      )}
      <span
        aria-hidden
        data-callout-dot
        className={clsx(
          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
          DOT[dot],
          DOT_SIZE[dotSize],
        )}
        style={{ left: pct(point[0], w), top: pct(point[1], h) }}
      />
      {label && (
        <span
          data-callout-label
          className={clsx(
            "absolute w-max",
            labelAt
              ? labelAlign === "end" && "-translate-x-full text-right"
              : LABEL_SIDE[labelSide],
          )}
          style={{ left: pct(anchor[0], w), top: pct(anchor[1], h) }}
        >
          {variant === "tag" ? (
            <PaperTag block>{label}</PaperTag>
          ) : (
            <MonoLabel tone={tone} className="block">
              {label}
            </MonoLabel>
          )}
        </span>
      )}
    </span>
  );
}
