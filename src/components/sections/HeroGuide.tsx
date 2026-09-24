"use client";

import { useEffect, useRef, useState } from "react";
import { coverPoint, type CoverFit, type Pt } from "@/lib/overlay";

type HeroGuideProps = {
  /** Hero fotoğrafının kırpma bilgisi (PhotoOverlay ile aynı). */
  fit: CoverFit;
  /** Taşın görsel pikselindeki merkezi. */
  stone: Pt;
};

type Line = { x1: number; y1: number; x2: number; y2: number };

/**
 * Örnek lupla taş arasındaki kılavuz çizgi (§10.1). Hero'ya göre konumlanan ayrı bir SVG:
 * taş ucu fotoğrafın kırpmasına göre hesaplanır, lup ucu lupun kenarındaki en yakın nokta.
 * Konumlar yalnızca boyut değişiminde okunur (ResizeObserver), karede değil.
 */
export function HeroGuide({ fit, stone }: HeroGuideProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [line, setLine] = useState<Line | null>(null);
  const { w, h, x, y } = fit;
  const [sx, sy] = stone;

  useEffect(() => {
    const hero = svgRef.current?.parentElement;
    const lens = hero?.querySelector<HTMLElement>("[data-hero-lens] [data-lens]");
    if (!hero || !lens) return;

    const measure = () => {
      const heroBox = hero.getBoundingClientRect();
      const lensBox = lens.getBoundingClientRect();
      if (lensBox.width === 0) return setLine(null); // lup gizli (< 1024)
      const s = coverPoint(heroBox.width, heroBox.height, { w, h, x, y }, sx, sy);
      const cx = lensBox.left - heroBox.left + lensBox.width / 2;
      const cy = lensBox.top - heroBox.top + lensBox.height / 2;
      const r = lensBox.width / 2;
      const d = Math.hypot(s.x - cx, s.y - cy) || 1;
      setLine({ x1: cx + ((s.x - cx) / d) * r, y1: cy + ((s.y - cy) / d) * r, x2: s.x, y2: s.y });
    };

    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    ro.observe(lens);
    return () => ro.disconnect();
  }, [w, h, x, y, sx, sy]);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden size-full text-graphite lg:block"
    >
      {line && (
        <line
          data-hero-guide
          {...line}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
