"use client";

import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/scroll";
import { DURATION, EASE } from "@/lib/tokens";
import { useMotion } from "./useMotion";

/**
 * Nav (§8.9): sayfa başında durur; aşağı kayarken gizlenir, yukarı kayarken geri gelir.
 * Yalnızca transform (yPercent). Reduced motion'da sabit, hep görünür.
 */
export function NavMotion() {
  const anchor = useMotion((header) => {
    let hidden = false;
    const show = (visible: boolean) => {
      if (visible === !hidden) return;
      hidden = !visible;
      gsap.to(header, {
        yPercent: visible ? 0 : -100,
        duration: DURATION.base,
        ease: EASE.gsapLup,
        overwrite: true,
      });
    };
    const height = header.offsetHeight;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => show(self.scroll() < height || self.direction < 0),
    });
  });

  return <span ref={anchor} hidden />;
}
