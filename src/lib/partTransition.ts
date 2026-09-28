/**
 * Hücreden ürün sayfasına geçiş (§11.5, K-089): tıklanan hücrenin fotoğrafı yerinde kalır,
 * sayfanın geri kalanı 240 ms'de söner, yeni sayfa gelir ve levha çizilmeye başlar.
 * `document.startViewTransition` ile; fotoğrafa ad yalnızca geçiş süresince verilir (lup klonunda
 * aynı ad olmasın). Desteklenmiyorsa içerik sönüp yeniden yanar; reduced motion'da geçiş yok.
 * Animasyonlar globals.css'te (`part-open`, `part-hold`).
 */

type Router = { push: (href: string) => void };

/** --duration-fast */
const FADE_MS = 240;
/**
 * Yeni sayfa bu sürede gelmezse (ör. ilk kez derlenen rota) geçiş atlanır, gezinme sürer:
 * eski sayfa "yeni" diye yeniden yanmasın. Tarayıcının 4 sn güncelleme sınırından önce.
 */
const TIMEOUT_MS = 3500;

let pending: { path: string; done: () => void } | null = null;
/** Geçiş sürüyor: tıklamadan geçişin bitişine (ya da atlanmasına) kadar. */
let busy = false;

/** Yeni sayfanın içeriği commit edildi (MotionReady'nin yerleşim efekti, sayfa efektlerinden sonra). */
export function pageReady(pathname: string) {
  if (pending?.path === pathname) pending.done();
}

function navigate(router: Router, href: string) {
  const path = new URL(href, location.href).pathname;
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      pending = null;
      reject(new Error("part-open: yeni sayfa zamanında gelmedi"));
    }, TIMEOUT_MS);
    const done = () => {
      window.clearTimeout(timer);
      pending = null;
      resolve();
    };
    pending = { path, done };
    router.push(href);
  });
}

/** Geçişi başlatır; `false` dönerse Next'in normal gezinmesi sürer. */
export function openPart(router: Router, href: string, link: HTMLElement): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // Geçiş sürerken ikinci tıklama yutulur: ilk gezinmenin beklemesini (pending) bozmasın (inceleme 2.8)
  if (busy) return true;
  busy = true;
  const root = document.documentElement;

  if (typeof document.startViewTransition !== "function") {
    root.classList.add("part-leaving");
    window.setTimeout(() => {
      const show = () => {
        root.classList.remove("part-leaving");
        busy = false;
      };
      navigate(router, href).then(show, show);
    }, FADE_MS);
    return true;
  }

  const photo = link.querySelector<HTMLElement>("[data-part-photo]");
  if (photo) photo.style.viewTransitionName = "part-hold";
  const update = () => navigate(router, href);
  // Geçiş türü (Chromium 125+): Nav'ı yerinde tutan ve kökü sıralı söndüren kurallar buna bağlı
  const transition =
    "types" in ViewTransition.prototype
      ? document.startViewTransition({ update, types: ["part-open"] })
      : document.startViewTransition(update);
  // Zaman aşımında geçişin sözleri reddedilir (geçiş atlanır); gezinme yine olur
  const cleanup = () => {
    photo?.style.removeProperty("view-transition-name");
    busy = false;
  };
  transition.ready.catch(() => {});
  transition.updateCallbackDone.catch(() => {});
  transition.finished.then(cleanup, cleanup);
  return true;
}
