/** Klonda odaklanamaz yapılan öğeler. */
const FOCUSABLE = "a, button, input, select, textarea, summary, [tabindex]";

/** Klondaki yapışkan (sticky) öğe; kaydırmaya göre her karede transform ile taşınır. */
export type StickyClone = {
  el: HTMLElement;
  /** CSS `top` değeri (px) */
  top: number;
  /** Doğal (yapışmamış) konumunun belge üstünden uzaklığı (px) */
  start: number;
  /** Kapsayıcısı içinde en fazla ne kadar kayabileceği (px) */
  max: number;
  /** Son uygulanan kayma */
  shift: number;
};

/**
 * `#lup-content`'in lup için temizlenmiş kopyası (§9.2 adım 3):
 * id'ler silinir, odaklanabilir öğeler sekme sırasından çıkar, tüm klon `inert`,
 * `data-loupe-hide` öğeleri silinir, zemindeki sabit grid çizgileri mutlak konuma geçer.
 */
export function cloneContent(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  clone.querySelectorAll("[data-loupe-hide]").forEach((el) => el.remove());
  clone.querySelectorAll<HTMLElement>(FOCUSABLE).forEach((el) => el.setAttribute("tabindex", "-1"));
  clone.inert = true;
  clone.querySelectorAll<HTMLElement>("[data-grid-lines]").forEach((el) => {
    el.style.position = "absolute";
  });
  clone.querySelectorAll("img").forEach((img) => {
    img.decoding = "async";
  });
  return clone;
}

/**
 * Hi-res görsel değişimi (§9.2, §17): `data-hires` olan görsellerde src orijinal dosyaya çevrilir,
 * srcset/sizes silinir. Büyütülen fotoğraf bulanık görünmesin diye; lup ilk kez etkinleşince çağrılır.
 */
export function applyHires(clone: HTMLElement) {
  clone.querySelectorAll<HTMLImageElement>("img[data-hires]").forEach((img) => {
    const hires = img.dataset.hires;
    if (!hires || img.getAttribute("src") === hires) return;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.loading = "eager";
    img.src = hires;
  });
}

/** Kaydırmaya bağlı (scrub/pin) canlı öğe ↔ klondaki karşılığı; satır içi stili her karede aynalanır. */
export type SyncPair = {
  live: HTMLElement | SVGElement;
  copy: HTMLElement | SVGElement;
  /** Son aynalanan satır içi stil */
  css: string;
  /** Pin'liyken klonda uygulanan kaydırma (px) */
  fixedAt: number;
};

/** `data-loupe-sync` işaretli öğeleri klondaki karşılıklarıyla eşler (belge sırası aynı). */
export function collectSync(source: HTMLElement, clone: HTMLElement): SyncPair[] {
  const live = source.querySelectorAll<HTMLElement | SVGElement>("[data-loupe-sync]");
  const copies = clone.querySelectorAll<HTMLElement | SVGElement>("[data-loupe-sync]");
  const out: SyncPair[] = [];
  live.forEach((el, i) => {
    const copy = copies[i];
    if (copy) out.push({ live: el, copy, css: "", fixedAt: NaN });
  });
  return out;
}

/** Öğenin sahne (stage) içindeki dikey konumu; dönüşümlerden etkilenmeyen offset zinciriyle. */
function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

/**
 * Yapışkan öğeler (§11.1 sertifika): klon kaydırılmadığı için orada yapışmazlar.
 * Klondaki karşılığı `relative` yapılır; doğal konumu ve kayma sınırı bir kez ölçülür,
 * kaydırmadaki yeri her karede yalnızca transform ile verilir (layout okuması yok).
 */
export function measureSticky(
  source: HTMLElement,
  clone: HTMLElement,
  stage: HTMLElement,
): StickyClone[] {
  const originals = source.querySelectorAll<HTMLElement>("[data-loupe-sticky]");
  const copies = clone.querySelectorAll<HTMLElement>("[data-loupe-sticky]");
  const out: StickyClone[] = [];
  originals.forEach((orig, i) => {
    const el = copies[i];
    const cs = getComputedStyle(orig);
    if (!el || cs.position !== "sticky") return;
    el.style.position = "relative";
    el.style.top = "0px";
    el.style.willChange = "transform";
    const parent = el.parentElement;
    if (!parent) return;
    const start = offsetWithin(el, stage);
    const end = offsetWithin(parent, stage) + parent.offsetHeight;
    out.push({
      el,
      top: parseFloat(cs.top) || 0,
      start,
      max: Math.max(0, end - (start + el.offsetHeight)),
      shift: 0,
    });
  });
  return out;
}
