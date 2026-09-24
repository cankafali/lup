"use client";

import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/tokens";
import { $, onDone, sectionHeading } from "./helpers";
import { useMotion } from "./useMotion";

/**
 * Mağaza (§10.5): önce 10× görünür; 0.3 s sonra 10× hafifçe küçülür (1 → 0.92), 1:1 büyüyerek gelir
 * (0.92 → 1). Mesaj: odak mağazaya geçer.
 */
export function MagazaMotion() {
  const anchor = useMotion((root) => {
    sectionHeading(root);

    const block = $(root, "[data-compare-block]");
    const site = $(root, '[data-compare="site"]');
    const store = $(root, '[data-compare="store"]');
    if (!block || !site || !store) return;

    gsap.set([site, store], { transformOrigin: "0% 100%" });
    gsap
      .timeline({
        scrollTrigger: { trigger: block, start: "top 70%", once: true },
        defaults: { ease: EASE.gsapLup, duration: 0.9 },
        onComplete: onDone,
      })
      .fromTo(site, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" }, 0)
      .to(site, { scale: 0.92 }, 0.3)
      .fromTo(store, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1 }, 0.3);
  });

  return <span ref={anchor} hidden />;
}
