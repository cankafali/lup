"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger } from "./gsap";

// Lenis örneği modül düzeyinde tutulur; bileşenler useLenis ile okur (efekt içinde setState yok).
let instance: Lenis | null = null;
const subscribers = new Set<() => void>();
const setInstance = (l: Lenis | null) => {
  instance = l;
  subscribers.forEach((fn) => fn());
};
const subscribe = (fn: () => void) => {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
};

const LenisCtx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisCtx);

/** Anchor kaydırması başlarken yayınlanır (mobil menü kapansın). */
export const ANCHOR_EVENT = "lup:anchor";

/** Kaydırma hedefi olarak Nav'ın yüksekliği kadar üstte dur (§8.9: offset −96, mobilde 64). */
const navOffset = () => -(document.querySelector("header")?.offsetHeight ?? 96);

/**
 * Aynı sayfadaki "#…" ve "/#…" linklerini Lenis ile kaydırır (§8.9). Başka sayfaya giden
 * "/#vitrin" gibi linkler Next'e bırakılır. React'in işleyicilerinden önce, pencere yakalama evresinde.
 */
function onAnchorClick(e: MouseEvent) {
  const lenis = instance;
  if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey)
    return;
  const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
  if (!(a instanceof HTMLAnchorElement) || a.target === "_blank") return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname) return;
  if (!a.getAttribute("href")?.includes("#")) return;
  const target = url.hash && url.hash !== "#" ? document.querySelector(url.hash) : 0;
  if (target === null) return;
  e.preventDefault();
  e.stopPropagation();
  window.dispatchEvent(new Event(ANCHOR_EVENT));
  // force: mobil menü açıkken Lenis durdurulmuş olabilir
  lenis.scrollTo(target === 0 ? 0 : (target as HTMLElement), {
    offset: target === 0 ? 0 : navOffset(),
    duration: 1.2,
    force: true,
  });
  // Klavyeyle gelen de oraya gitsin (§16): sonraki Tab bölümün içinden devam eder
  if (target instanceof HTMLElement) {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
}

/** Yumuşak kaydırma (§14.1): GSAP ticker'a bağlı, her kaydırmada ScrollTrigger güncellenir. */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenis = useSyncExternalStore(
    subscribe,
    () => instance,
    () => null,
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const l = new Lenis({ duration: reduce ? 0 : 1.1, smoothWheel: !reduce, syncTouch: false });
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener("click", onAnchorClick, { capture: true });
    setInstance(l);
    return () => {
      window.removeEventListener("click", onAnchorClick, { capture: true });
      gsap.ticker.remove(tick);
      l.destroy();
      setInstance(null);
    };
  }, []);

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>;
}
