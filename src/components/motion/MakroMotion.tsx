"use client";

import { gsap } from "@/lib/gsap";
import {
  $,
  $$,
  drawCallout,
  drawDimension,
  onDone,
  sectionHeading,
  syncWithLoupe,
} from "./helpers";
import { useMotion } from "./useMotion";

/**
 * 10× (§10.3): masaüstü/tablette bölüm pin'lenir, scrub 0.6.
 * 0 → 0.35 lup büyür (görsel 1.25 → 1), 0.3 → 0.7 dört not (her biri 0.1), 0.7 → 0.85 çap ölçüsü,
 * 0.85 → 1 okuma süresi. Mobilde pin yok; notlar basit opacity.
 */
export function MakroMotion() {
  const anchor = useMotion((root, { desktop }) => {
    sectionHeading(root);

    const stage = $(root, "[data-makro-stage]");
    const lensWrap = $(root, "[data-makro-lens]");
    const img = lensWrap ? $(lensWrap, "img") : null;
    const notes = stage ? $$(stage, "[data-callout]") : [];
    const dim = stage ? $(stage, "[data-dimension]") : null;
    if (!stage || !lensWrap) return;

    if (!desktop) {
      gsap.fromTo(
        [...notes, dim].filter(Boolean),
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: stage, start: "top 70%", once: true },
          onComplete: onDone,
        },
      );
      return;
    }

    // Pin'li bölüm ve scrub'lı öğeler lupun kopyasında her karede aynalanır (K-066)
    syncWithLoupe(
      root,
      lensWrap,
      img,
      ...notes.flatMap((n) =>
        $$(n, "[data-callout-dot], [data-callout-line], [data-callout-label]"),
      ),
      ...(dim
        ? $$(dim, "[data-dim-line], [data-dim-ticks], [data-dim-extension], [data-dim-label]")
        : []),
    );

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, pin: true, start: "top top", end: "+=120%", scrub: 0.6 },
      defaults: { ease: "none" },
    });
    tl.fromTo(lensWrap, { scale: 0.35 }, { scale: 1, duration: 0.35 }, 0);
    if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 0.35 }, 0);
    notes.forEach((n, i) => drawCallout(tl, n, 0.3 + i * 0.1, 0.1));
    if (dim) drawDimension(tl, dim, 0.7, 0.1, 0.15);
    tl.to({}, { duration: 0.15 }, 0.85); // okuma süresi: çizelge 1'e uzar
  });

  return <span ref={anchor} hidden />;
}
