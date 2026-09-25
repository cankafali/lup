import { productPage } from "@/content/copy";
import type { Pt } from "@/lib/overlay";
import { clipPolylineToCircle } from "./hatch";
import { ringFrontView } from "./RingFront";
import { MM, fmt, offsetPolyline, pathOf, polar, polylinesPath, type PlateView } from "./types";

type FiligreeSpec = { innerDiameter: number; band: number; stone: number; wire: number };

/** Bant çevresindeki motif sayısı. */
const MOTIFS = 24;
/** Taşın oturduğu tepe bölgesi motifsiz kalır (derece, tepeden her iki yana). */
const CLEAR = 22;
/** Detay B: ön görünüşün 4 katı (8:1); detay dairesinin yarıçapı (levha birimi). */
const ZOOM = 4;
const DETAIL_R = 170;
/** Detayı alınan motif: sağ alttaki kıvrım halkası (bant ölçüsüyle ve kesit işaretiyle çakışmaz). */
const DETAIL_ANGLE = 48.75;

/** Telkari motifi (ön görünüş koordinatı): bant ortasında dalgalı tel, tepelerde kıvrım halkaları. */
function motif(spec: FiligreeSpec, [cx, cy]: Pt) {
  const rIn = (spec.innerDiameter / 2) * MM;
  const rOut = rIn + spec.band * MM;
  const rMid = (rIn + rOut) / 2;
  const amp = (rOut - rIn) * 0.32;
  const from = -90 + CLEAR;
  const to = 270 - CLEAR;
  const waveAt = (deg: number): Pt => {
    const t = (deg * Math.PI) / 180;
    const r = rMid + amp * Math.sin(MOTIFS * t);
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)];
  };
  const wave = (a: number, b: number, steps: number) =>
    Array.from({ length: steps + 1 }, (_, i) => waveAt(a + ((b - a) * i) / steps));
  const loopAngles = Array.from(
    { length: MOTIFS },
    (_, k) => (k * 360) / MOTIFS + 90 / MOTIFS - 90,
  ).filter((deg) => deg > from && deg < to);
  const loopAt = (deg: number) => polar([cx, cy], rMid + amp, deg);
  return { rIn, rOut, rMid, from, to, wave, loopAngles, loopAt, loopR: amp * 0.55 };
}

/** Ön görünüşte detay işaretinin merkezi ve yarıçapı. */
function detailMarker(spec: FiligreeSpec, center: Pt) {
  const m = motif(spec, center);
  return { at: polar(center, m.rMid, DETAIL_ANGLE), r: DETAIL_R / ZOOM };
}

/**
 * Telkari yüzük ön görünüşü (§11.2 `filigree`): bant içinde dalgalı tel ve kıvrım halkaları,
 * tepede taş. Ölçüler ön görünüşle aynı (iç çap, bant, toplam yükseklik, taş çapı).
 * Sağ altta "B" dairesi: 8:1 detayın alındığı yer.
 */
export function filigreeFrontView(spec: FiligreeSpec, center: Pt): PlateView {
  const m = motif(spec, center);
  const marker = detailMarker(spec, center);

  const view = ringFrontView(
    spec,
    center,
    <>
      <g fill="none" stroke="currentColor" data-draw="detail">
        <path d={pathOf(m.wave(m.from, m.to, 360))} />
        {m.loopAngles.map((deg) => {
          const [x, y] = m.loopAt(deg);
          return <circle key={deg} cx={x} cy={y} r={m.loopR} />;
        })}
      </g>
      <circle
        cx={marker.at[0]}
        cy={marker.at[1]}
        r={marker.r}
        fill="none"
        stroke="currentColor"
        data-draw="outline"
      />
    </>,
    // Kesit görünüşü yok: "A · A" işareti de yok
    false,
  );

  return {
    ...view,
    notes: [
      ...view.notes,
      { at: polar(marker.at, marker.r + 12, DETAIL_ANGLE), text: productPage.detailMark },
    ],
  };
}

/**
 * Detay B (§11.2 `filigree`, "4× büyütülmüş, daire içinde"): işaret dairesinin içi 4 kat.
 * Tel burada çift çizgiyle kalınlığıyla (Ø 0.3) görünür; bant kenarları tek çizgi.
 * Her şey detay dairesine hesapla kırpılır (K-049). Ölçüler: tel çapı, halka dış çapı.
 */
export function filigreeDetailView(spec: FiligreeSpec, front: Pt, center: Pt): PlateView {
  const m = motif(spec, front);
  const { at } = detailMarker(spec, front);
  const [dx, dy] = center;
  const map = ([x, y]: Pt): Pt => [dx + ZOOM * (x - at[0]), dy + ZOOM * (y - at[1])];
  const clip = (pts: Pt[]) => clipPolylineToCircle(pts.map(map), center, DETAIL_R);
  const half = (spec.wire / 2) * MM * ZOOM;

  // Detay dairesini kapsayan açı aralığı (bant ortasında ± yay)
  const span = ((DETAIL_R / ZOOM) * 1.6 * 180) / (Math.PI * m.rMid);
  const a0 = DETAIL_ANGLE - span;
  const a1 = DETAIL_ANGLE + span;
  const arc = (r: number) =>
    Array.from({ length: 121 }, (_, i) => polar(front, r, a0 + ((a1 - a0) * i) / 120));

  const wave = m.wave(a0, a1, 480).map(map);
  const [waveA, waveB] = offsetPolyline(wave, half);
  const loops = m.loopAngles
    .filter((deg) => deg > a0 && deg < a1)
    .map((deg) => ({ c: map(m.loopAt(deg)), r: m.loopR * ZOOM }));
  const ring = (c: Pt, r: number) =>
    Array.from({ length: 73 }, (_, i) => polar(c, r, (i * 360) / 72));

  const runs = [
    ...clip(arc(m.rIn)),
    ...clip(arc(m.rOut)),
    ...clipPolylineToCircle(waveA, center, DETAIL_R),
    ...clipPolylineToCircle(waveB, center, DETAIL_R),
    ...loops.flatMap(({ c, r }) => [
      ...clipPolylineToCircle(ring(c, r - half), center, DETAIL_R),
      ...clipPolylineToCircle(ring(c, r + half), center, DETAIL_R),
    ]),
  ];

  // Ölçülen halka: detay merkezine en yakın olan
  const loop = loops.reduce((best, l) =>
    Math.hypot(l.c[0] - dx, l.c[1] - dy) < Math.hypot(best.c[0] - dx, best.c[1] - dy) ? l : best,
  );
  const outer = loop.r + half;
  // Halka bandın dış kenarında: çap ölçüsü dışarıda (altta), tellerin üstüne binmez
  const loopY = loop.c[1] + outer + 18;

  return {
    geometry: (
      <>
        <circle
          cx={dx}
          cy={dy}
          r={DETAIL_R}
          fill="none"
          stroke="currentColor"
          data-draw="outline"
        />
        <path d={polylinesPath(runs)} fill="none" stroke="currentColor" data-draw="detail" />
      </>
    ),
    dims: [
      {
        from: [loop.c[0] + loop.r - half, loop.c[1]],
        to: [loop.c[0] + outer, loop.c[1]],
        label: `Ø ${fmt(spec.wire)}`,
        extendEnd: 36,
      },
      {
        from: [loop.c[0] - outer, loopY],
        to: [loop.c[0] + outer, loopY],
        label: fmt((2 * outer) / (MM * ZOOM)),
        labelSide: "below",
        offset: loopY - loop.c[1],
      },
    ],
    notes: [{ at: [dx, dy + DETAIL_R + 28], text: productPage.views.detail, align: "center" }],
  };
}
