"use client";

import { useRef } from "react";
import { MOTION, syncWithLoupe } from "@/components/motion/helpers";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Durum noktası (§10.5, §11.3): graphite Ø6; `active` iken yavaş nabız
 * (opacity 1 → 0.35, 1.6 s, sine.inOut, yoyo). Reduced motion'da sabit.
 */
export function PulseDot({ active = true }: { active?: boolean }) {
  const dot = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!active || !dot.current) return;
      syncWithLoupe(dot.current);
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.to(dot.current, {
          opacity: 0.35,
          duration: 1.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
      return () => mm.revert();
    },
    { dependencies: [active] },
  );

  return (
    <span
      ref={dot}
      aria-hidden
      data-status-dot
      data-open={active || undefined}
      className="size-1.5 shrink-0 rounded-full bg-graphite"
    />
  );
}
