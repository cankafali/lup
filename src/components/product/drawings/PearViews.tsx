import { productPage } from "@/content/copy";
import { Axis } from "@/components/primitives/Axis";
import type { Pt } from "@/lib/overlay";
import { BEZEL, pearOutline, pearPath } from "./pear";
import { MM, fmt, pathOf, sampleCubic, TITLE_GAP, type PlateView } from "./types";

/** Üst görünüş ölçeği 6:1 (yuvarlak taşın üst görünüşüyle aynı, K-045). */
const TOP_SCALE = 24;
/** Tablanın kontura oranı (yuvarlak kesimdeki %57'ye yakın). */
const TABLE = 0.55;
/** Konturdaki 96 noktadan faset köşeleri: uç, sağ yan, alt, sol yan (simetrik). */
const VERTICES = [0, 13, 27, 40, 48, 56, 69, 83];
const SAMPLES = 32;

/**
 * Armut taşın üst görünüşü (§11.2 `drop-earring`, sadeleştirilmiş faset diyagramı): kontur,
 * sekiz köşeli tabla ve 8 faset (tabla köşesinden rundiste ana kenar + aradaki yıldız üçgenleri).
 * Ölçüler: boy, en.
 */
export function pearTopView(stone: { length: number; width: number }, center: Pt): PlateView {
  const [cx, cy] = center;
  const L = stone.length * TOP_SCALE;
  const W = stone.width * TOP_SCALE;
  const r = W / 2;
  const bottom = cy + L / 2;
  const roundY = bottom - r;

  const girdle = pearOutline([cx, bottom], L, W, SAMPLES);
  const n = girdle.length;
  // Tabla: kontur, yuvarlak kısmın merkezine doğru küçültülmüş
  const table = girdle.map(
    ([x, y]) => [cx + (x - cx) * TABLE, roundY + (y - roundY) * TABLE] as Pt,
  );
  const tv = VERTICES.map((i) => table[i] as Pt);
  const facets: [Pt, Pt][] = VERTICES.flatMap((i, k) => {
    const j = VERTICES[(k + 1) % VERTICES.length] as number;
    const mid = girdle[Math.round((i + (j < i ? j + n : j)) / 2) % n] as Pt;
    const t0 = tv[k] as Pt;
    const t1 = tv[(k + 1) % tv.length] as Pt;
    return [
      [t0, girdle[i] as Pt],
      [t0, mid],
      [t1, mid],
    ] as [Pt, Pt][];
  });

  const lengthX = cx - r - 22;
  const widthY = bottom + 22;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[cx, bottom - L - 14]} to={[cx, bottom + 14]} />
          <Axis from={[cx - r - 14, roundY]} to={[cx + r + 14, roundY]} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="outline">
          <path d={pearPath([cx, bottom], L, W)} />
          <path d={pathOf(tv, true)} />
        </g>
        <path
          d={facets.map(([a, b]) => pathOf([a, b])).join(" ")}
          fill="none"
          stroke="currentColor"
          data-draw="detail"
        />
      </>
    ),
    dims: [
      {
        from: [lengthX, bottom - L],
        to: [lengthX, bottom],
        label: fmt(stone.length),
        labelSide: "left",
        offset: cx - lengthX,
      },
      {
        from: [cx - r, widthY],
        to: [cx + r, widthY],
        label: fmt(stone.width),
        labelSide: "below",
        offset: widthY - roundY,
      },
    ],
    notes: [{ at: [cx, widthY + TITLE_GAP], text: productPage.views.top, align: "center" }],
  };
}

type SideSpec = {
  total: number;
  stone: { length: number; depth: number };
  /** Küpede halka + kanca, kolye ucunda askı + zincir. */
  attach: "hook" | "bail";
  /** Birim/mm (varsayılan levha ölçeği 2:1); küçük parçada büyütülür, başlık ölçeği söyler. */
  scale?: number;
  label: string;
};

/**
 * Armut taşlı parçanın yan görünüşü (varsayılan 2:1): taş yandan (öne taç ve tabla, arkaya köşk),
 * rundisti saran kapalı yuva, üstte kancanın profili ya da askı. Ön görünüşle aynı dikey
 * ölçüler (toplam boy, taş boyu); ölçüler: taş derinliği, kanca derinliği.
 */
export function pearSideView(spec: SideSpec, center: Pt): PlateView {
  const [cx, cy] = center;
  const scale = spec.scale ?? MM;
  // Ön görünüşteki sabit ölçüler (yuva, halka, kanca) 2:1 birimiyle tanımlı: ölçekle büyür
  const u = scale / MM;
  const half = (spec.total / 2) * scale;
  const top = cy - half;
  const bottom = cy + half;
  const L = spec.stone.length * scale;
  const D = spec.stone.depth * scale;
  const crown = D * 0.3;
  const pavilion = D - crown;
  const bezel = BEZEL * u;
  const stoneBottom = bottom - bezel;
  const stoneTop = stoneBottom - L;
  const bezelTop = stoneTop - bezel * 1.4;
  const culetY = stoneBottom - L * 0.32;

  // Kanca: halkadan yukarı çıkar, tepeden kıvrılıp arkaya iner (ön görünüşte tek çizgi)
  const ringR = 4 * u;
  const ringY = bezelTop - ringR;
  const at = (x: number, y: number): Pt => [cx + x * u, top + y * u];
  const hook = [
    ...sampleCubic(at(0, 36), at(0, 10), at(14, -2), at(28, 4)),
    ...sampleCubic(at(28, 4), at(40, 10), at(44, 30), at(40, 56)),
  ];
  const hookDepth = Math.max(...hook.map(([x]) => x)) - cx;
  // Askı yandan: halka kenarından görünür (ince dikey şerit)
  const bailRy = (bezelTop - top) / 2;

  const depthY = bottom + 22;
  const hookY = top + 70 * u;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis
            from={[cx, (spec.attach === "bail" ? top - 60 * u : top) - 14]}
            to={[cx, bottom + 14]}
          />
          <Axis from={[cx - crown - 16, culetY]} to={[cx + pavilion + 16, culetY]} />
        </g>
        <g fill="none" stroke="currentColor" data-draw="detail">
          {/* Taç: rundistten tablaya, tabla boyunca, rundiste */}
          <path
            d={pathOf([
              [cx, stoneTop],
              [cx - crown, stoneTop + L * 0.25],
              [cx - crown, stoneBottom - L * 0.15],
              [cx, stoneBottom],
            ])}
          />
          {/* Köşk: arkada, omurga çizgisi alt uca yakın bir noktada birleşir */}
          <path
            d={pathOf([
              [cx, stoneTop],
              [cx + pavilion, culetY],
              [cx, stoneBottom],
            ])}
          />
        </g>
        <g fill="none" stroke="currentColor" data-draw="outline">
          {/* Yuva, rundistin önündeki taş çizgilerini örter */}
          <rect
            x={cx - 3 * u}
            y={bezelTop}
            width={8 * u}
            height={bottom - bezelTop}
            rx={4 * u}
            className="fill-paper"
          />
          {spec.attach === "hook" ? (
            <>
              <rect
                x={cx - 1.2 * u}
                y={ringY - ringR}
                width={2.4 * u}
                height={ringR * 2}
                rx={1.2 * u}
              />
              <path d={`M ${cx} ${ringY - ringR} ${pathOf(hook).replace(/^M/, "L")}`} />
            </>
          ) : (
            <rect x={cx - 2 * u} y={top} width={4 * u} height={bailRy * 2} rx={2 * u} />
          )}
        </g>
        {spec.attach === "bail" && (
          <g fill="none" stroke="currentColor" data-draw="detail">
            {/* Zincirin ilk halkası yandan yüz görünür; devamı kesikli */}
            <ellipse cx={cx} cy={top - 7 * u} rx={4 * u} ry={6 * u} />
            <path d={`M ${cx} ${top - 13 * u} L ${cx} ${top - 60 * u}`} strokeDasharray="2 3" />
          </g>
        )}
      </>
    ),
    dims: [
      {
        from: [cx - crown, depthY],
        to: [cx + pavilion, depthY],
        label: fmt(spec.stone.depth),
        labelSide: "below",
        offset: depthY - culetY,
      },
      ...(spec.attach === "hook"
        ? [
            {
              from: [cx, hookY] as Pt,
              to: [cx + hookDepth, hookY] as Pt,
              label: fmt(hookDepth / scale),
              labelSide: "below" as const,
              offset: hookY - (top + 40 * u),
            },
          ]
        : []),
    ],
    notes: [{ at: [cx, depthY + TITLE_GAP], text: spec.label, align: "center" }],
  };
}
