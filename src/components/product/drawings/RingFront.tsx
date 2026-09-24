/** Çizim ölçeği: 1 mm = 8 birim (§11.2 A). */
export const MM = 8;

type RingFrontProps = {
  /** İç çap (mm) */
  innerDiameter: number;
  /** Bant kalınlığı (mm) */
  band: number;
  /** Yuvarlak taş (tektaş); verilmezse düz bant. */
  stone?: { diameter: number };
  /** Tırnak teli çapı (mm) */
  prong?: number;
};

/** Yuvarlak pırlanta profil oranları (rundist çapına göre). */
const CROWN = 0.15;
const PAVILION = 0.43;
const TABLE = 0.57;
const GIRDLE = 0.03;
/** Köşk ucunun bant iç yüzeyinden yukarı mesafesi (birim). */
const CULET_GAP = 2;

/** Taş profilinin dikey konumları (merkez 0,0; yukarı negatif). */
export function stoneProfile(innerDiameter: number, stoneDiameter: number) {
  const rIn = (innerDiameter / 2) * MM;
  const d = stoneDiameter * MM;
  const culetY = -rIn - CULET_GAP;
  const girdleBottom = culetY - PAVILION * d;
  const girdleTop = girdleBottom - GIRDLE * d;
  const tableY = girdleTop - CROWN * d;
  return { half: d / 2, tableHalf: (TABLE * d) / 2, culetY, girdleTop, girdleBottom, tableY };
}

/**
 * Yüzük ön görünüşü (§11.2 A): iki eş merkezli daire (bant), tepede taşın profil görünüşü
 * (rundist, taç, köşk) ve iki görünen tırnak. Merkez (0, 0); çizgi currentColor.
 * Bir <svg> içinde kullanılır; çizgilerin 1px kalması için svg'ye non-scaling-stroke verilir.
 */
export function RingFront({ innerDiameter, band, stone, prong = 0.9 }: RingFrontProps) {
  const rIn = (innerDiameter / 2) * MM;
  const rOut = rIn + band * MM;

  let stoneParts: React.ReactNode = null;
  if (stone) {
    const p = stoneProfile(innerDiameter, stone.diameter);
    const pw = prong * MM;
    const prongTop = p.girdleTop - (p.girdleTop - p.tableY) * 0.6;
    // Tırnak: ince dikdörtgen + yuvarlak uç; iç kenarı rundiste biner.
    const prongPath = (dir: 1 | -1) => {
      const inner = dir * (p.half - pw * 0.35);
      const outer = dir * (p.half + pw * 0.65);
      const base = -Math.sqrt(rOut * rOut - outer * outer);
      const cap = prongTop + pw / 2;
      return `M ${inner} ${base} L ${inner} ${cap} A ${pw / 2} ${pw / 2} 0 0 ${dir === 1 ? 1 : 0} ${outer} ${cap} L ${outer} ${base}`;
    };

    stoneParts = (
      <g data-drawing-stone>
        <path
          d={`M ${-p.half} ${p.girdleTop} L ${-p.tableHalf} ${p.tableY} L ${p.tableHalf} ${p.tableY} L ${p.half} ${p.girdleTop}`}
        />
        <rect
          x={-p.half}
          y={p.girdleTop}
          width={p.half * 2}
          height={p.girdleBottom - p.girdleTop}
        />
        <path d={`M ${-p.half} ${p.girdleBottom} L 0 ${p.culetY} L ${p.half} ${p.girdleBottom}`} />
        <path d={prongPath(-1)} />
        <path d={prongPath(1)} />
      </g>
    );
  }

  return (
    <g fill="none" stroke="currentColor" strokeWidth={1} data-drawing="ring-front">
      <circle r={rOut} />
      <circle r={rIn} />
      {stoneParts}
    </g>
  );
}
