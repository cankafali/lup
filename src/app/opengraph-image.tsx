import { ImageResponse } from "next/og";
import { og } from "@/content/copy";
import { OG_SIZE, ogCorners, OgLens, ogFonts, ogPhoto } from "@/lib/og";
import { COLOR } from "@/lib/tokens";

export const alt = og.alt;
export const size = OG_SIZE;
export const contentType = "image/png";

/**
 * Paylaşım görseli (§18): kâğıt zemin, ortada lup dairesi içinde `lup-detay.jpg`, altta
 * "SÖNMEZ — SİTEDE 10×. MAĞAZADA 1:1." Köşelerde levha kesim izleri. Derlemede bir kez üretilir.
 */
export default async function OpengraphImage() {
  const [fonts, photo] = await Promise.all([ogFonts(), ogPhoto("/images/lup-detay.jpg")]);
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
      {ogCorners()}
      <OgLens src={photo} style={{ marginTop: 12 }} />
      <div style={{ marginTop: 48, fontSize: 26, letterSpacing: "0.06em" }}>{og.line}</div>
    </div>,
    { ...size, fonts },
  );
}
