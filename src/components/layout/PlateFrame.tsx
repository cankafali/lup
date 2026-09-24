import clsx from "clsx";
import { plate as plateCopy } from "@/content/copy";
import { MonoLabel } from "@/components/primitives/MonoLabel";

type PlateFrameProps = {
  children: React.ReactNode;
  /** Levha numarası (1'den başlar). */
  plate: number;
  total?: number;
  id?: string;
  labelledBy?: string;
  /** Üstteki 1px bölüm çizgisi ve levha no (hero'da Nav satırı üstlenir). */
  header?: boolean;
  /** Yükleme animasyonu olan bölge: JS gelene kadar CSS ile gizli (`data-intro`, K-064). */
  intro?: boolean;
  className?: string;
};

const CORNERS = [
  "top-6 left-6 border-t border-l",
  "top-6 right-6 border-t border-r",
  "bottom-6 left-6 border-b border-l",
  "bottom-6 right-6 border-b border-r",
] as const;

/**
 * Levha (§7): dört köşede kesim izi (16px L, köşeden 24px içeride),
 * üstte bölüm çizgisi ve sağ üstte levha numarası. Çizgi ve no bölümün dolgusundan
 * bağımsız olarak en üstte durur; kesim izleri içeriğin (fotoğrafların) üstünde kalır.
 */
export function PlateFrame({
  children,
  plate,
  total = plateCopy.total,
  id,
  labelledBy,
  header = true,
  intro = false,
  className,
}: PlateFrameProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-intro={intro || undefined}
      className={clsx("relative", className)}
    >
      {header && (
        <div className="absolute inset-x-0 top-0">
          <div className="container-lup">
            <div className="relative border-t border-line-strong">
              <MonoLabel size="s" tone="lead" className="absolute top-6 right-0">
                {plateCopy.label(plate, total)}
              </MonoLabel>
            </div>
          </div>
        </div>
      )}
      {children}
      {CORNERS.map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={clsx("pointer-events-none absolute size-4 border-graphite", pos)}
        />
      ))}
    </section>
  );
}
