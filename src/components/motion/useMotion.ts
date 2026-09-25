"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DESKTOP, MOTION, WIDE } from "./helpers";

/** desktop: ≥ 768 (tablet dahil) · wide: ≥ 1024 */
type Conditions = { motion: boolean; desktop: boolean; wide: boolean };
type Setup = (root: HTMLElement, conditions: Conditions) => void | (() => void);
type Options = {
  /** Açılışta ekranın altında kalan bölüm: ilk yüklemede boşta kurulur. */
  defer?: boolean;
};

/** Tarayıcı boşta kalınca (Safari'de requestIdleCallback yok). */
function whenIdle(fn: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fn, { timeout: 1000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 1);
  return () => window.clearTimeout(id);
}

/**
 * Bölüm animasyonu: bileşen kendi bölümüne boş bir çapa (`<span hidden>`) koyar; çapanın ebeveyni
 * kapsamdır. `gsap.matchMedia` ile yalnızca hareket izni varken kurulur (§14.2); useGSAP söküm yapar.
 * `defer`: açılışta ekranın altında kalan bölümler boşta kurulur; kurulumları (ScrollTrigger
 * ölçümleri, başlangıç durumları) ilk yüklemenin uzun görevine eklenmez (§17, K-096).
 * Konum ölçülmez (her ölçüm önceki bölümün yazdıklarından sonra tam yerleşim zorlar).
 */
export function useMotion(setup: Setup, { defer = false }: Options = {}) {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.parentElement;
    if (!root) return;
    let mm: gsap.MatchMedia | null = null;
    const run = () => {
      mm = gsap.matchMedia();
      mm.add({ motion: MOTION, desktop: DESKTOP, wide: WIDE }, (ctx) => {
        const conditions = ctx.conditions as Conditions;
        if (!conditions.motion) return;
        return setup(root, conditions);
      });
    };
    // Yalnızca ilk yüklemede ve çapasız adreste: sayfa içi gezinmede (ör. /#vitrin) bölüm hemen
    // görünür olabilir; kurulum gecikirse içerik bir an görünüp gizlenirdi
    const later = defer && document.readyState !== "complete" && !location.hash;
    const cancel = later ? whenIdle(run) : (run(), undefined);
    return () => {
      cancel?.();
      mm?.revert();
    };
  });

  return anchor;
}
