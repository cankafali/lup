"use client";

import { useEffect, useRef, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { LOUPE } from "@/lib/tokens";
import {
  applyHires,
  cloneContent,
  collectScroll,
  collectSync,
  measureSticky,
  type ScrollPair,
  type StickyClone,
  type SyncPair,
} from "./cloneContent";
import { markHintSeen } from "./hint";

/** Üzerindeyken sistem imleci geri gelir, lup dış halkaya küçülür (§9.4). */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, label';
/** Tamamı link olan büyük alanlar (tepsi hücresi): içerik gibi büyütülür (K-056). */
const MAGNIFY = "[data-loupe-magnify]";
/** Lupun boşta kaldığı alanlar (§9.4): harita, footer. */
const OFF_AREA = "[data-loupe-off]";
const REFRESH_MS = 100; // §9.5
const RESIZE_MS = 150; // §9.5

type State = "off" | "idle" | "active";
type Mode = "mouse" | "touch";

/** Klonu tazeleme isteği (§9.5): animasyon bitişleri, saat, ölçüm sonrası. */
let requestRefresh: () => void = () => {};
export function refreshLoupe() {
  requestRefresh();
}

function debounce(fn: () => void, ms: number) {
  let t: number | undefined;
  const run = () => {
    window.clearTimeout(t);
    t = window.setTimeout(fn, ms);
  };
  run.cancel = () => window.clearTimeout(t);
  return run;
}

/** Tarayıcı boşta kalınca çalıştır (§17: klon LCP'yi etkilemesin). */
function whenIdle(fn: () => void) {
  // Safari'de requestIdleCallback yok
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fn, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
}

function createLoupe(
  root: HTMLElement,
  ring: HTMLElement,
  stage: HTMLElement,
  source: HTMLElement,
) {
  const doc = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const s = LOUPE.scale;

  let mode: Mode = "mouse";
  let r = LOUPE.diameter / 2;
  let state: State = "off";
  let present = false; // imleç pencerede / parmak basılı
  let hoverIdle = false; // etkileşimli öğe, kapalı alan ya da kenar boşluğu üstünde
  let touchActive = false;
  let failed = false;
  let stale = false; // rota değişti, klon henüz yenilenmedi
  // Dokunmatik birincil cihazda lup yalnızca basılı tutunca açılır: klon ilk dokunuşta kurulur,
  // açılışta sayfanın ikinci kopyası yerleşim görmesin (§17, K-096)
  let deferred = window.matchMedia("(pointer: coarse)").matches;
  let hires = false;
  let dirty = true;
  let lastMove = 0;
  let margin = 0;
  let destroyed = false;
  const target = { x: -1000, y: -1000 };
  const pos = { x: -1000, y: -1000 };
  const last = { sx: NaN, sy: NaN };
  let clone: HTMLElement | null = null;
  let sticky: StickyClone[] = [];
  let synced: SyncPair[] = [];
  let scrollers: ScrollPair[] = [];
  let holdTimer: number | undefined;
  let holdStart: { x: number; y: number } | null = null;

  // --- Görünüm ---------------------------------------------------------------

  const setMode = (next: Mode) => {
    if (next === mode) return;
    mode = next;
    r = (next === "touch" ? LOUPE.diameterMobile : LOUPE.diameter) / 2;
    root.dataset.mode = next;
    root.style.setProperty("--loupe-d", `${r * 2}px`);
    root.style.setProperty("--loupe-ring", `${next === "touch" ? LOUPE.ringMobile : LOUPE.ring}px`);
    dirty = true;
  };

  const evaluate = () => {
    let next: State;
    if (!present) next = "off";
    else if (mode === "touch") next = touchActive ? "active" : "off";
    else if (failed || stale || hoverIdle || performance.now() - lastMove > LOUPE.idleMs)
      next = "idle";
    else next = "active";
    if (next === state) return;
    state = next;
    root.dataset.state = next;
    // Kapalıyken katman tutulmasın (§9.8)
    stage.style.willChange = next === "active" ? "transform" : "";
    // Hi-res orijinaller yalnızca lup ilk kez etkinleşince yüklenir (§17)
    if (next === "active" && !hires) {
      hires = true;
      if (clone) applyHires(clone);
    }
  };

  // --- Klon ------------------------------------------------------------------

  const build = () => {
    if (destroyed) return;
    try {
      const next = cloneContent(source);
      stage.replaceChildren(next);
      stage.style.width = `${doc.scrollWidth}px`;
      stage.style.height = `${doc.scrollHeight}px`;
      if (hires) applyHires(next);
      sticky = measureSticky(source, next, stage);
      synced = collectSync(source, next);
      scrollers = collectScroll(source, next);
      clone = next;
      failed = false;
      stale = false;
    } catch (err) {
      // Klon yoksa lup yalnızca dış halka olarak imleç süsü olur (§9.7)
      console.error("Lup: klon oluşturulamadı", err);
      stage.replaceChildren();
      clone = null;
      sticky = [];
      synced = [];
      scrollers = [];
      failed = true;
    }
    root.dataset.ready = failed ? "ring" : "clone";
    dirty = true;
    evaluate();
  };

  const ready = Promise.all([
    document.fonts?.ready,
    document.readyState === "complete"
      ? null
      : new Promise((resolve) => window.addEventListener("load", resolve, { once: true })),
  ]);
  let cancelIdle = () => {};
  const scheduleBuild = () =>
    ready.then(() => {
      if (destroyed || deferred) return;
      cancelIdle();
      cancelIdle = whenIdle(build);
    });
  const refresh = debounce(scheduleBuild, REFRESH_MS);
  // Yeni sayfa: eski klon yanlış içeriği büyütmesin; yenilenene kadar yalnızca dış halka
  const invalidate = () => {
    stale = true;
    evaluate();
    scheduleBuild();
  };

  const measureMargins = () => {
    const cs = getComputedStyle(doc);
    const gridMargin = parseFloat(cs.getPropertyValue("--grid-margin")) || 0;
    const gridMax = parseFloat(cs.getPropertyValue("--grid-max")) || 1312;
    margin = Math.max(gridMargin, (doc.clientWidth - gridMax) / 2);
  };
  const onResize = debounce(() => {
    measureMargins();
    scheduleBuild();
  }, RESIZE_MS);
  const resizeObserver = new ResizeObserver(onResize);

  // --- Fare / kalem ----------------------------------------------------------

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return onTouchMove(e);
    // Dokunmatik cihaza fare bağlandı: ertelenen klonu şimdi kur
    if (deferred) {
      deferred = false;
      scheduleBuild();
    }
    setMode("mouse");
    target.x = e.clientX;
    target.y = e.clientY;
    if (!present) {
      present = true;
      pos.x = target.x;
      pos.y = target.y;
      dirty = true;
    }
    lastMove = performance.now();
    const el = e.target instanceof Element ? e.target : null;
    const interactive = el?.closest(INTERACTIVE);
    hoverIdle =
      (!!interactive && !interactive.matches(MAGNIFY)) ||
      !!el?.closest(OFF_AREA) ||
      e.clientX < margin ||
      e.clientX > doc.clientWidth - margin;
    evaluate();
  };

  const onLeave = () => {
    if (mode !== "mouse") return;
    present = false;
    evaluate();
  };

  // Kaydırma da etkinliktir: içerik lupun altında akarken lup boşa düşmesin.
  const onScroll = () => {
    if (mode !== "mouse" || !present) return;
    lastMove = performance.now();
    evaluate();
  };
  // İç kaydırma (yatay şerit): olay kabarcıklanmaz, yakalama aşamasında dinlenir
  const onInnerScroll = (e: Event) => {
    const pair = scrollers.find((p) => p.live === e.target);
    if (!pair) return;
    pair.copy.scrollLeft = pair.live.scrollLeft;
    dirty = true;
  };

  // --- Dokunmatik (§9.6) -----------------------------------------------------

  const cancelHold = () => {
    window.clearTimeout(holdTimer);
    holdStart = null;
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    if (deferred) {
      deferred = false;
      build();
    }
    cancelHold();
    holdStart = { x: e.clientX, y: e.clientY };
    holdTimer = window.setTimeout(() => {
      if (!holdStart) return;
      setMode("touch");
      touchActive = true;
      present = true;
      target.x = pos.x = holdStart.x;
      target.y = pos.y = holdStart.y - LOUPE.touchOffsetY;
      dirty = true;
      doc.dataset.loupeTouch = "";
      navigator.vibrate?.(8);
      markHintSeen();
      evaluate();
    }, LOUPE.touchHoldMs);
  };

  const onTouchMove = (e: PointerEvent) => {
    if (touchActive) {
      target.x = e.clientX;
      target.y = e.clientY - LOUPE.touchOffsetY;
      return;
    }
    if (holdStart && Math.hypot(e.clientX - holdStart.x, e.clientY - holdStart.y) > LOUPE.touchSlop)
      cancelHold();
  };

  const onPointerEnd = (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    cancelHold();
    if (!touchActive) return;
    touchActive = false;
    delete doc.dataset.loupeTouch;
    evaluate();
  };

  // Lup açıkken sayfa kaymaz (§9.6)
  const onNativeTouchMove = (e: TouchEvent) => {
    if (touchActive) e.preventDefault();
  };
  const onContextMenu = (e: Event) => {
    if (touchActive || holdStart) e.preventDefault();
  };

  // --- Aynalama (K-066) -------------------------------------------------------

  /**
   * Scrub/pin'li öğelerin satır içi stilini klona yaz (yalnızca stil; layout okuması yok).
   * Pin'lenen öğe `position: fixed` olur; klonda sahneye göre konumlandığı için kaydırma kadar aşağı itilir.
   */
  const mirror = (sy: number) => {
    for (const pair of synced) {
      const css = pair.live.style.cssText;
      if (css !== pair.css) {
        pair.css = css;
        pair.copy.style.cssText = css;
        pair.fixedAt = NaN;
      }
      if (pair.live.style.position === "fixed" && pair.fixedAt !== sy) {
        pair.fixedAt = sy;
        pair.copy.style.translate = `0 ${sy}px`;
      }
    }
  };

  // --- Kare döngüsü (GSAP ticker; Lenis ile aynı saat, §9.3) -------------------

  const tick = () => {
    if (state === "active" && mode === "mouse" && performance.now() - lastMove > LOUPE.idleMs)
      evaluate();
    if (!present && !dirty) return;

    const k = reduce.matches ? 1 : LOUPE.lerp;
    const vx = (target.x - pos.x) * k;
    const vy = (target.y - pos.y) * k;
    pos.x += vx;
    pos.y += vy;
    const sx = window.scrollX;
    const sy = window.scrollY;
    // Scrub/pin öğeleri kaydırma dursa da (scrub gecikmesi, nabız) değişebilir; lup açıkken her karede
    if (state === "active") mirror(sy);
    const moving = Math.abs(vx) > 0.01 || Math.abs(vy) > 0.01;
    if (!dirty && !moving && sx === last.sx && sy === last.sy) return;
    dirty = false;
    last.sx = sx;
    last.sy = sy;

    // Yalnızca transform (§9.8)
    root.style.transform = `translate3d(${pos.x - r}px, ${pos.y - r}px, 0)`;
    stage.style.transform = `translate3d(${r - (pos.x + sx) * s}px, ${r - (pos.y + sy) * s}px, 0) scale(${s})`;

    // Hızlı harekette dış halkada ±%4 esneme; reduced motion'da yok
    if (!reduce.matches) {
      const ex = 1 + Math.min(LOUPE.stretch, Math.abs(vx) * 0.004);
      const ey = 1 + Math.min(LOUPE.stretch, Math.abs(vy) * 0.004);
      ring.style.transform = `scale(${ex}, ${ey})`;
    }

    for (const st of sticky) {
      const shift = Math.min(st.max, Math.max(0, sy + st.top - st.start));
      if (shift === st.shift) continue;
      st.shift = shift;
      st.el.style.transform = `translate3d(0, ${shift}px, 0)`;
    }
  };

  // --- Kurulum / söküm ---------------------------------------------------------

  root.dataset.state = state;
  doc.classList.add("has-loupe");
  measureMargins();
  resizeObserver.observe(source);
  requestRefresh = refresh;
  gsap.ticker.add(tick);

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerEnd, { passive: true });
  window.addEventListener("pointercancel", onPointerEnd, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onInnerScroll, { capture: true, passive: true });
  window.addEventListener("blur", onLeave);
  doc.addEventListener("pointerleave", onLeave);
  document.addEventListener("touchmove", onNativeTouchMove, { passive: false });
  document.addEventListener("contextmenu", onContextMenu);

  return {
    scheduleBuild,
    invalidate,
    destroy() {
      destroyed = true;
      cancelIdle();
      cancelHold();
      refresh.cancel();
      onResize.cancel();
      resizeObserver.disconnect();
      gsap.ticker.remove(tick);
      requestRefresh = () => {};
      doc.classList.remove("has-loupe");
      delete doc.dataset.loupeTouch;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onInnerScroll, { capture: true });
      window.removeEventListener("blur", onLeave);
      doc.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("touchmove", onNativeTouchMove);
      document.removeEventListener("contextmenu", onContextMenu);
    },
  };
}

type LoupeRefs = {
  root: RefObject<HTMLDivElement | null>;
  ring: RefObject<HTMLDivElement | null>;
  stage: RefObject<HTMLDivElement | null>;
};

/**
 * İmleç lupu (§9): `#lup-content`'in klonu büyütülüp kaydırılır; konum GSAP ticker'ında lerp'lenir.
 * Klon fontlar ve görseller yüklendikten sonra boşta oluşturulur; boyut ve rota değişiminde yenilenir.
 */
export function useLoupe({ root, ring, stage }: LoupeRefs) {
  const pathname = usePathname();
  const loupe = useRef<ReturnType<typeof createLoupe> | null>(null);

  useEffect(() => {
    const source = document.getElementById("lup-content");
    if (!root.current || !ring.current || !stage.current || !source) return;
    const instance = createLoupe(root.current, ring.current, stage.current, source);
    loupe.current = instance;
    return () => {
      instance.destroy();
      loupe.current = null;
    };
  }, [root, ring, stage]);

  // İlk yükleme ve her rota değişiminde yeniden klonla (§9.5)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      loupe.current?.scheduleBuild();
    } else loupe.current?.invalidate();
  }, [pathname]);
}
