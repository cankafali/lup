"use client";

// Mobil ilk ziyaret ipucunun (§9.6) "görüldü" bilgisi. localStorage erişimi her yerde try/catch;
// depolama engelliyse bilgi yalnızca bu sayfa oturumunda (bellekte) tutulur.

const KEY = "lup-ipucu-goruldu";
const EVENT = "lup-ipucu";
let seenInMemory = false;

export function subscribeHint(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function hintSeen() {
  if (seenInMemory) return true;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function markHintSeen() {
  if (hintSeen()) return;
  seenInMemory = true;
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // Özel pencere / engelli depolama: bellekteki bayrak yeterli.
  }
  window.dispatchEvent(new Event(EVENT));
}
