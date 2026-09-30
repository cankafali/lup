// Lupla basılı tutup bırakınca gelen tek tıklama yutulur: link üstünde bırakılırsa sayfa değişmesin
// (K-105). Pencere yakalama evresinde; Lenis'in anchor işleyicisi önce çalıştığı için o da
// `clickSwallowed()`'a bakar.

let until = 0;

function onClick(e: MouseEvent) {
  window.removeEventListener("click", onClick, { capture: true });
  if (performance.now() > until) return;
  until = 0;
  e.preventDefault();
  e.stopPropagation();
}

/** Bırakmadan sonraki ilk tıklamayı `ms` içinde gelirse yut. */
export function swallowNextClick(ms = 400) {
  until = performance.now() + ms;
  window.removeEventListener("click", onClick, { capture: true });
  window.addEventListener("click", onClick, { capture: true });
}

export const clickSwallowed = () => performance.now() <= until;
