"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pageReady } from "@/lib/partTransition";
import { introReadyFor, markNavigated } from "./intro";

/** Giriş sahibi (HeroMotion/PlateMotion) bu sürede hazır olmazsa gizleme yine kalkar. */
const FALLBACK_MS = 3000;

/**
 * Sayfa düzeyinde hareket işleri (içeriğin ardından render edilir, efektleri en son çalışır):
 * - Gezinmede yeni sayfanın giriş gizlemesini geri açar; sahibi hazır olunca (`introReady`)
 *   kalkar. İlk yüklemede bunu HeroMotion/PlateMotion yapar (animasyonlar ayrı pakette, K-103).
 * - Fontlar görsellerden sonra gelirse ScrollTrigger konumlarını bir kez yeniler.
 * - Her gezinmede yeni sayfanın başlangıç durumları kurulduktan sonra sayfa geçişine haber verir (§11.5).
 */
export function MotionReady() {
  const pathname = usePathname();
  const first = useRef(true);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    markNavigated();
    // Sahibin paketi önbellekteyse aynı commit'te (bu efektten önce) hazır olmuştur
    if (introReadyFor(pathname)) return;
    // Yeni sayfa: giriş bölgeleri, sahibi başlangıç durumlarını kurana dek gizli (boyamadan önce)
    const root = document.documentElement;
    root.classList.remove("anim-ready");
    const t = window.setTimeout(() => root.classList.add("anim-ready"), FALLBACK_MS);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useLayoutEffect(() => {
    pageReady(pathname);
  }, [pathname]);

  // ScrollTrigger görseller yüklenince (load) kendisi yeniler; fontlar ondan sonra gelirse bir
  // kez daha. Her yenileme tüm tetikleyicileri ölçer: gereksizi uzun görev üretiyordu (§17)
  useEffect(() => {
    let alive = true;
    const afterLoad = () => {
      if (document.fonts?.status !== "loading") return;
      void document.fonts.ready
        .then(() => import("@/lib/scroll"))
        .then(({ ScrollTrigger }) => {
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
