import clsx from "clsx";
import { productPage } from "@/content/copy";
import type { DrawingSpec, Product } from "@/content/products";
import { Callout } from "@/components/primitives/Callout";
import { DimensionLine } from "@/components/primitives/DimensionLine";
import { Lens } from "@/components/primitives/Lens";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { pct, type Pt } from "@/lib/overlay";
import { bandSectionView } from "./drawings/BandSection";
import { chainLinkView } from "./drawings/ChainLink";
import { dropEarringFrontView } from "./drawings/DropEarringFront";
import { filigreeDetailView, filigreeFrontView } from "./drawings/FiligreeFront";
import { pearPendantFrontView } from "./drawings/PearPendantFront";
import { pearSideView, pearTopView } from "./drawings/PearViews";
import { ringFrontView, stoneProfile } from "./drawings/RingFront";
import { ringTopView } from "./drawings/RingTop";
import { tennisFlatView } from "./drawings/TennisFront";
import { tennisSectionView, tennisSettingView } from "./drawings/TennisViews";
import { TitleBlock } from "./drawings/TitleBlock";
import { twistFrontView } from "./drawings/TwistFront";
import { twistDevelopmentView, twistSectionView } from "./drawings/TwistViews";
import { CENTER, MM, PLATE, type PlateView } from "./drawings/types";

/** Levhanın sağ üst boşluğundaki statik lup (§11.2 A): merkez ve iç çap (levha birimi). */
const LENS_CENTER: Pt = [660, 190];
const LENS_D = 170;
const LENS_RING = 8;

const ALIGN = {
  start: "",
  center: "-translate-x-1/2 text-center",
  end: "-translate-x-full text-right",
} as const;

type Plate = { views: PlateView[]; stone?: Pt };

/** Taşlı yüzükte işaret noktası: tacın ortası (levha koordinatı). */
function crownMark(innerDiameter: number, stone: number): Pt {
  const [cx, cy] = CENTER.front;
  const p = stoneProfile(innerDiameter, stone);
  return [cx, cy + (p.tableY + p.girdleTop) / 2];
}

/**
 * Parça tipine göre görünüşler (§11.2): üstte A (ön görünüş ya da düz açılım), altta iki
 * çeyrekte B ve C; telkaride altta ortada büyütülmüş detay. Taşlı yüzüklerde sağ üstte lup.
 */
function plateFor(spec: DrawingSpec): Plate {
  switch (spec.kind) {
    case "solitaire":
      return {
        views: [
          // Ön görünüşteki halka kalınlığı = kesit kalınlığı (K-047)
          ringFrontView(
            { innerDiameter: spec.innerDiameter, band: spec.section.thickness, stone: spec.stone },
            CENTER.front,
          ),
          ringTopView(spec.stone, CENTER.top),
          bandSectionView(spec.section, CENTER.section),
        ],
        stone: crownMark(spec.innerDiameter, spec.stone),
      };
    case "twist":
      return {
        views: [
          twistFrontView(spec, CENTER.front),
          // Açılım uzun: sol ölçü etiketi levha kenarına yaslanmasın diye biraz sağda
          twistDevelopmentView(spec, [CENTER.top[0] + 25, CENTER.top[1]]),
          twistSectionView(spec, CENTER.section),
        ],
      };
    case "drop-earring":
      return {
        views: [
          dropEarringFrontView(spec, CENTER.front),
          pearTopView(spec.stone, CENTER.top),
          pearSideView({ ...spec, attach: "hook", label: productPage.views.side }, CENTER.section),
        ],
      };
    case "tennis":
      return {
        views: [
          tennisFlatView(spec, CENTER.front),
          tennisSettingView(spec, CENTER.top),
          tennisSectionView(spec, CENTER.section),
        ],
      };
    case "pear-pendant":
      return {
        views: [
          pearPendantFrontView(spec, CENTER.front),
          // 12 mm uç 2:1 yan görünüşte 27 birim derinlik kalır: 4:1
          pearSideView(
            { ...spec, attach: "bail", scale: 2 * MM, label: productPage.views.sideZoom },
            CENTER.top,
          ),
          chainLinkView(spec.chain, [CENTER.section[0], CENTER.section[1] - 20]),
        ],
      };
    case "filigree":
      return {
        views: [
          filigreeFrontView(spec, CENTER.front),
          filigreeDetailView(spec, CENTER.front, CENTER.detail),
        ],
        stone: crownMark(spec.innerDiameter, spec.stone),
      };
  }
}

/** Lupun dış kenarında taşa en yakın nokta (levha birimi). */
function lensEdgeToward([sx, sy]: Pt): Pt {
  const [cx, cy] = LENS_CENTER;
  const r = LENS_D / 2 + LENS_RING;
  const d = Math.hypot(sx - cx, sy - cy) || 1;
  return [cx + ((sx - cx) / d) * r, cy + ((sy - cy) / d) * r];
}

const CORNERS = [
  "top-6 left-6 border-t border-l",
  "top-6 right-6 border-t border-r",
  "bottom-6 left-6 border-b border-l",
  "bottom-6 right-6 border-b border-r",
] as const;

/** Antet tablosu hücreleri (§11.2 D). */
export function titleCells(product: Product) {
  const t = productPage.titleBlock;
  return [
    { label: t.part, value: product.name },
    { label: t.no, value: product.certNo },
    { label: t.master, value: t.masterValue },
    { label: t.scale, value: t.scaleValue },
    { label: t.date, value: t.dateValue },
  ];
}

/**
 * Mobilde levha pencereleri (§15, K-079): önce üstteki görünüş (taşlı yüzükte lupla), sonra
 * alttaki görünüşler. Alttakiler tek pencerede ancak ölçek ≈ 0.6'nın altına düşmüyorsa; yoksa
 * etiketler (sabit boyutlu HTML) birbirine biner ve her görünüş kendi penceresini alır (K-087).
 * Kutular levha biriminde [x, y, en, boy].
 */
export function plateCrops(spec: DrawingSpec): [number, number, number, number][] {
  switch (spec.kind) {
    case "solitaire":
      return [
        [230, 90, 540, 370],
        [110, 620, 590, 290],
      ];
    case "twist":
      return [
        [230, 170, 380, 310],
        [40, 680, 380, 200],
        [450, 640, 260, 270],
      ];
    case "drop-earring":
      return [
        [230, 190, 340, 330],
        [90, 640, 580, 300],
      ];
    // Düz açılım yatay ve alçak: pencere de alçak
    case "tennis":
      return [
        [190, 220, 380, 230],
        [70, 680, 290, 230],
        [470, 650, 250, 220],
      ];
    case "pear-pendant":
      return [
        [200, 180, 400, 300],
        [120, 520, 580, 430],
      ];
    case "filigree":
      return [
        [230, 90, 540, 400],
        [215, 560, 370, 400],
      ];
  }
}

type TechnicalPlateProps = {
  product: Product;
  total: number;
  /**
   * Mobil pencere (PlateWindow) içinde: antet tablosu ve sağ üst levha no/ölçek levhanın dışında
   * gösterilir (sayfa başlığı + ızgara antet); pencerede lupla çakışmasınlar.
   */
  windowed?: boolean;
  /** Aynı levhanın ikinci penceresi: ekran okuyucudan gizli. */
  decorative?: boolean;
};

/**
 * Sol sütundaki teknik levha (§11.2): tek SVG (viewBox 800×1100) + HTML ölçü etiketleri.
 * Kesim izleri, sağ üstte levha no ve ölçek, en altta antet tablosu.
 */
export function TechnicalPlate({
  product,
  total,
  windowed = false,
  decorative = false,
}: TechnicalPlateProps) {
  const [W, H] = PLATE;
  const { views, stone } = plateFor(product.drawingSpec);
  const lensEdge = stone ? lensEdgeToward(stone) : null;

  return (
    <figure
      data-plate
      aria-label={decorative ? undefined : `${product.name} — teknik çizim`}
      aria-hidden={decorative || undefined}
      className="[container-type:inline-size] relative aspect-[800/1100] w-full"
    >
      <svg
        aria-hidden
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 size-full text-graphite [&_*]:[vector-effect:non-scaling-stroke]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      >
        {views.map((v, i) => (
          <g key={i}>{v.geometry}</g>
        ))}
        {stone && lensEdge && (
          <line data-plate-guide x1={lensEdge[0]} y1={lensEdge[1]} x2={stone[0]} y2={stone[1]} />
        )}
      </svg>

      {views.flatMap((v, i) =>
        v.dims.map((d, j) => <DimensionLine key={`${i}-${j}`} viewBox={PLATE} animate {...d} />),
      )}

      {views.flatMap((v, i) =>
        v.notes.map((n, j) => (
          <MonoLabel
            key={`${i}-${j}`}
            aria-hidden
            data-plate-note
            size="s"
            className={clsx("absolute w-max -translate-y-1/2", ALIGN[n.align ?? "start"])}
            style={{ left: pct(n.at[0], W), top: pct(n.at[1], H) }}
          >
            {n.text}
          </MonoLabel>
        )),
      )}

      {stone && (
        <>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(LENS_CENTER[0], W), top: pct(LENS_CENTER[1], H) }}
          >
            <Lens
              src={product.macro?.src ?? "/images/lup-detay.jpg"}
              alt={product.macro?.alt ?? productPage.lensAlt}
              diameter={LENS_D}
              diameterCss={`calc(${LENS_D} / ${W} * 100cqw)`}
              sizes="(min-width: 1024px) 12vw, 40vw"
              ring={LENS_RING}
            />
          </div>
          {/* Taşın üstündeki işaret: damga dili (küçük işaret noktası), odak kırmızısı değil */}
          <Callout viewBox={PLATE} point={stone} dot="stamp" dotSize={8} />
        </>
      )}

      {!windowed && (
        <div
          data-plate-meta
          className="absolute top-12 right-12 text-right"
          // Levha daraldıkça lup yukarı çıkar; 3 satırlık blok (38px + 10px ara) lupun üstünde kalsın
          style={
            stone
              ? {
                  top: `min(48px, ${((LENS_CENTER[1] - LENS_D / 2 - LENS_RING) / W) * 100}cqw - 48px)`,
                }
              : undefined
          }
        >
          <MonoLabel size="s" tone="lead" className="block">
            {productPage.plate(product.no, total)}
          </MonoLabel>
          <MonoLabel size="s" tone="lead" className="block">
            {productPage.scale}
          </MonoLabel>
        </div>
      )}

      {!windowed && (
        <TitleBlock className="absolute inset-x-[5%] bottom-[3.6%]" cells={titleCells(product)} />
      )}

      {CORNERS.map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={clsx("pointer-events-none absolute size-4 border-graphite", pos)}
        />
      ))}
    </figure>
  );
}
