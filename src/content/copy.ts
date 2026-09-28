import { getProduct } from "./products";
import { site, YEAR } from "./site";

// Bölüm metinleri (§12.4). Mono etiketler büyük harfle yazılır; birimler küçük kalır (K-014).
// Buton metinlerine ok (→) yazılmaz; Button bileşeni ekler (K-022).

const pad2 = (n: number) => String(n).padStart(2, "0");
const upper = (s: string) => s.toLocaleUpperCase("tr-TR");

/** Yalnızca ekran okuyucuya yönelik ekler (§16). */
export const a11y = {
  /** Yeni sekmede açılan linklerin sonuna (inceleme 4.2) */
  newTab: " (yeni sekmede açılır)",
};

export const plate = {
  /** "ÖLÇEK 1:1 — LEVHA 02/05" */
  label: (no: number, total: number) => `ÖLÇEK 1:1 — LEVHA ${pad2(no)}/${pad2(total)}`,
  total: 5,
};

export const photoNote = "TEMSİLİ GÖRSEL";

export const nav = {
  brand: upper(site.brand),
  brandSub: `KUYUMCULUK — ${site.founded}`,
  label: "Ana menü",
  /** Klavye için ilk link (§16) */
  skip: "İçeriğe geç",
  // Ürün sayfasından da çalışsın diye kök yolla.
  links: [
    { no: "01", label: "VİTRİN", title: "Vitrin", href: "/#vitrin" },
    { no: "02", label: "ATÖLYE", title: "Atölye", href: "/#atolye" },
    { no: "03", label: "MAĞAZA", title: "Mağaza", href: "/#magaza" },
  ],
  cta: { label: "RANDEVU →", href: "/#magaza" },
  /** Mobil menü (§8.9) */
  menu: "MENÜ",
  close: "KAPAT",
  menuLabel: "Bölümler",
};

const { lat, lng } = site.address.coords;

/** Hero ve 10× bölümündeki taş/bant ölçüleri Tektaş'ın verisinden (inceleme 2.11, K-047). */
function solitaireData() {
  const p = getProduct("tektas-ruya");
  const spec = p?.drawingSpec;
  if (!p?.stone || spec?.kind !== "solitaire") throw new Error("copy.ts: Tektaş verisi eksik");
  return { spec, stone: p.stone, karat: p.karat.label };
}
const tektas = solitaireData();

export const hero = {
  srTitle: `${site.brandFull} — Yakından bakın.`,
  image: {
    src: "/images/hero-tektas.jpg",
    w: 1376,
    h: 768,
    alt: "Dört tırnaklı yuvada yuvarlak pırlanta taşlı 18 ayar altın tektaş yüzük, kâğıt zemin üzerinde",
  },
  title: [{ text: "Yakından" }, { text: "bakın.", italic: true }],
  coords: `${lat.toFixed(4)}° K / ${lng.toFixed(4)}° D`,
  note: "BU SİTEDE HER ŞEY\nKASITLI OLARAK KÜÇÜK.",
  /** Kullanım bilgisi (K-106): cihaza göre biri görünür, kalıcı */
  howTo: {
    mouse: "SOL TIKA 2 SN BASILI TUTUN —\nLUP AÇILIR. BIRAKINCA KAPANIR.",
    touch: "BİR PARÇAYA BASILI TUTUN —\nLUP AÇILIR.",
  },
  down: { label: "↓  TEZGÂHA İN", href: "#vitrin" },
  lens: {
    mark: "10×",
    /** Örnek lup notunun ilk satırı, cihaza göre (K-106) */
    howTo: { mouse: "SOL TIK · 2 SN = LUP", touch: "BASILI TUT = LUP" },
    caption: `TAŞ  Ø ${tektas.spec.stone} mm · ${tektas.stone.carat} · ${tektas.stone.color} · ${tektas.stone.clarity}`,
    alt: "Dört tırnaklı yuvadaki yuvarlak pırlantanın turuncu yansımalı makro görüntüsü",
  },
  overlay: {
    stone: `Ø ${tektas.spec.stone} mm`,
    section: "A",
    band: `BANT  ${tektas.spec.section.width} mm\n${tektas.karat}`,
  },
};

export const vitrin = {
  label: "02 — VİTRİN",
  title: [{ text: "Tezgâhta" }, { text: "altı parça.", italic: true }],
  note: "FİYAT YOK.\nHER PARÇA MAĞAZADA, ELDE, 1:1.\nBİR PARÇAYA BASILI TUTUP YAKINDAN BAKIN.",
  end: (count: number) => `TEZGÂHIN SONU — ${pad2(count)} / ${pad2(count)}`,
  all: { label: "Tüm parçalar mağazada", href: "#magaza" },
  inspect: "İNCELE →",
  no: (no: string) => `No. ${no}`,
  filigree: "TELKARİ DETAYI · TEL Ø 0.3 mm\nPARÇANIN TAMAMI MAĞAZADA",
  lensMark: "10×",
};

export const makro = {
  label: "03 — 10×",
  title: [{ text: "Çıplak gözle" }, { text: "görünmez.", italic: true }],
  body: "Tırnağın ucundaki çekiç izi, iki fasetin buluştuğu çizgi. Lup bunu gösterir. Taşın ışığı ise ancak elinizde döndüğünde ortaya çıkar.",
  lensMark: "10×",
  lensAlt: "Dört tırnaklı yuvadaki yuvarlak pırlantanın önden makro görüntüsü",
  notes: {
    prong: "TIRNAK 01 / 04\nØ 0.9 mm · EL İŞİ",
    table: "TABLA\n%57 · 57 FASET",
    hammer: "ÇEKİÇ İZİ\nMAKİNE DEĞİL, EL",
    girdle: "RUNDİST\nİNCE · CİLALI",
  },
  diameter: `Ø ${tektas.spec.stone.toFixed(2)} mm  ·  ÖLÇEK 10:1`,
};

export const atolye = {
  label: "04 — ATÖLYE",
  title: [{ text: "Aynı tezgâh," }, { text: "üç kuşak.", italic: true }],
  photoAlt:
    "Ustanın elinde lup ve cımbızla tutulan burma yüzük; ahşap tezgâhta kâğıda çizilmiş yüzük çizimleri",
  notes: {
    ring: "BURMA · Ø 17.2 mm\n18K · 750",
    loupe: "LUP · 10×",
    drawing: "ÇİZİM · 2:1",
  },
  steps: [
    {
      label: "01 — ÇİZİM",
      title: "Kâğıtta başlar",
      text: "Her parça önce 2:1 ölçekte, elle çizilir.",
    },
    {
      label: "02 — DÖKÜM",
      title: "Ayar damgalanır",
      text: "Altın, ayarı damgalanmadan tezgâhtan çıkmaz.",
    },
    {
      label: "03 — MIHLAMA",
      title: "Lup altında",
      text: "Taşlar tek tek, 10× büyütme altında yerine oturtulur.",
    },
    {
      label: "04 — KONTROL",
      title: "Ustanın imzası",
      text: "Son söz ustanın gözündedir; imzası sertifikadadır.",
    },
  ],
};

export const magaza = {
  label: "05 — MAĞAZA",
  site: {
    label: "SİTEDE",
    figure: "10×",
    text: "Bir çizim. Bir ölçü.\nBüyütülmüş bir detay.",
  },
  store: {
    label: "MAĞAZADA",
    figure: "1:1",
    text: "Elinizde, ışıkta,\ngerçek ağırlığıyla.",
  },
  hours: `${upper(site.hours.days)}  ${site.hours.from}–${site.hours.to}`,
  cta: "Randevu al",
  ctaMessage: "Merhaba, mağazanızı ziyaret etmek için randevu almak istiyorum.",
  directions: "Yol tarifi",
};

// Saatin bulunma hâli eki, okunuşun son kelimesine göre (inceleme 2.9): "10:00'DA", "11:00'DE", "09:15'TE"
const SUFFIX_ONES: Record<number, string> = {
  1: "DE",
  2: "DE",
  3: "TE",
  4: "TE",
  5: "TE",
  6: "DA",
  7: "DE",
  8: "DE",
  9: "DA",
};
const SUFFIX_TENS: Record<number, string> = {
  0: "DA",
  10: "DA",
  20: "DE",
  30: "DA",
  40: "TA",
  50: "DE",
};

/** "10:00" → "DA", "11:00" → "DE", "09:15" → "TE". Dakika varsa dakikaya, yoksa saate göre. */
export function timeSuffix(hhmm: string) {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  const n = m || h;
  return SUFFIX_ONES[n % 10] ?? SUFFIX_TENS[n - (n % 10)] ?? "DA";
}

export const openStatus = {
  open: "ŞU AN AÇIK",
  closed: (day: string) =>
    `ŞU AN KAPALI — ${day} ${site.hours.from}'${timeSuffix(site.hours.from)} AÇILIR`,
  days: ["PAZAR", "PAZARTESİ", "SALI", "ÇARŞAMBA", "PERŞEMBE", "CUMA", "CUMARTESİ"],
};

export const footer = {
  columns: {
    address: "ADRES",
    contact: "İLETİŞİM",
    hours: "SAATLER",
    follow: "TAKİP",
  },
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  wordmark: upper(site.brand),
  stamps: { founded: String(site.founded), hallmark: "750" },
  copyright: `© ${YEAR} ${upper(site.brandFull)} · ${site.address.plate} ${upper(site.address.city)}`,
  motto: "BU SİTEDE HER ŞEY 10×",
  top: "YUKARI ↑",
};

const [masterFirst = "", ...masterRest] = site.master.name.split(" ");

export const productPage = {
  back: { label: "← TEZGÂHA DÖN", href: "/#vitrin" },
  plate: (no: string, total: number) => `LEVHA ${no} / ${pad2(total)}`,
  scale: "ÖLÇEK 2:1\nÖLÇÜLER mm",
  views: {
    front: "ÖN GÖRÜNÜŞ",
    top: "ÜST GÖRÜNÜŞ — 6:1",
    section: "KESİT A-A — 10:1",
    flat: "DÜZ AÇILIM",
    side: "YAN GÖRÜNÜŞ",
    sideZoom: "YAN GÖRÜNÜŞ — 4:1",
    development: "BANT YÜZEYİ AÇILIMI — 6:1",
    wireSection: "KESİT A-A — 20:1",
    setting: "YUVA DETAYI — 10:1",
    chain: "ZİNCİR HALKASI — 20:1",
    detail: "DETAY B — 8:1",
  },
  sectionMark: "A",
  detailMark: "B",
  others: "DİĞER PARÇALAR",
  tennisBreak: "···",
  lensAlt: "Dört tırnaklı yuvadaki yuvarlak pırlantanın önden makro görüntüsü",
  titleBlock: {
    part: "PARÇA",
    no: "NO",
    master: "USTA",
    scale: "ÖLÇEK",
    date: "TARİH",
    masterValue: `${masterFirst.charAt(0)}. ${masterRest.join(" ")}`,
    scaleValue: "2:1",
  },
};

export const certificate = {
  title: "SERTİFİKA",
  no: (certNo: string) => `No. ${certNo}`,
  rows: {
    karat: "AYAR",
    weight: "AĞIRLIK",
    stone: "TAŞ",
    carat: "KARAT",
    color: "RENK",
    clarity: "BERRAKLIK",
    cut: "KESİM",
    size: "ÖLÇÜ",
    status: "DURUM",
  },
  master: `USTA — ${upper(site.master.name)}`,
  masterStamp: `USTA · ${site.master.initials}`,
  signatureLabel: `${site.master.name} imzası`,
  cta: "Mağazada 1:1 görün",
  status: {
    Vitrinde: `ŞU AN VİTRİNDE · ${upper(site.address.area)}`,
    "Sipariş üzerine": `SİPARİŞ ÜZERİNE · ${upper(site.address.area)}`,
  },
  note: "GÖRSELLER VE DEĞERLER TEMSİLİDİR. PARÇANIN KENDİSİ MAĞAZADADIR.",
};

/** Paylaşım görseli (§18). */
export const og = {
  line: `${upper(site.brand)} — ${upper(site.tagline)}`,
  alt: `${site.brandFull}: lup dairesi içinde pırlantanın makro görüntüsü, altında "${site.tagline}"`,
};
