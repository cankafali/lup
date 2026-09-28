import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { og } from "@/content/copy";
import { COLOR, LOUPE } from "@/lib/tokens";

export const alt = og.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Lup dairesi (iç çap) ve dış halka (px). */
const LENS_D = 360;
const RING = LOUPE.ring;
/** Kesim izi (§7): 24px L, kenardan 32px içeride. */
const MARK = 24;
const INSET = 32;

const [mono, photo] = await Promise.all([
  // Font repoda (OFL, src/assets/fonts): geist paketinin iç klasör yapısı değişirse derleme kırılmasın (inceleme 5.4)
  readFile(join(process.cwd(), "src/assets/fonts/GeistMono-Medium.ttf")),
  readFile(join(process.cwd(), "public/images/lup-detay.jpg")),
]);
const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

const corners: React.CSSProperties[] = [
  { top: INSET, left: INSET, borderTopWidth: 1, borderLeftWidth: 1 },
  { top: INSET, right: INSET, borderTopWidth: 1, borderRightWidth: 1 },
  { bottom: INSET, left: INSET, borderBottomWidth: 1, borderLeftWidth: 1 },
  { bottom: INSET, right: INSET, borderBottomWidth: 1, borderRightWidth: 1 },
];

/**
 * Paylaşım görseli (§18): kâğıt zemin, ortada lup dairesi içinde `lup-detay.jpg`, altta
 * "SÖNMEZ — SİTEDE 10×. MAĞAZADA 1:1." Köşelerde levha kesim izleri. Derlemede bir kez üretilir.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: COLOR.paper,
        color: COLOR.graphite,
        fontFamily: "Geist Mono",
        position: "relative",
      }}
    >
      {corners.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: MARK,
            height: MARK,
            borderColor: COLOR.graphite,
            borderStyle: "solid",
            borderWidth: 0,
            ...c,
          }}
        />
      ))}

      {/* Lup: %25 graphite dış halka, 1px graphite iç kenar */}
      <div
        style={{
          display: "flex",
          width: LENS_D + 2 * RING,
          height: LENS_D + 2 * RING,
          borderRadius: "50%",
          border: `${RING}px solid ${COLOR.ring}`,
          marginTop: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            width: LENS_D,
            height: LENS_D,
            borderRadius: "50%",
            border: `1px solid ${COLOR.graphite}`,
            overflow: "hidden",
          }}
        >
          <img
            src={photoSrc}
            alt=""
            width={LENS_D}
            height={LENS_D}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <div style={{ marginTop: 48, fontSize: 26, letterSpacing: "0.06em" }}>{og.line}</div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Geist Mono", data: mono, weight: 500, style: "normal" }],
    },
  );
}
