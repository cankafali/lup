"use client";

import { gsap } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/tokens";
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

/** Scrub'lı ölçü parçaları (lup aynalaması için). */
const dimParts = (dim: Element | null) =>
  dim ? $$(dim, "[data-dim-line], [data-dim-ticks], [data-dim-extension], [data-dim-label]") : [];

/**
 * 10× (§10.3, §15). ≥ 1024: tuval pin'lenir, scrub 0.6 — 0 → 0.35 lup büyür (görsel 1.25 → 1),
 * 0.3 → 0.7 dört not (her biri 0.1), 0.7 → 0.85 çap ölçüsü, 0.85 → 1 okuma süresi.
 * Tablet (768–1023): dikey düzen aynı sırayla pin'lenir. Mobil: pin yok; notlar basit opacity.
 */
export function MakroMotion() {
  const anchor = useMotion((root, { desktop, wide }) => {
    sectionHeading(root);

    if (wide) {
      const stage = $(root, "[data-makro-stage]");
      const lensWrap = $(root, "[data-makro-lens]");
      if (!stage || !lensWrap) return;
      const img = $(lensWrap, "img");
      const notes = $$(stage, "[data-callout]");
      const dim = $(stage, "[data-dimension]");

      // Pin'li bölüm ve scrub'lı öğeler lupun kopyasında her karede aynalanır (K-066)
      syncWithLoupe(
        root,
        lensWrap,
        img,
        ...notes.flatMap((n) =>
          $$(n, "[data-callout-dot], [data-callout-line], [data-callout-label]"),
        ),
        ...dimParts(dim),
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
      return;
    }

    // < 1024: dikey düzen
    const stack = $(root, "[data-makro-stack]");
    const lens = stack ? $(stack, "[data-makro-stack-lens]") : null;
    if (!stack || !lens) return;
    const img = $(lens, "img");
    const dots = $$(stack, "[data-makro-dot]");
    const items = $$(stack, "[data-makro-note]");
    const dim = $(stack, "[data-dimension]");

    if (!desktop) {
      // Mobil: pin yok; noktalar ve notlar görünür olunca sırayla belirir
      gsap.fromTo(
        [...dots, ...items, dim].filter(Boolean),
        { opacity: 0 },
        {
          opacity: 1,
          duration: DURATION.base,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: lens, start: "top 70%", once: true },
          onComplete: onDone,
        },
      );
      return;
    }

    // Tablet: dikey düzen pin'lenir (lup en çok 560px)
    syncWithLoupe(stack, lens, img, ...dots, ...items, ...dimParts(dim));
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stack,
        pin: true,
        start: "center center",
        end: "+=100%",
        scrub: 0.6,
      },
      defaults: { ease: "none" },
    });
    tl.fromTo(lens, { scale: 0.35 }, { scale: 1, duration: 0.35 }, 0);
    if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 0.35 }, 0);
    dots.forEach((d, i) => {
      tl.fromTo(d, { scale: 0 }, { scale: 1, duration: 0.03, ease: EASE.gsapLup }, 0.3 + i * 0.1);
      if (items[i])
        tl.fromTo(items[i], { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.33 + i * 0.1);
    });
    if (dim) drawDimension(tl, dim, 0.7, 0.1, 0.15);
    tl.to({}, { duration: 0.15 }, 0.85);
  });

  return <span ref={anchor} hidden />;
}
