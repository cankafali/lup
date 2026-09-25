import { productPage } from "@/content/copy";
import { Axis } from "@/components/primitives/Axis";
import type { Pt } from "@/lib/overlay";
import { fmt, type PlateView } from "./types";

/** Zincir detayı 20:1 (80 birim/mm): 0.3 mm'lik tel 2:1'de 2.4 birim kalır. */
const SCALE = 80;

/**
 * Kolye zincirinin halka detayı (§11.2 `pear-pendant`, "zincir halkası"): ortadaki halka önden
 * (iki elips: dış ve iç kenar), komşuları yandan (tel çapında ince şerit) ve ortadakinin
 * deliğinden geçer. Komşunun ön teli ortadakinin telinin önünden geçtiği için üstte çizilir.
 * Ölçüler: halka boyu, halka eni, tel çapı.
 */
export function chainLinkView(
  chain: { length: number; width: number; wire: number },
  center: Pt,
): PlateView {
  const [cx, cy] = center;
  const ry = (chain.length / 2) * SCALE;
  const rx = (chain.width / 2) * SCALE;
  const w = chain.wire * SCALE;
  // Halka aralığı: iç boy (komşu halkalar birbirinin içine oturur)
  const step = (chain.length - 2 * chain.wire) * SCALE;
  const neighbors = [cy - step, cy + step];

  const lengthX = cx + rx + 22;
  const wireY = cy + step + ry + 16;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[cx, cy - step - ry - 20]} to={[cx, cy + step + ry + 20]} />
          <Axis from={[cx - rx - 14, cy]} to={[cx + rx + 14, cy]} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="outline">
          <path
            fillRule="evenodd"
            className="fill-paper"
            d={`M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z M ${cx - (rx - w)} ${cy} a ${rx - w} ${ry - w} 0 1 0 ${2 * (rx - w)} 0 a ${rx - w} ${ry - w} 0 1 0 ${-2 * (rx - w)} 0 Z`}
          />
          {neighbors.map((y) => (
            <rect
              key={y}
              x={cx - w / 2}
              y={y - ry}
              width={w}
              height={2 * ry}
              rx={w / 2}
              className="fill-paper"
            />
          ))}
        </g>
      </>
    ),
    dims: [
      {
        from: [lengthX, cy - ry],
        to: [lengthX, cy + ry],
        label: fmt(chain.length),
        labelSide: "right",
        offset: lengthX - cx,
      },
      {
        from: [cx - rx, cy],
        to: [cx + rx, cy],
        label: fmt(chain.width),
        knockout: true,
      },
      {
        from: [cx - w / 2, wireY],
        to: [cx + w / 2, wireY],
        label: `Ø ${fmt(chain.wire)}`,
        extendEnd: 32,
        offset: wireY - (cy + step + ry - w / 2),
      },
    ],
    notes: [{ at: [cx, wireY + 40], text: productPage.views.chain, align: "center" }],
  };
}
