"use client";

// Hero girişinin saati: zamanlaması ölçüme bağlı parçalar (kılavuz çizgi) aynı sıraya otursun.
let start = 0;

/** Girişin başlangıcından bu yana geçen süre (s); ilk çağrı saati başlatır. */
export function introTime() {
  if (!start) start = performance.now();
  return (performance.now() - start) / 1000;
}

export function resetIntro() {
  start = 0;
}
