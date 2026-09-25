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

  // ScrollTrigger görseller yüklenince (load) kendisi yeniler; fontlar ondan sonra gelirse bir
  // kez daha. Her yenileme tüm tetikleyicileri ölçer: gereksizi uzun görev üretiyordu (§17)
  useEffect(() => {
    let alive = true;
    const afterLoad = () => {
      if (document.fonts?.status !== "loading") return;
      void document.fonts.ready.then(() => {
        if (alive) ScrollTrigger.refresh();
      });
    };
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    return () => {
      alive = false;
      window.removeEventListener("load", afterLoad);
    };
  }, []);

  return null;
}
