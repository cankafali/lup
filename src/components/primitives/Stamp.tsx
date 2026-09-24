import clsx from "clsx";

type StampProps = {
  /** "750", "18K", "22 AYAR", "USTA · M.S." */
  children: string;
  /** square = ayar, oval = usta/seri */
  shape?: "square" | "oval";
  /** s: 10px metin, m: 12px metin */
  size?: "s" | "m";
  tone?: "stamp" | "graphite";
  /** Açının türetildiği kimlik; verilmezse metin kullanılır. */
  seed?: string;
  /** Sabit açı (derece); verilirse türetilen açının yerine geçer. */
  rotate?: number;
  className?: string;
};

/** Kimlikten −1.5° … +1.5° arası deterministik açı (SSR ve CSR'da aynı). */
export function stampRotation(seed: string) {
  let h = 0;
  for (const ch of seed) h = (Math.imul(h, 31) + (ch.codePointAt(0) ?? 0)) | 0;
  return ((((h % 31) + 31) % 31) - 15) / 10;
}

/** Ayar damgası (§8.1). Süs değildir; her damga bir bilgi taşır. */
export function Stamp({
  children,
  shape = "square",
  size = "s",
  tone = "stamp",
  seed,
  rotate,
  className,
}: StampProps) {
  const deg = rotate ?? stampRotation(seed ?? children);
  return (
    <span
      data-stamp
      className={clsx(
        "inline-block [transform:rotate(var(--stamp-rot))] border font-mono whitespace-nowrap uppercase",
        shape === "oval" ? "rounded-full px-[10px] py-[3px]" : "px-[6px] py-[3px]",
        size === "m" ? "text-mono-l" : "text-mono",
        tone === "stamp" ? "border-stamp text-stamp" : "border-graphite text-graphite",
        className,
      )}
      style={{ "--stamp-rot": `${deg}deg` }}
    >
      {children}
    </span>
  );
}
