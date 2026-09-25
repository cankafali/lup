"use client";

import { useEffect, useRef, useState } from "react";
import { refreshLoupe } from "@/components/loupe/refresh";
import { MOTION, onDone } from "@/components/motion/helpers";
import { introTime } from "@/components/motion/intro";
import { gsap, useGSAP } from "@/lib/gsap";
// DrawSVG kaydı (bu bileşen motion/lazy paketinde)
import "@/lib/scroll";
import { coverPoint, type CoverFit, type Pt } from "@/lib/overlay";
import { DURATION, EASE } from "@/lib/tokens";

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

  // Çizgi ölçümden sonra çizilir; lupun kopyası da çizgiyi içersin (§9.5)
  useEffect(() => {
    if (line) refreshLoupe();
  }, [line]);

  // Hero girişi (§10.1 adım 5): 0.8 s'de taştan lupa doğru çizilir. Çizgi ölçüme bağlı olduğu
  // için girişin saatine göre gecikmeyle; bir kez.
  const drawn = useRef(false);
  useGSAP(
    () => {
      const el = svgRef.current?.querySelector("[data-hero-guide]");
      if (!line || !el || drawn.current) return;
      drawn.current = true;
      if (!window.matchMedia(MOTION).matches) return;
      gsap.fromTo(
        el,
        { drawSVG: "100% 100%" },
        {
          drawSVG: "0% 100%",
          duration: DURATION.base,
          delay: Math.max(0, 0.8 - introTime()),
          ease: EASE.gsapDraw,
          onComplete: () => {
            gsap.set(el, { clearProps: "strokeDasharray,strokeDashoffset" });
            onDone();
          },
        },
      );
    },
    { dependencies: [line] },
  );

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
