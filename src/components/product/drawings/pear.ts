import type { Pt } from "@/lib/overlay";

/**
 * Armut (damla) taş konturu: sivri uç yukarıda, alt kısım yarım daire.
 * `bottom` konturun en alt noktası; `length` uç–alt boyu, `width` en geniş yer (birim).
 */
export function pearPath([cx, bottom]: Pt, length: number, width: number) {
  const r = width / 2;
  const cy = bottom - r;
  const tip = bottom - length;
  const shoulder = cy - r * 0.9;
  const neck = tip + length * 0.25;
  return [
    `M ${cx} ${tip}`,
    `C ${cx + r * 0.35} ${neck} ${cx + r} ${shoulder} ${cx + r} ${cy}`,
    `A ${r} ${r} 0 0 1 ${cx - r} ${cy}`,
    `C ${cx - r} ${shoulder} ${cx - r * 0.35} ${neck} ${cx} ${tip}`,
    "Z",
  ].join(" ");
}
