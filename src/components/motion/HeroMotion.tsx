"use client";

import { gsap } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/tokens";
import { $, $$, clearDraw, drawCallout, drawDimension, onDone, syncWithLoupe } from "./helpers";
import { introReady, introSkipped, introTime } from "./intro";
import { useMotion } from "./useMotion";

/**
 * Hero girişi (§10.1, toplam ≈ 1.6 s) ve çıkış parallax'ı. Kılavuz çizgi `HeroGuide`'da,
 * aynı giriş saatine göre (0.8 s) çizilir.
 */
export function HeroMotion() {
  const anchor = useMotion((root) => {
    const photo = $(root, "[data-hero-photo]");
    const layer = $(root, "[data-hero-lens-layer]");
    const stone = $(root, '[data-callout="stone"] [data-callout-dot]');
    const lens = $(root, "[data-hero-lens] [data-lens]");
    const caption = $(root, "[data-hero-caption]");
    const axis = $(root, "[data-hero-photo] [data-axis]");
    const band = $(root, '[data-callout="band"]');
    const mark = $(root, "[data-hero-mark]");
    const dims = $$(root, "[data-hero-photo] [data-dimension]");
    const meta = $(root, "[data-hero-meta]");

    // Yedek devreye girdiyse (JS 4 sn'de gelmedi) giriş yok: yalnızca parallax
    if (!introSkipped()) {
      introTime(); // girişin saati burada başlar
      const tl = gsap.timeline({
        defaults: { ease: EASE.gsapLup },
        onComplete: () => {
          clearDraw(root);
          onDone();
        },
      });

      // 1. 0.0 — fotoğraf: CSS ile ilk boyamada girer (globals.css `intro-photo`, K-095)
      // 2–3. 0.3 / 0.45 — "Yakından", "bakın." harf maskesiyle: CSS (K-095)
      // 4. 0.7 — taş işareti
      tl.fromTo(stone, { scale: 0 }, { scale: 1, duration: DURATION.fast }, 0.7);
      // 5. 0.8 — kılavuz çizgi: HeroGuide
      // 6. 1.2 — lup dairesi
      tl.fromTo(
        lens,
        { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(50% at 50% 50%)", duration: DURATION.base },
        1.2,
      );
      tl.fromTo(caption, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" }, 1.3);
      // 7. 1.2 — ölçü okları, eksen, bant notu
      dims.forEach((d) => drawDimension(tl, d, 1.2));
      tl.fromTo(
        axis,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: DURATION.base, ease: EASE.gsapDraw, immediateRender: true },
        1.2,
      );
      if (band) drawCallout(tl, band, 1.3);
      tl.fromTo(mark, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "none" }, 1.3);
      // 8. 1.4 — koordinat satırı (sağ alt metin CSS ile, K-095)
      tl.fromTo(meta, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" }, 1.4);
    }

    // Çıkış: fotoğraf (ve ona kilitli lup katmanı) parallax; başlık normal akar (§10.1)
    syncWithLoupe(photo, layer);
    gsap.to([photo, layer], {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
    });
    // Başlangıç durumları kuruldu: giriş gizlemesi kalkabilir (K-103)
    introReady();
  });

  return <span ref={anchor} hidden />;
}
