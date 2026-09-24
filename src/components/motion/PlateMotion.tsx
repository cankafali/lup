"use client";

import { gsap } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/tokens";
import { $, $$, clearDraw, drawDimension, onDone } from "./helpers";
import { useMotion } from "./useMotion";

const SHAPES = "path, circle, rect, line, polygon, polyline, ellipse";

/** `data-draw` grubundaki (ya da kendisi işaretli) çizim öğeleri. */
function shapes(svg: Element, kind: string) {
  return $$<SVGElement>(svg, `[data-draw="${kind}"]`).flatMap((el) =>
    el.matches(SHAPES) ? [el] : $$<SVGElement>(el, SHAPES),
  );
}

/**
 * Ürün sayfası girişi. Levha (§11.2, toplam ≈ 1.8 s): eksenler → dış konturlar → iç detay →
 * ölçüler → etiketler, dashoffset + power2.inOut. Sertifika (§11.3) levhadan 0.4 s sonra:
 * satırlar sırayla soldan maskeyle (stagger 0.05), damgalar en sonda "damga vurma" (back.out(2)).
 */
export function PlateMotion() {
  const anchor = useMotion((root) => {
    const plate = $(root, "[data-plate]");
    const svg = plate ? $(plate, "svg") : null;
    const cert = $(root, "[data-certificate]");
    const draw = { ease: EASE.gsapDraw, immediateRender: true };

    const tl = gsap.timeline({
      onComplete: () => {
        clearDraw(root);
        if (cert) gsap.set($$(cert, "[style*='clip-path']"), { clearProps: "clipPath" });
        onDone();
      },
    });

    if (plate && svg) {
      tl.fromTo(
        shapes(svg, "axis"),
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 0.35, stagger: 0.03, ...draw },
        0,
      )
        .fromTo(
          shapes(svg, "outline"),
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.5, stagger: 0.05, ...draw },
          0.2,
        )
        .fromTo(
          shapes(svg, "detail"),
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.35, stagger: { amount: 0.4 }, ...draw },
          0.6,
        );
      $$(plate, "[data-dimension]").forEach((d, i) =>
        drawDimension(tl, d, 1.0 + i * 0.05, 0.35, 0.6),
      );

      const dot = $(plate, "[data-callout-dot]");
      const lens = $(plate, "[data-lens]");
      const guide = $(svg, "[data-plate-guide]");
      if (dot)
        tl.fromTo(
          dot,
          { scale: 0 },
          { scale: 1, duration: DURATION.fast, ease: EASE.gsapLup },
          1.0,
        );
      if (lens)
        tl.fromTo(
          lens,
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(50% at 50% 50%)", duration: 0.5, ease: EASE.gsapLup },
          1.05,
        );
      // Kılavuz: taştan lupa doğru
      if (guide)
        tl.fromTo(
          guide,
          { drawSVG: "100% 100%" },
          { drawSVG: "0% 100%", duration: 0.4, ...draw },
          1.15,
        );
      tl.fromTo(
        $$(plate, "[data-plate-note], [data-plate-meta]"),
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "none" },
        1.5,
      );
    }

    if (cert) {
      // Satırlar: sertifikanın doğrudan çocukları, özellik listesi satır satır
      const lines = Array.from(cert.children).flatMap((el) =>
        el.tagName === "DL" ? $$(el, "[data-cert-row]") : [el as HTMLElement],
      );
      tl.fromTo(
        lines,
        { clipPath: "inset(-20% 100% -20% 0%)" },
        {
          clipPath: "inset(-20% 0% -20% 0%)",
          duration: DURATION.base,
          stagger: 0.05,
          ease: EASE.gsapLup,
        },
        0.4,
      );
      tl.fromTo(
        $$(cert, "[data-stamp]"),
        { scale: 1.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: DURATION.fast, stagger: 0.08, ease: EASE.gsapStamp },
        ">-0.1",
      );
    }
  });

  return <span ref={anchor} hidden />;
}
