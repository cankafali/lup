import { ImageResponse } from "next/og";
import { certificate, og, productPage } from "@/content/copy";
import { getProduct, products } from "@/content/products";
import { OG_SIZE, ogCorners, OgLens, ogFonts, ogPhoto } from "@/lib/og";
import { COLOR } from "@/lib/tokens";

export const size = OG_SIZE;
export const contentType = "image/png";

// Sayfayla aynı: altı parça derlemede üretilir
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  return [
    { id: "paylasim", alt: product ? og.productAlt(product.name) : og.alt, size, contentType },
  ];
}

/**
 * Ürün paylaşım görseli (inceleme 6): solda lup dairesinde parçanın fotoğrafı; sağda levha no,
 * ad, sertifika no ve ayar damgası, veri satırı. Asıl trafik kanalı WhatsApp: link önizlemesi.
 */
export default async function ProductOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) throw new Error("OG: parça yok");
  const [fonts, photo] = await Promise.all([ogFonts(), ogPhoto(product.image.src)]);
  const mono = { fontSize: 22, letterSpacing: "0.06em" } as const;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 112px",
        background: COLOR.paper,
        color: COLOR.graphite,
        fontFamily: "Geist Mono",
        position: "relative",
      }}
    >
      {ogCorners()}
      <OgLens src={photo} objectPosition={product.image.objectPosition} />
      <div style={{ display: "flex", flexDirection: "column", marginLeft: 72 }}>
        <div style={{ ...mono, color: COLOR.lead }}>
          {productPage.plate(product.no, products.length)}
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: "Geist",
            fontSize: 88,
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          {product.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 32 }}>
          <div style={mono}>{`${certificate.title} · ${certificate.no(product.certNo)}`}</div>
          {/* Ayar damgası: kırmızı 1px çerçeve (§8.6) */}
          <div
            style={{
              ...mono,
              marginLeft: 20,
              padding: "4px 10px",
              color: COLOR.stamp,
              border: `1px solid ${COLOR.stamp}`,
            }}
          >
            {product.karat.hallmark}
          </div>
        </div>
        <div style={{ ...mono, marginTop: 14, color: COLOR.lead }}>{product.dataLine}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 64,
          display: "flex",
          justifyContent: "center",
          fontSize: 18,
          letterSpacing: "0.06em",
        }}
      >
        {og.line}
      </div>
    </div>,
    { ...size, fonts },
  );
}
