"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

/** Bu kadar kaymadan sürükleme sayılmaz (tıklama kalır). */
const THRESHOLD = 4;

/**
 * Yatay kaydırılan şerit (§11.4): yerel `overflow-x: auto` + `scroll-snap-type: x mandatory`;
 * masaüstünde fareyle sürükleyerek de kayar. Sürüklerken yapışma kapanır, bırakınca en yakın
 * hücreye yumuşakça oturur; sürüklemeden sonraki tıklama linki açmaz.
 * Lenis yatay hareketlere karışmaz (`data-lenis-prevent-horizontal`); lup klonu iç kaydırmayı
 * `data-loupe-scroll` ile izler.
 */
export function DragScroll({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pointer: number | null = null;
    let startX = 0;
    let startLeft = 0;
    let dragged = false;
    let settle: number | undefined;

    const release = () => {
      delete el.dataset.dragging;
    };
    // En yakın hücreye oturt, sonra yapışmayı geri aç. Hücre konumu ilk hücreye göre: ilk hücre
    // kaydırma 0'da yapışma kenarında durur (`scroll-padding` hesaplanmış değeri `max()` kalır, okunamaz).
    const snap = () => {
      const cells = Array.from(el.querySelectorAll<HTMLElement>("li"));
      const origin = cells[0]?.offsetLeft ?? 0;
      const target = cells.reduce((best, c) => {
        const left = c.offsetLeft - origin;
        return Math.abs(left - el.scrollLeft) < Math.abs(best - el.scrollLeft) ? left : best;
      }, el.scrollLeft);
      el.scrollTo({ left: target, behavior: "smooth" });
      el.addEventListener("scrollend", release, { once: true });
      settle = window.setTimeout(release, 600);
    };

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if (el.scrollWidth <= el.clientWidth) return;
      window.clearTimeout(settle);
      pointer = e.pointerId;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      dragged = false;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      const dx = e.clientX - startX;
      if (!dragged) {
        // Lup basılı tutularak açıldıysa fare lupu gezdirir, şeridi sürüklemez (K-105)
        if (document.documentElement.classList.contains("loupe-open")) return;
        if (Math.abs(dx) < THRESHOLD) return;
        dragged = true;
        el.dataset.dragging = "";
        el.setPointerCapture(e.pointerId);
      }
      el.scrollLeft = startLeft - dx;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      pointer = null;
      if (dragged) snap();
    };
    const click = (e: MouseEvent) => {
      if (!dragged) return;
      dragged = false;
      e.preventDefault();
      e.stopPropagation();
    };
    // Link ve görsellerin yerel sürükle-bırak hayaleti çıkmasın
    const dragStart = (e: DragEvent) => e.preventDefault();

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    el.addEventListener("dragstart", dragStart);
    return () => {
      window.clearTimeout(settle);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
      el.removeEventListener("dragstart", dragStart);
      el.removeEventListener("scrollend", release);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-loupe-scroll
      data-lenis-prevent-horizontal
      className={clsx(
        "snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain data-dragging:snap-none [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
