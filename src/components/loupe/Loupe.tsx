"use client";

import { useRef } from "react";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { LOUPE } from "@/lib/tokens";
import { useLoupe } from "./useLoupe";

/**
 * İmleç lupu (§9.1): iç Ø 200 (mobil 140), 1px graphite kenar, 16px %25 dış halka,
 * sağ üstte "10×", merkezde nişan. Görünüm durumları `data-state` (off / idle / active)
 * ve `globals.css`'teki `.loupe*` kurallarıyla.
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
      }}
    >
      <div ref={ring} className="loupe-ring" />
      <div className="loupe-glass">
        <div ref={stage} className="loupe-stage" />
      </div>
      <MonoLabel tone="stamp" className="loupe-label">
        {LOUPE.label}
      </MonoLabel>
    </div>
  );
}
