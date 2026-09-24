import { site } from "./site";

// Bölüm metinleri (§12.4). Mono etiketler büyük harfle yazılır; birimler küçük kalır (K-014).
// Buton metinlerine ok (→) yazılmaz; Button bileşeni ekler (K-022).

const pad2 = (n: number) => String(n).padStart(2, "0");
const upper = (s: string) => s.toLocaleUpperCase("tr-TR");

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
  // Ürün sayfasından da çalışsın diye kök yolla.
  links: [
    { no: "01", label: "VİTRİN", href: "/#vitrin" },
    { no: "02", label: "ATÖLYE", href: "/#atolye" },
    { no: "03", label: "MAĞAZA", href: "/#magaza" },
  ],
  cta: { label: "RANDEVU →", href: "/#magaza" },
};

const { lat, lng } = site.address.coords;

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
  note: "BU SİTEDE HER ŞEY\nKASITLI OLARAK KÜÇÜK.\nİMLECİNİZ BİR LUPTUR.",
  down: { label: "↓  TEZGÂHA İN", href: "#vitrin" },
  lens: {
    mark: "10×",
    caption: "LUP = İMLECİNİZ\nTAŞ  Ø 5.1 mm · 0.50 ct · F · VS1",
    alt: "Dört tırnaklı yuvadaki yuvarlak pırlantanın turuncu yansımalı makro görüntüsü",
  },
  overlay: {
    stone: "Ø 5.1 mm",
    section: "A",
    band: "BANT  2.2 mm\n18K · 750",
  },
};

export const vitrin = {
  label: "02 — VİTRİN",
  title: [{ text: "Tezgâhta" }, { text: "altı parça.", italic: true }],
  note: "FİYAT YOK.\nHER PARÇA MAĞAZADA, ELDE, 1:1.\nİMLECİ BİR PARÇANIN ÜZERİNE GETİRİN.",
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
  diameter: "Ø 5.10 mm  ·  ÖLÇEK 10:1",
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

export const openStatus = {
  open: "ŞU AN AÇIK",
  closed: (day: string) => `ŞU AN KAPALI — ${day} ${site.hours.from}'DA AÇILIR`,
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
  copyright: `© 2026 ${upper(site.brandFull)} · ${site.address.plate} ${upper(site.address.city)}`,
  motto: "BU SİTEDE HER ŞEY 10×",
  top: "YUKARI ↑",
};
