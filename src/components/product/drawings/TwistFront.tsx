import type { Pt } from "@/lib/overlay";
import { ringFrontView } from "./RingFront";
import { MM, fmt, pathOf, type PlateView } from "./types";

/** Tur başına örnek sayısı (sarmalın yumuşaklığı). */
const SAMPLES_PER_TURN = 24;

/**
 * Burma ön görünüşü (§11.2 `twist`): bant iki iç içe sinüs benzeri sarmal (16 tur), taş yok.
 * Ölçüler: iç çap, bant, dış çap.
 */
export function twistFrontView(
  spec: { innerDiameter: number; band: number; turns: number },
  center: Pt,
): PlateView {
  const [cx, cy] = center;
  const rIn = (spec.innerDiameter / 2) * MM;
  const rOut = rIn + spec.band * MM;
  const rMid = (rIn + rOut) / 2;
  const amp = (rOut - rIn) / 2;
  const n = spec.turns * SAMPLES_PER_TURN;

  const strand = (phase: number) =>
    Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      const r = rMid + amp * Math.sin(spec.turns * t + phase);
      return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as Pt;
    });

  const base = ringFrontView(
    { innerDiameter: spec.innerDiameter, band: spec.band },
    center,
    <g fill="none" stroke="currentColor" data-draw="detail">
      <path d={pathOf(strand(0), true)} />
      <path d={pathOf(strand(Math.PI), true)} />
    </g>,
  );

  const outerY = cy - rOut - 22;
  return {
    ...base,
    // Toplam yükseklik yerine dış çap (taşsız bantta ikisi aynı).
    dims: [
      ...base.dims.slice(0, 2),
      {
        from: [cx - rOut, outerY],
        to: [cx + rOut, outerY],
        label: `Ø ${fmt(spec.innerDiameter + 2 * spec.band)}`,
        offset: cy - outerY,
      },
    ],
  };
}
