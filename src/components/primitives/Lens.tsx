import Image from "next/image";
import clsx from "clsx";
import { CANVAS_REF } from "@/lib/tokens";
import { Axis } from "./Axis";
import { MonoLabel } from "./MonoLabel";

type LensProps = {
  /** Makro görsel */
  src: string;
  alt: string;
  /** İç çap (1440 referansında px); dar ekranda orantılı küçülür. */
  diameter: number;
  /** Dış halka kalınlığı (px): hero ve telkari 8, 10× bölümü 16. */
  ring?: number;
  /** "10×" */
  label?: string;
  /** outside: sağ üstte halkanın dışında; inside: sağ üst iç kenarda. */
  labelPlacement?: "outside" | "inside";
  /** Yatay + dikey kesikli eksen. true: iki eksen de 24px taşar; ya da {h, v} px. */
  axes?: boolean | { h: number; v: number };
  axesOpacity?: number;
  className?: string;
};

const AXES_OVERHANG = 24;
/** 45°'deki çember noktasının kutu kenarına uzaklığı, çapın oranı olarak: (1 − cos 45°) / 2. */
const DIAG = (1 - Math.SQRT1_2) / 2;

/** Statik (dekoratif) lup dairesi (§8.7). İmleç lupu değildir. */
export function Lens({
  src,
  alt,
  diameter,
  ring = 8,
  label,
  labelPlacement = "outside",
  axes = false,
  axesOpacity,
  className,
}: LensProps) {
  const overhang = axes === true ? { h: AXES_OVERHANG, v: AXES_OVERHANG } : axes || null;

  return (
    <div
      data-lens
      className={clsx("relative aspect-square w-(--lens-outer)", className)}
      style={{
        "--lens-d": `min(${diameter}px, ${(diameter / CANVAS_REF) * 100}vw)`,
        "--lens-ring": `${ring}px`,
        "--lens-outer": "calc(var(--lens-d) + 2 * var(--lens-ring))",
      }}
    >
      <div className="size-full rounded-full border-(length:--lens-ring) border-graphite/25">
        <div className="relative size-full overflow-hidden rounded-full border border-graphite">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={`${diameter}px`}
            className="object-cover"
            data-hires={src}
          />
        </div>
      </div>

      {overhang && (
        // SVG yerleştirilmiş öğedir; inset ile gerilmez, boyutu açıkça verilir.
        <svg
          aria-hidden
          className="pointer-events-none absolute overflow-visible text-graphite"
          style={{
            left: -overhang.h,
            top: -overhang.v,
            width: `calc(100% + ${2 * overhang.h}px)`,
            height: `calc(100% + ${2 * overhang.v}px)`,
          }}
        >
          <Axis from={["0%", "50%"]} to={["100%", "50%"]} opacity={axesOpacity} />
          <Axis from={["50%", "0%"]} to={["50%", "100%"]} opacity={axesOpacity} />
        </svg>
      )}

      {label && (
        <MonoLabel
          tone="stamp"
          data-loupe-hide
          className={clsx(
            "absolute",
            labelPlacement === "outside"
              ? "translate-x-1 translate-y-[calc(-100%-4px)]"
              : "translate-x-[calc(-100%-8px)] translate-y-2",
          )}
          style={
            labelPlacement === "outside"
              ? { left: `${(1 - DIAG) * 100}%`, top: `${DIAG * 100}%` }
              : {
                  left: `calc(var(--lens-ring) + var(--lens-d) * ${1 - DIAG})`,
                  top: `calc(var(--lens-ring) + var(--lens-d) * ${DIAG})`,
                }
          }
        >
          {label}
        </MonoLabel>
      )}
    </div>
  );
}
