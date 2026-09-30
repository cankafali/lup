import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { COLOR, LOUPE } from "@/lib/tokens";

// Paylaşım görsellerinin (§18) ortak parçaları: ana sayfa ve ürün sayfası. Derlemede üretilir.

export const OG_SIZE = { width: 1200, height: 630 };
/** Lup dairesi (iç çap) ve dış halka (px). */
export const LENS_D = 360;
const RING = LOUPE.ring;
/** Kesim izi (§7): 24px L, kenardan 32px içeride. */
const MARK = 24;
const INSET = 32;

/** Fontlar repoda (OFL, src/assets/fonts): geist paketinin iç yapısı değişirse derleme kırılmasın (inceleme 5.4). */
export async function ogFonts() {
  const [mono, sans] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/GeistMono-Medium.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/Geist-Medium.ttf")),
  ]);
  return [
    { name: "Geist Mono", data: mono, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: sans, weight: 500 as const, style: "normal" as const },
  ];
}

/**
 * `/images/…` JPEG'ini ImageResponse'un okuyacağı veri adresine çevirir. Klasör yolu sabit: yalnızca
 * `public/images` izlenir (değişken yol tüm projeyi izletirdi).
 */
export async function ogPhoto(src: string) {
  const file = await readFile(join(process.cwd(), "public/images", basename(src)));
  return `data:image/jpeg;base64,${file.toString("base64")}`;
}

const CORNERS: React.CSSProperties[] = [
  { top: INSET, left: INSET, borderTopWidth: 1, borderLeftWidth: 1 },
  { top: INSET, right: INSET, borderTopWidth: 1, borderRightWidth: 1 },
  { bottom: INSET, left: INSET, borderBottomWidth: 1, borderLeftWidth: 1 },
  { bottom: INSET, right: INSET, borderBottomWidth: 1, borderRightWidth: 1 },
];

/**
 * Levha kesim izleri (köşelerde). Kök öğenin doğrudan çocukları olmalı: ImageResponse bir bileşenin
 * döndürdüğü parçayı (fragment) mutlak konumlamıyor, bu yüzden dizi.
 */
export const ogCorners = () =>
  CORNERS.map((c, i) => (
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
  ));

/** Lup: %25 graphite dış halka, 1px graphite iç kenar, içinde fotoğraf. */
export function OgLens({
  src,
  objectPosition,
  style,
}: {
  src: string;
  objectPosition?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexShrink: 0,
        width: LENS_D + 2 * RING,
        height: LENS_D + 2 * RING,
        borderRadius: "50%",
        border: `${RING}px solid ${COLOR.ring}`,
        ...style,
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
          src={src}
          alt=""
          width={LENS_D}
          height={LENS_D}
          style={{ objectFit: "cover", objectPosition: objectPosition ?? "50% 50%" }}
        />
      </div>
    </div>
  );
}
