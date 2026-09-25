"use client";

import { refreshLoupe } from "@/components/loupe/useLoupe";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/tokens";

/** Animasyonlar yalnızca bu koşulda (§14.2); aksi halde içerik son halinde kalır. */
export const MOTION = "(prefers-reduced-motion: no-preference)";
/** 10× pin'i ve ağır sahneler (§14.2: mobilde pin yok). */
export const DESKTOP = "(min-width: 768px)";
/** Masaüstü düzeni (10× tuvali, hero lupu). */
export const WIDE = "(min-width: 1024px)";

/** Animasyon bitince lupun kopyası son hali göstersin (§9.5). */
export const onDone = () => refreshLoupe();

/** Kaydırmaya bağlı (scrub/pin) öğeler lupun kopyasında her karede aynalanır. */
export function syncWithLoupe(...els: (Element | null | undefined)[]) {
  els.forEach((el) => {
    if (el instanceof HTMLElement || el instanceof SVGElement) el.dataset.loupeSync = "";
  });
}

export const $ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  root.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  Array.from(root.querySelectorAll<T>(sel));

type At = gsap.Position;

/**
 * Ölçmeden gizlenmiş çizgi: DrawSVG'nin "0%" hali gibi görünmez, ama yol uzunluğu ve ekran
 * dönüşümü okunmaz (non-scaling-stroke'ta her şekil için zorlanmış yerleşim demekti, K-096).
 */
export const UNDRAWN = { strokeDasharray: "0 100000" };

/**
 * Ölçü oku çizimi (§8.3): çizgi dashoffset ile çizilir, çentikler (ve uzatma çizgileri)
 * çizgi bitince 120 ms'de belirir, etiket 80 ms sonra gelir.
 * `lazy`: başlangıç hali ölçümsüz yazılır, çizim kendi anında başlar (çok sayıda ölçü: levha).
 */
export function drawDimension(
  tl: gsap.core.Timeline,
  dim: Element,
  at: At = 0,
  duration: number = DURATION.base,
  /** Çentik ve etiket sürelerinin çarpanı (scrub zaman çizelgesinde küçülür). */
  k = 1,
  lazy = false,
) {
  const line = $(dim, "[data-dim-line]");
  const marks = $$(dim, "[data-dim-ticks], [data-dim-extension]");
  const label = $(dim, "[data-dim-label]");
  const immediateRender = !lazy;
  if (lazy) {
    if (line) gsap.set(line, UNDRAWN);
    gsap.set([...marks, label].filter(Boolean), { opacity: 0 });
  }
  if (line)
    tl.fromTo(
      line,
      { drawSVG: "0%" },
      { drawSVG: "100%", duration, ease: EASE.gsapDraw, immediateRender },
      at,
    );
  if (marks.length)
    tl.fromTo(
      marks,
      { opacity: 0 },
      { opacity: 1, duration: 0.12 * k, ease: "none", immediateRender },
      ">",
    );
  if (label)
    tl.fromTo(
      label,
      { opacity: 0 },
      { opacity: 1, duration: 0.24 * k, ease: "none", immediateRender },
      `<${0.08 * k}`,
    );
}

/** Tek seferlik girişler bitince çizim stillerini temizle (sonraki boyut değişimlerinde çizgi kısalmasın). */
export function clearDraw(root: ParentNode) {
  gsap.set($$(root, "[style*='stroke-dash']"), { clearProps: "strokeDasharray,strokeDashoffset" });
}

/** Not (Callout): nokta belirir → kılavuz çizgi çizilir → etiket gelir. */
export function drawCallout(tl: gsap.core.Timeline, callout: Element, at: At = 0, scale = 1) {
  const dot = $(callout, "[data-callout-dot]");
  const line = $(callout, "[data-callout-line]");
  const label = $(callout, "[data-callout-label]");
  if (dot)
    tl.fromTo(
      dot,
      { scale: 0 },
      { scale: 1, duration: DURATION.fast * scale, ease: EASE.gsapLup },
      at,
    );
  if (line)
    tl.fromTo(
      line,
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 0.4 * scale, ease: EASE.gsapDraw, immediateRender: true },
      dot ? ">-0.05" : at,
    );
  if (label)
    tl.fromTo(label, { opacity: 0 }, { opacity: 1, duration: 0.3 * scale, ease: "none" }, ">-0.1");
}

/**
 * Bölüm etiketi + başlık girişi (§14.3): başlık görünür olunca (`top 80%`), etiket başlıktan
 * 0.1 s önce 0.4 s'de belirir; satırlar maskeyle, stagger 0.12. Bir kez.
 */
export function sectionHeading(root: ParentNode) {
  const label = $(root, "[data-anim-label]");
  const heading = $(root, "h2");
  const trigger = heading ?? label;
  if (!trigger) return;
  const tl = gsap.timeline({
    scrollTrigger: { trigger, start: "top 80%", once: true },
    onComplete: onDone,
  });
  if (label) tl.fromTo(label, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" }, 0);
  if (heading && heading !== label) revealHeadline(tl, heading, 0.1);
}

/**
 * Başlık satır maskesi (§14.3): her satır `yPercent 100 → 0`. Maske alt kenarı satır kutusunda
 * başlar ve satırla birlikte aşağı açılır (alt uzantılar sonunda kesilmesin); bitince temizlenir.
 */
export function revealHeadline(
  tl: gsap.core.Timeline,
  heading: Element,
  at: At = 0,
  stagger = 0.12,
  duration = 0.9,
) {
  const masks = $$(heading, "[data-headline-mask]");
  const lines = $$(heading, "[data-headline-line]");
  if (!lines.length) return;
  tl.fromTo(
    masks,
    { clipPath: "inset(-60% -10% 0% -10%)" },
    { clipPath: "inset(-60% -10% -40% -10%)", duration, stagger, ease: EASE.gsapLup },
    at,
  )
    .fromTo(lines, { yPercent: 100 }, { yPercent: 0, duration, stagger, ease: EASE.gsapLup }, "<")
    .set(masks, { clearProps: "clipPath" })
    .set(lines, { clearProps: "transform" });
}
