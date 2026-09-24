import Image from "next/image";
import clsx from "clsx";

type PhotoOverlayProps = {
  src: string;
  alt: string;
  /** Görselin piksel boyutu; bindirmelerin viewBox'ı budur. */
  width: number;
  height: number;
  /** object-position oranları (0–1). Duyarlı değişim için `--photo-x` / `--photo-y` sınıfla ezilebilir. */
  position?: readonly [number, number];
  sizes: string;
  /** LCP görseli: eager + fetchPriority high (Next 16'da `priority` kullanımdan kalktı). */
  priority?: boolean;
  /** Boyut verir (ör. `size-full`, `aspect-[…] w-full`). Kutu boyut konteyneri olduğundan içerikle büyümez;
   *  konumlandırma sınıfı verilmez (bileşen `relative`), gerekirse dıştan sarılır. */
  className?: string;
  /** Görselin piksel uzayındaki bindirmeler (DimensionLine, Callout… viewBox = [width, height]). */
  children?: React.ReactNode;
};

/**
 * Fotoğraf + fotoğrafa kilitli bindirme (§10 PhotoOverlay deseni).
 * Kapsayıcı bir boyut konteyneri; görselin `cover` ile ekranda kapladığı dikdörtgen
 * container query birimleriyle CSS'te hesaplanır ve bindirmeler bu kutuya yerleşir.
 * Böylece fotoğraf hangi oranda kırpılırsa kırpılsın çizgiler fotoğrafla birlikte kalır;
 * JS ya da layout okuması gerekmez (lup klonunda da aynı sonuç).
 */
export function PhotoOverlay({
  src,
  alt,
  width,
  height,
  position = [0.5, 0.5],
  sizes,
  priority = false,
  className,
  children,
}: PhotoOverlayProps) {
  const ratio = width / height;
  const frameW = `max(100cqw, 100cqh * ${ratio})`;
  const frameH = `max(100cqh, 100cqw / ${ratio})`;

  return (
    <div
      data-photo-overlay
      className={clsx("[container-type:size] relative overflow-hidden", className)}
      style={{ "--photo-x": position[0], "--photo-y": position[1] }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: "calc(var(--photo-x) * 100%) calc(var(--photo-y) * 100%)" }}
        data-hires={src}
        {...(priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
      />
      {children && (
        <div
          data-photo-frame
          className="pointer-events-none absolute"
          style={{
            width: frameW,
            height: frameH,
            left: `calc((100cqw - ${frameW}) * var(--photo-x))`,
            top: `calc((100cqh - ${frameH}) * var(--photo-y))`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
