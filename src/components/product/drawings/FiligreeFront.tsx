import { productPage } from "@/content/copy";
import type { Pt } from "@/lib/overlay";
import { ringFrontView } from "./RingFront";
import { MM, pathOf, type PlateView } from "./types";

/** Bant çevresindeki motif sayısı. */
const MOTIFS = 24;
/** Taşın oturduğu tepe bölgesi motifsiz kalır (derece, tepeden her iki yana). */
const CLEAR = 22;

/**
 * Telkari yüzük ön görünüşü (§11.2 `filigree`): bant içinde dalgalı tel ve kıvrım halkaları,
 * tepede taş. Ölçüler ön görünüşle aynı (iç çap, bant, toplam yükseklik, taş çapı).
 */
export function filigreeFrontView(
  spec: { innerDiameter: number; band: number; stone: number; wire: number },
  center: Pt,
): PlateView {
  const [cx, cy] = center;
  const rIn = (spec.innerDiameter / 2) * MM;
  const rOut = rIn + spec.band * MM;
  const rMid = (rIn + rOut) / 2;
  const amp = (rOut - rIn) * 0.32;

  // Tepe −90°'de; motif, tepeden ±CLEAR dışındaki yayda.
  const from = -90 + CLEAR;
  const to = 270 - CLEAR;
  const steps = 360;
  const wave = Array.from({ length: steps + 1 }, (_, i) => {
    const deg = from + ((to - from) * i) / steps;
    const t = (deg * Math.PI) / 180;
    const r = rMid + amp * Math.sin(MOTIFS * t);
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as Pt;
  });
  const loops = Array.from({ length: MOTIFS }, (_, k) => (k * 360) / MOTIFS + 90 / MOTIFS - 90)
    .filter((deg) => deg > from && deg < to)
    .map((deg) => {
      const t = (deg * Math.PI) / 180;
      return [cx + (rMid + amp) * Math.cos(t), cy + (rMid + amp) * Math.sin(t)] as Pt;
    });

  const view = ringFrontView(
    spec,
    center,
    <g fill="none" stroke="currentColor" data-draw="detail">
      <path d={pathOf(wave)} />
      {loops.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={amp * 0.55} />
      ))}
    </g>,
  );

  return {
    ...view,
    notes: [
      ...view.notes,
      { at: [cx + rOut + 30, cy + rOut * 0.7], text: productPage.filigreeWire(spec.wire) },
    ],
  };
}
