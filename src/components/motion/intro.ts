"use client";

// Hero girişinin saati: zamanlaması ölçüme bağlı parçalar (kılavuz çizgi) aynı sıraya otursun.
let start = 0;

/** Girişin başlangıcından bu yana geçen süre (s); ilk çağrı saati başlatır. */
export function introTime() {
  if (!start) start = performance.now();
  return (performance.now() - start) / 1000;
}

/**
 * Giriş sahibi (HeroMotion, PlateMotion) başlangıç durumlarını kurdu: `data-intro` gizlemesi kalkar
 * (K-064). Animasyonlar ayrı pakette geldiği için hidrasyonda değil burada (K-103).
 */
let readyPath: string | null = null;
export function introReady() {
  readyPath = location.pathname;
  document.documentElement.classList.add("anim-ready");
}
/** Bu yolun giriş sahibi hazır mı: gezinmede sahibin paketi önbellekteyse aynı commit'te olur. */
export const introReadyFor = (path: string) => readyPath === path;

let navigated = false;
/** Sayfa içi gezinme oldu (MotionReady); bundan sonra kurulumlar ertelenmez. */
export function markNavigated() {
  navigated = true;
}
/** İlk yükleme mi (henüz sayfa içi gezinme yok)? */
export const isFirstLoad = () => !navigated;

export function resetIntro() {
  start = 0;
}
