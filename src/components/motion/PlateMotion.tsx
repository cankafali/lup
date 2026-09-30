"use client";

import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/scroll";
import { DURATION, EASE } from "@/lib/tokens";
import { $, $$, clearDraw, drawDimension, onDone, UNDRAWN } from "./helpers";
import { introReady, introSkipped } from "./intro";
import { useMotion } from "./useMotion";

const SHAPES = "path, circle, rect, line, polygon, polyline, ellipse";
// Başlangıç hali ölçümsüz yazılır (UNDRAWN); her tween kendi anında başlar ve DrawSVG okumalarını
// o karede toplu yapar: kurulumda şekil başına zorlanmış yerleşim yok (§17, K-096)
const DRAW = { ease: EASE.gsapDraw, immediateRender: false };

/** `data-draw` grubundaki (ya da kendisi işaretli) çizim öğeleri. */
function shapes(svg: Element, kind: string) {
  return $$<SVGElement>(svg, `[data-draw="${kind}"]`).flatMap((el) =>
    el.matches(SHAPES) ? [el] : $$<SVGElement>(el, SHAPES),
  );
}

type PlateParts = {
  axis: SVGElement[];
  outline: SVGElement[];
  detail: SVGElement[];
  dims: HTMLElement[];
  dot: HTMLElement | null;
  lens: HTMLElement | null;
  guide: SVGElement | null;
  notes: HTMLElement[];
};

/**
 * Çizilecek öğeleri toplar (yalnızca okuma). `box` verilirse (mobil pencere) yalnızca pencereyle
 * kesişenler: pencerenin dışındaki şekiller için yol uzunluğu ölçülmez (§17, K-096).
 * Tüm okumalar yazmalardan önce: DrawSVG her şekilde okuyup yazdığı için karışık sıra her
 * şekilde yeniden stil/yerleşim hesaplatıyordu.
 */
function collect(plate: Element, box: DOMRect | null): PlateParts | null {
  const svg = $(plate, "svg");
  if (!svg) return null;
  const inside = <T extends Element>(el: T) => {
    if (!box) return true;
    const r = el.getBoundingClientRect();
    return r.right > box.left && r.left < box.right && r.bottom > box.top && r.top < box.bottom;
  };
  const keep = <T extends Element>(el: T | null) => (el && inside(el) ? el : null);
  return {
    axis: shapes(svg, "axis").filter(inside),
    outline: shapes(svg, "outline").filter(inside),
    detail: shapes(svg, "detail").filter(inside),
    dims: $$(plate, "[data-dimension]").filter(inside),
    dot: keep($(plate, "[data-callout-dot]")),
    lens: keep($(plate, "[data-lens]")),
    guide: keep($<SVGElement>(svg, "[data-plate-guide]")),
    notes: $$(plate, "[data-plate-note], [data-plate-meta]").filter(inside),
  };
}

/** Levha çizimi (§11.2, toplam ≈ 1.8 s): eksenler → dış konturlar → iç detay → ölçüler → etiketler. */
function drawPlate(tl: gsap.core.Timeline, p: PlateParts) {
  gsap.set([...p.axis, ...p.outline, ...p.detail, p.guide].filter(Boolean), UNDRAWN);
  gsap.set([p.dot, p.lens, ...p.notes].filter(Boolean), { opacity: 0 });
  tl.fromTo(
    p.axis,
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: 0.35, stagger: 0.03, ...DRAW },
    0,
  )
    .fromTo(
      p.outline,
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 0.5, stagger: 0.05, ...DRAW },
      0.2,
    )
    .fromTo(
      p.detail,
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 0.35, stagger: { amount: 0.4 }, ...DRAW },
      0.6,
    );
  p.dims.forEach((d, i) => drawDimension(tl, d, 1.0 + i * 0.05, 0.35, 0.6, true));
  if (p.dot)
    tl.fromTo(
      p.dot,
      { scale: 0, opacity: 1 },
      { scale: 1, duration: DURATION.fast, ease: EASE.gsapLup, immediateRender: false },
      1.0,
    );
  if (p.lens)
    tl.fromTo(
      p.lens,
      { clipPath: "circle(0% at 50% 50%)", opacity: 1 },
      {
        clipPath: "circle(50% at 50% 50%)",
        duration: 0.5,
        ease: EASE.gsapLup,
        immediateRender: false,
      },
      1.05,
    );
  // Kılavuz: taştan lupa doğru
  if (p.guide)
    tl.fromTo(
      p.guide,
      { drawSVG: "100% 100%" },
      { drawSVG: "0% 100%", duration: 0.4, ...DRAW },
      1.15,
    );
  if (p.notes.length)
    tl.fromTo(
      p.notes,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "none", immediateRender: false },
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
 * Mobilde levha pencerelere bölünür (§15): açılışta ekrandaki pencere girişte, aşağıdakiler
 * ekrana girince çizilir (o zamana dek gizli). Sertifika gövdesi girişle birlikte.
 */
export function PlateMotion() {
  const anchor = useMotion((root) => {
    // Yedek devreye girdiyse (JS 4 sn'de gelmedi) levha çizili kalır
    if (introSkipped()) return;
    // Yalnızca görünen levhalar (mobilde masaüstü levhası, masaüstünde pencereler display:none)
    const plates = $$(root, "[data-plate]").filter((p) => p.getClientRects().length > 0);
    // İlk boyamada hazır gelen (data-intro-keep: mobil sertifika başlığı) açılmaz
    const certs = $$(root, "[data-certificate]").filter(
      (c) => c.getClientRects().length > 0 && !c.closest("[data-intro-keep]"),
    );
    const boxes = plates.map((p) => p.closest<HTMLElement>("[data-plate-window]"));
    const rects = boxes.map((box) => box?.getBoundingClientRect() ?? null);
    const now = rects.map((r) => !r || r.top < window.innerHeight);
    // Okumalar önce (collect), yazmalar sonra (drawPlate)
    const parts = plates.map((plate, i) => (now[i] ? collect(plate, rects[i] ?? null) : null));

    const tl = gsap.timeline({
      onComplete: () => {
        plates.forEach((plate, i) => now[i] && clearDraw(plate));
        certs.forEach((c) => gsap.set($$(c, "[style*='clip-path']"), { clearProps: "clipPath" }));
        onDone();
      },
    });
    parts.forEach((p) => p && drawPlate(tl, p));
    certs.forEach((cert) => revealCertificate(tl, cert, 0.4));

    plates.forEach((plate, i) => {
      const box = boxes[i];
      if (now[i] || !box) return;
      gsap.set(plate, { visibility: "hidden" });
      ScrollTrigger.create({
        trigger: box,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const p = collect(plate, box.getBoundingClientRect());
          if (!p) return;
          const t = gsap.timeline({
            onComplete: () => {
              clearDraw(plate);
              onDone();
            },
          });
          drawPlate(t, p);
          gsap.set(plate, { clearProps: "visibility" });
        },
      });
    });
    // Başlangıç durumları kuruldu: giriş gizlemesi kalkabilir (K-103)
    introReady();
  });

  return <span ref={anchor} hidden />;
}
