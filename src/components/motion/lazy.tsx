"use client";

import dynamic from "next/dynamic";

/**
 * Bölüm animasyonları hidrasyondan sonra ayrı pakette (ScrollTrigger dahil): ilk yükte JS
 * bütçesine (§17, ≤ 180 KB) girmezler (K-103). Giriş gizlemesi (K-064) sahibi hazır olana dek
 * sürer: HeroMotion ve PlateMotion kurulumu bitince `introReady()` çağırır.
 * Sunucuda hiçbir şey çizmezler (yalnızca boş bir çapa span'i).
 */
// Kılavuz çizgi yalnızca istemcide ölçülüp çizilir; DrawSVG'yi ilk yüke çeken tek bileşendi
export const HeroGuide = dynamic(
  () => import("@/components/sections/HeroGuide").then((m) => m.HeroGuide),
  { ssr: false },
);
export const HeroMotion = dynamic(() => import("./HeroMotion").then((m) => m.HeroMotion), {
  ssr: false,
});
export const NavMotion = dynamic(() => import("./NavMotion").then((m) => m.NavMotion), {
  ssr: false,
});
export const VitrinMotion = dynamic(() => import("./VitrinMotion").then((m) => m.VitrinMotion), {
  ssr: false,
});
export const MakroMotion = dynamic(() => import("./MakroMotion").then((m) => m.MakroMotion), {
  ssr: false,
});
export const AtolyeMotion = dynamic(() => import("./AtolyeMotion").then((m) => m.AtolyeMotion), {
  ssr: false,
});
export const MagazaMotion = dynamic(() => import("./MagazaMotion").then((m) => m.MagazaMotion), {
  ssr: false,
});
export const PlateMotion = dynamic(() => import("./PlateMotion").then((m) => m.PlateMotion), {
  ssr: false,
});
