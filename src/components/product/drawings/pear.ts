import type { Pt } from "@/lib/overlay";
import { sampleCubic } from "./types";

function pearControls([cx, bottom]: Pt, length: number, width: number) {
  const r = width / 2;
  const cy = bottom - r;
  const tip = bottom - length;
  const shoulder = cy - r * 0.9;
  const neck = tip + length * 0.25;
  return { cx, cy, r, tip, shoulder, neck };
}

/**
 * Armut (damla) taş konturu: sivri uç yukarıda, alt kısım yarım daire.
 * `bottom` konturun en alt noktası; `length` uç–alt boyu, `width` en geniş yer (birim).
 */
export function pearPath(at: Pt, length: number, width: number) {
  const { cx, cy, r, tip, shoulder, neck } = pearControls(at, length, width);
  return [
    `M ${cx} ${tip}`,
    `C ${cx + r * 0.35} ${neck} ${cx + r} ${shoulder} ${cx + r} ${cy}`,
    `A ${r} ${r} 0 0 1 ${cx - r} ${cy}`,
    `C ${cx - r} ${shoulder} ${cx - r * 0.35} ${neck} ${cx} ${tip}`,
    "Z",
  ].join(" ");
}

/** Kontur üzerinde uçtan başlayıp saat yönünde 3 × `n` nokta (sağ yan, alt yay, sol yan). */
export function pearOutline(at: Pt, length: number, width: number, n = 32): Pt[] {
  const { cx, cy, r, tip, shoulder, neck } = pearControls(at, length, width);
  const right = sampleCubic([cx, tip], [cx + r * 0.35, neck], [cx + r, shoulder], [cx + r, cy], n);
  const arc = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Pt;
  });
  const left = sampleCubic([cx - r, cy], [cx - r, shoulder], [cx - r * 0.35, neck], [cx, tip], n);
  return [...right.slice(0, n), ...arc, ...left.slice(0, n)];
}

/** Armut taşın kapalı yuvası (çerçeve) kalınlığı (birim); ön ve yan görünüşlerde ortak. */
export const BEZEL = 3.2;
