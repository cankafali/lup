"use client";

import { gsap } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/tokens";
import { $, $$, clearDraw, drawCallout, onDone, sectionHeading, syncWithLoupe } from "./helpers";
import { useMotion } from "./useMotion";

/**
 * Atölye (§10.4): başlık; fotoğraf soldan sağa açılır (`top 70%`, 0.9 s), ardından notlar sırayla;
 * fotoğraf içinde hafif parallax (scrub). İstatistikler sayarak gelir (1 için sayma yok).
 */
export function AtolyeMotion() {
  const anchor = useMotion(
    (root) => {
      sectionHeading(root);

      const photo = $(root, "[data-atolye-photo]");
      if (photo) {
        const notes = $$(photo, "[data-callout]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: photo, start: "top 70%", once: true },
          onComplete: () => {
            gsap.set(photo, { clearProps: "clipPath" });
            clearDraw(photo);
            onDone();
          },
        });
        tl.fromTo(
          photo,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: EASE.gsapLup },
          0,
        );
        notes.forEach((n, i) => drawCallout(tl, n, 0.7 + i * 0.2));

        // Fotoğraf içi parallax: görsel + bindirme birlikte, kenar açılmasın diye %12 büyük
        const inner = $(photo, "[data-photo-inner]");
        if (inner) {
          syncWithLoupe(inner);
          gsap.fromTo(
            inner,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              scale: 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: photo,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      }

      // İstatistikler: 0 → hedef (1.2 s, expo.out), tabular-nums
      $$(root, "[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const scrollTrigger = { trigger: el, start: "top 80%", once: true };
        if (target <= 1) {
          gsap.fromTo(
            el,
            { opacity: 0 },
            {
              opacity: 1,
              duration: DURATION.base,
              ease: "none",
              scrollTrigger,
              onComplete: onDone,
            },
          );
          return;
        }
        const counter = { n: 0 };
        el.textContent = "0";
        gsap.to(counter, {
          n: target,
          duration: DURATION.slow,
          ease: EASE.gsapLup,
          scrollTrigger,
          onUpdate: () => {
            el.textContent = String(Math.round(counter.n));
          },
          onComplete: onDone,
        });
      });
    },
    { defer: true },
  );

  return <span ref={anchor} hidden />;
}
