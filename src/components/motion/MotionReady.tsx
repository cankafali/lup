"use client";

import { useEffect, useLayoutEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Sayfadaki giriş animasyonları başlangıç durumlarını kurduktan sonra (bu bileşen içeriğin
 * ardından render edilir, efektleri en son çalışır) `data-intro` bölgelerinin CSS gizlemesini kaldırır.
 * Fontlar ve görseller yüklenince ScrollTrigger konumlarını yeniden hesaplar (§19 Aşama 5).
 */
export function MotionReady() {
  useLayoutEffect(() => {
    document.documentElement.classList.add("anim-ready");
  }, []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });
    return () => window.removeEventListener("load", refresh);
  }, []);

  return null;
}
