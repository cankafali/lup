"use client";

import { useRef } from "react";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { LOUPE } from "@/lib/tokens";
import { useLoupe } from "./useLoupe";

/**
 * Lup (§9.1): iç Ø 200 (mobil 140), 1px graphite kenar, 16px %25 dış halka,
 * sağ üstte "10×", merkezde nişan. Görünüm durumları `data-state` (off / idle / active)
 * ve `globals.css`'teki `.loupe*` kurallarıyla. Fareyle basılı tutarken dış halkada dolan yay (K-105).
 */
export function Loupe() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useLoupe({ root, ring, stage });

  return (
    <div
      ref={root}
      aria-hidden
      data-loupe
      data-state="off"
      data-mode="mouse"
      className="loupe"
      style={{
        "--loupe-d": `${LOUPE.diameter}px`,
        "--loupe-ring": `${LOUPE.ring}px`,
        "--loupe-ring-opacity": LOUPE.ringOpacity,
        "--loupe-cross": `${LOUPE.crosshair}px`,
        "--loupe-hold": `${LOUPE.mouseHoldMs}ms`,
      }}
    >
      <div ref={ring} className="loupe-ring" />
      {/* viewBox yok: birim px, çizgi 1px kalır (non-scaling-stroke pathLength ile tutarsız) */}
      <svg className="loupe-progress">
        <circle cx="50%" cy="50%" r="49.5%" pathLength={1} />
      </svg>
      <div className="loupe-glass">
        <div ref={stage} className="loupe-stage" />
      </div>
      <MonoLabel tone="stamp" className="loupe-label">
        {LOUPE.label}
      </MonoLabel>
    </div>
  );
}
