"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { pageReady } from "@/lib/partTransition";

/**
 * Sayfadaki giriş animasyonları başlangıç durumlarını kurduktan sonra (bu bileşen içeriğin
 * ardından render edilir, efektleri en son çalışır) `data-intro` bölgelerinin CSS gizlemesini kaldırır.
 * Fontlar ve görseller yüklenince ScrollTrigger konumlarını yeniden hesaplar (§19 Aşama 5).
 * Her gezinmede, yeni sayfanın başlangıç durumları kurulduktan sonra sayfa geçişine haber verir (§11.5).
 */
export function MotionReady() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    document.documentElement.classList.add("anim-ready");
  }, []);

  useLayoutEffect(() => {
    pageReady(pathname);
  }, [pathname]);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });
    return () => window.removeEventListener("load", refresh);
  }, []);

  return null;
}
