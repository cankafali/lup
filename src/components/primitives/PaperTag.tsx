import clsx from "clsx";
import { MonoLabel } from "./MonoLabel";

type PaperTagProps = {
  children: React.ReactNode;
  size?: "s" | "m" | "l";
  /** Blok düzeyinde (konumlu bir etiket kutusunun içinde). */
  block?: boolean;
  className?: string;
};

/** Fotoğraf üstünde okunabilir kâğıt etiket (§8.6). Köşe ve gölge yok. */
export function PaperTag({ children, size = "m", block = false, className }: PaperTagProps) {
  return (
    <span
      className={clsx(
        "border border-graphite bg-paper px-2 py-1.5",
        block ? "block" : "inline-block",
        className,
      )}
    >
      <MonoLabel size={size} className="block">
        {children}
      </MonoLabel>
    </span>
  );
}
