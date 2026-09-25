"use client";

import { gsap } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/tokens";
import { $, $$, clearDraw, drawDimension, onDone, sectionHeading } from "./helpers";
import { useMotion } from "./useMotion";

/**
 * Vitrin (§10.2, §14.3): başlık; tepsi görünür olunca (`top 75%`) hücreler soldan sağa,
 * üstten alta alttan açılır (stagger 0.08), ardından ölçü okları çizilir. Hover'da ölçü yeniden çizilir.
 */
export function VitrinMotion() {
  const anchor = useMotion(
    (root) => {
      sectionHeading(root);

      const tray = $(root, "[data-tray]");
      if (!tray) return;
      const cells = $$(tray, "[data-loupe-magnify]");
      let entered = false;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: tray, start: "top 75%", once: true },
        onComplete: () => {
          gsap.set(cells, { clearProps: "clipPath" });
          clearDraw(tray);
          entered = true;
          onDone();
        },
      });
      tl.fromTo(
        cells,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, stagger: 0.08, ease: EASE.gsapLup },
        0,
      );
      cells.forEach((cell, i) => {
        const dim = $(cell, "[data-dimension]");
        if (dim) drawDimension(tl, dim, 0.6 + i * 0.08);
      });

      // Hover: ölçü çizgisi yeniden çizilir (0.6 s). Fotoğraf büyümez (lup zaten büyütüyor).
      const redraw = (e: Event) => {
        const line = entered ? $(e.currentTarget as Element, "[data-dim-line]") : null;
        if (!line) return;
        gsap.fromTo(
          line,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: DURATION.base,
            ease: EASE.gsapDraw,
            overwrite: true,
            onComplete: () => gsap.set(line, { clearProps: "strokeDasharray,strokeDashoffset" }),
          },
        );
      };
      cells.forEach((c) => c.addEventListener("mouseenter", redraw));
      return () => cells.forEach((c) => c.removeEventListener("mouseenter", redraw));
    },
    { defer: true },
  );

  return <span ref={anchor} hidden />;
}
