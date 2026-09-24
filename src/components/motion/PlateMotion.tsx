"use client";

import { gsap } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/tokens";
import { $, $$, clearDraw, drawDimension, onDone } from "./helpers";
import { useMotion } from "./useMotion";

const SHAPES = "path, circle, rect, line, polygon, polyline, ellipse";
const DRAW = { ease: EASE.gsapDraw, immediateRender: true };

/** `data-draw` grubundaki (ya da kendisi işaretli) çizim öğeleri. */
function shapes(svg: Element, kind: string) {
  return $$<SVGElement>(svg, `[data-draw="${kind}"]`).flatMap((el) =>
    el.matches(SHAPES) ? [el] : $$<SVGElement>(el, SHAPES),
  );
}

/** Levha çizimi (§11.2, toplam ≈ 1.8 s): eksenler → dış konturlar → iç detay → ölçüler → etiketler. */
function drawPlate(tl: gsap.core.Timeline, plate: Element) {
  const svg = $(plate, "svg");
  if (!svg) return;
  tl.fromTo(
    shapes(svg, "axis"),
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: 0.35, stagger: 0.03, ...DRAW },
    0,
  )
    .fromTo(
      shapes(svg, "outline"),
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 0.5, stagger: 0.05, ...DRAW },
      0.2,
    )
    .fromTo(
      shapes(svg, "detail"),
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 0.35, stagger: { amount: 0.4 }, ...DRAW },
      0.6,
    );
  $$(plate, "[data-dimension]").forEach((d, i) => drawDimension(tl, d, 1.0 + i * 0.05, 0.35, 0.6));

  const dot = $(plate, "[data-callout-dot]");
  const lens = $(plate, "[data-lens]");
  const guide = $(svg, "[data-plate-guide]");
  if (dot)
    tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: DURATION.fast, ease: EASE.gsapLup }, 1.0);
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
      { drawSVG: "0% 100%", duration: 0.4, ...DRAW },
      1.15,
    );
  tl.fromTo(
    $$(plate, "[data-plate-note], [data-plate-meta]"),
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: "none" },
    1.5,
  );
}

/** Sertifika (§11.3): satırlar sırayla soldan maskeyle (stagger 0.05), damgalar en sonda. */
function revealCertificate(tl: gsap.core.Timeline, cert: Element, at: number) {
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
    at,
  );
  const stamps = $$(cert, "[data-stamp]");
  if (stamps.length)
    tl.fromTo(
      stamps,
      { scale: 1.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: DURATION.fast, stagger: 0.08, ease: EASE.gsapStamp },
      at + lines.length * 0.05 + 0.3,
    );
}

/**
 * Ürün sayfası girişi: levha çizilir, sertifika levhadan 0.4 s sonra gelir.
 * Mobilde levha pencerelere, sertifika baş/gövde parçalarına bölünmüş olabilir (§15); hepsi aynı anda.
 */
export function PlateMotion() {
  const anchor = useMotion((root) => {
    const certs = $$(root, "[data-certificate]");
    const tl = gsap.timeline({
      onComplete: () => {
        clearDraw(root);
        certs.forEach((c) => gsap.set($$(c, "[style*='clip-path']"), { clearProps: "clipPath" }));
        onDone();
      },
    });
    $$(root, "[data-plate]").forEach((plate) => drawPlate(tl, plate));
    certs.forEach((cert) => revealCertificate(tl, cert, 0.4));
  });

  return <span ref={anchor} hidden />;
}
