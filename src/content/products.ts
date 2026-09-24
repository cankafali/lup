import type { Side } from "@/lib/overlay";

/**
 * Teknik levha ölçüleri (mm). Tektaş şartnameden (§11.2); diğerleri temsili (K-044).
 * `kind`, ürünün `drawing` alanıyla aynıdır.
 */
export type DrawingSpec =
  | {
      kind: "solitaire";
      innerDiameter: number;
      band: number;
      stone: number;
      section: { width: number; thickness: number };
    }
  | { kind: "twist"; innerDiameter: number; band: number; turns: number }
  | { kind: "drop-earring"; total: number; stone: { length: number; width: number } }
  | { kind: "tennis"; count: number; pitch: number; width: number; stone: number; length: number }
  | { kind: "pear-pendant"; total: number; stone: { length: number; width: number } }
  | { kind: "filigree"; innerDiameter: number; band: number; stone: number; wire: number };

export type Product = {
  slug: string;
  no: string; // "01"
  certNo: string; // "0147"
  name: string;
  subtitle: string; // italik alt başlık
  description: string;
  category: "YÜZÜK" | "KÜPE" | "BİLEKLİK" | "KOLYE UCU";
  karat: { label: string; hallmark: "585" | "750" | "916" };
  weightG: number;
  stone?: {
    type: string;
    shape: string;
    carat: string;
    color?: string;
    clarity?: string;
    cut?: string;
  };
  size: string; // "Yüzük no. 14 · iç Ø 17.3 mm"
  dataLine: string; // tepsi veri satırı
  status: "Vitrinde" | "Sipariş üzerine";
  drawing: "solitaire" | "twist" | "drop-earring" | "tennis" | "pear-pendant" | "filigree";
  drawingSpec: DrawingSpec;
  image: {
    src: string;
    hires: string;
    w: number;
    h: number;
    objectPosition?: string;
    alt: string;
  };
  macro?: { src: string; alt: string };
  /** Tepsi hücresi ölçü bindirmesi; koordinatlar hücrenin 440×550 viewBox'ında (§10.2). */
  overlay:
    | { kind: "h"; x1: number; x2: number; y: number; label: string; labelSide?: Side }
    | { kind: "v"; y1: number; y2: number; x: number; label: string; labelSide?: Side }
    | { kind: "lens" };
  whatsappMessage: string;
};

const whatsappMessage = (name: string, certNo: string) =>
  `Merhaba, sitede ${name} (No. ${certNo}) parçasını gördüm. Mağazada görmek için uygun bir saat öğrenebilir miyim?`;

const img = (file: string, w: number, h: number, alt: string, objectPosition?: string) => ({
  src: `/images/${file}`,
  hires: `/images/${file}`,
  w,
  h,
  alt,
  ...(objectPosition ? { objectPosition } : {}),
});

const MACRO_DETAIL = {
  src: "/images/lup-detay.jpg",
  alt: "Dört tırnaklı yuvadaki yuvarlak pırlantanın önden makro görüntüsü",
};

export const products: readonly Product[] = [
  {
    slug: "tektas-ruya",
    no: "01",
    certNo: "0147",
    name: "Tektaş Rüya",
    subtitle: "Dört tırnak, tek taş, tek niyet.",
    description:
      'Klasik dört tırnaklı yuva, taşı ışığa en çok açan ayardır. Bant, parmakta dönmeyecek kadar yumuşak bir "D" profilde dövüldü. Taş, lup altında tek tek seçildi.',
    category: "YÜZÜK",
    karat: { label: "18K · 750", hallmark: "750" },
    weightG: 3.4,
    stone: {
      type: "Pırlanta",
      shape: "yuvarlak",
      carat: "0.50 ct",
      color: "F",
      clarity: "VS1",
      cut: "Mükemmel",
    },
    size: "Yüzük no. 14 · iç Ø 17.3 mm",
    dataLine: "YÜZÜK · 18K · 3.4 g · Ø 5.1 mm",
    status: "Vitrinde",
    drawing: "solitaire",
    drawingSpec: {
      kind: "solitaire",
      innerDiameter: 17.3,
      band: 2.2,
      stone: 5.1,
      section: { width: 2.2, thickness: 1.6 },
    },
    image: img(
      "hero-tektas.jpg",
      1376,
      768,
      "Dört tırnaklı yuvada yuvarlak pırlanta taşlı 18 ayar altın tektaş yüzük, kâğıt zemin üzerinde",
      "73% 55%",
    ),
    macro: MACRO_DETAIL,
    // Hero'daki taş ölçüsü (805→935, y 318; görsel px) 73% 55% kırpmasından hücreye taşındı (K-029).
    overlay: { kind: "h", x1: 178, x2: 271, y: 228, label: "Ø 5.1 mm TAŞ" },
    whatsappMessage: whatsappMessage("Tektaş Rüya", "0147"),
  },
  {
    slug: "burma-yuzuk",
    no: "02",
    certNo: "0152",
    name: "Burma Yüzük",
    subtitle: "İki tel, tek dönüş.",
    description:
      "İki altın tel elde, aynı gerginlikte burulur. Sarmalın aralığı tüm çevrede eşittir; bu, ölçüyle değil gözle yapılır.",
    category: "YÜZÜK",
    karat: { label: "22 AYAR · 916", hallmark: "916" },
    weightG: 2.9,
    size: "Yüzük no. 13 · iç Ø 18.2 mm",
    dataLine: "YÜZÜK · 22 AYAR · 2.9 g",
    status: "Vitrinde",
    drawing: "twist",
    drawingSpec: { kind: "twist", innerDiameter: 18.2, band: 1.8, turns: 16 },
    image: img(
      "vitrin-burma.jpg",
      928,
      1152,
      "Burgulu iki altın telden 22 ayar burma yüzük, kâğıt zemin üzerinde",
    ),
    overlay: { kind: "h", x1: 127, x2: 312, y: 385, label: "Ø 18.2 mm", labelSide: "below" },
    whatsappMessage: whatsappMessage("Burma Yüzük", "0152"),
  },
  {
    slug: "damla",
    no: "03",
    certNo: "0163",
    name: "Damla",
    subtitle: "Işık aşağı akar.",
    description:
      "Armut kesim iki taş, kapalı yuvada. Kanca, kulakta düz durması için tek parça tel olarak şekillendirildi.",
    category: "KÜPE",
    karat: { label: "18K · 750", hallmark: "750" },
    weightG: 2.6,
    stone: { type: "Pırlanta", shape: "armut", carat: "2 × 0.40 ct", color: "G", clarity: "VS2" },
    size: "Boy 24 mm",
    dataLine: "KÜPE · 18K · 2 × 0.40 ct",
    status: "Vitrinde",
    drawing: "drop-earring",
    drawingSpec: { kind: "drop-earring", total: 24, stone: { length: 7, width: 5 } },
    image: img(
      "vitrin-damla.jpg",
      928,
      1152,
      "Kapalı yuvada armut kesim pırlanta taşlı, kancalı 18 ayar altın damla küpe çifti, kâğıt zemin üzerinde",
    ),
    overlay: { kind: "v", x: 300, y1: 178, y2: 337, label: "24 mm" },
    whatsappMessage: whatsappMessage("Damla", "0163"),
  },
  {
    slug: "su-yolu",
    no: "04",
    certNo: "0171",
    name: "Su Yolu",
    subtitle: "Kırk iki taş, kesintisiz.",
    description:
      "Kırk iki taş, kırk iki ayrı yuva. Her halka bir sonrakine bağımsız menteşeyle bağlanır; bileklik bilekte su gibi akar.",
    category: "BİLEKLİK",
    karat: { label: "18K · 750", hallmark: "750" },
    weightG: 11.8,
    stone: {
      type: "Pırlanta",
      shape: "yuvarlak",
      carat: "42 × 0.05 ct",
      color: "G",
      clarity: "VS2",
    },
    size: "Ø 58 mm · 17.5 cm",
    dataLine: "BİLEKLİK · 18K · 42 TAŞ",
    status: "Vitrinde",
    drawing: "tennis",
    drawingSpec: { kind: "tennis", count: 42, pitch: 4.2, width: 3, stone: 2.4, length: 175 },
    image: img(
      "vitrin-su-yolu.jpg",
      928,
      1152,
      "Tek sıra yuvarlak pırlanta taşlı 18 ayar altın su yolu bileklik, kâğıt zemin üzerinde",
    ),
    overlay: { kind: "h", x1: 91, x2: 361, y: 418, label: "Ø 58 mm", labelSide: "below" },
    whatsappMessage: whatsappMessage("Su Yolu", "0171"),
  },
  {
    slug: "armut",
    no: "05",
    certNo: "0178",
    name: "Armut",
    subtitle: "Tek damla, ince zincir.",
    description:
      "Tek armut taş, ince bir çerçeve içinde. Zincir, ucun ağırlığını taşıyacak kadar sağlam, görünmeyecek kadar ince.",
    category: "KOLYE UCU",
    karat: { label: "18K · 750", hallmark: "750" },
    weightG: 1.9,
    stone: { type: "Pırlanta", shape: "armut", carat: "0.70 ct", color: "F", clarity: "VS1" },
    size: "Uç 12 mm · zincir 42 cm",
    dataLine: "KOLYE UCU · 18K · 0.70 ct",
    status: "Vitrinde",
    drawing: "pear-pendant",
    drawingSpec: { kind: "pear-pendant", total: 12, stone: { length: 8, width: 5.4 } },
    image: img(
      "vitrin-armut.jpg",
      928,
      1152,
      "İnce altın zincirde kapalı yuvalı armut kesim pırlanta kolye ucu, kâğıt zemin üzerinde",
    ),
    overlay: { kind: "v", x: 268, y1: 271, y2: 353, label: "12 mm" },
    whatsappMessage: whatsappMessage("Armut", "0178"),
  },
  {
    slug: "telkari",
    no: "06",
    certNo: "0184",
    name: "Telkari",
    subtitle: "Saç teli inceliğinde gümüş değil, altın.",
    description:
      "Tel, saç teli inceliğine kadar çekilip elle kıvrılır. Motif çizilmez; ustanın elinde oluşur.",
    category: "YÜZÜK",
    karat: { label: "22 AYAR · 916", hallmark: "916" },
    weightG: 4.2,
    stone: { type: "Pırlanta", shape: "yuvarlak", carat: "0.30 ct", color: "G", clarity: "SI1" },
    size: "Yüzük no. 15 · tel Ø 0.3 mm",
    dataLine: "YÜZÜK · 22 AYAR · EL İŞİ",
    status: "Vitrinde",
    drawing: "filigree",
    drawingSpec: { kind: "filigree", innerDiameter: 17.8, band: 2.6, stone: 4.3, wire: 0.3 },
    image: img(
      "telkari-makro.jpg",
      1024,
      1024,
      "Telkari işlemeli altın yüzükte dört tırnaklı yuvadaki pırlantanın makro görüntüsü",
    ),
    macro: {
      src: "/images/telkari-makro.jpg",
      alt: "Telkari işlemeli altın yüzükte dört tırnaklı yuvadaki pırlantanın makro görüntüsü",
    },
    overlay: { kind: "lens" },
    whatsappMessage: whatsappMessage("Telkari", "0184"),
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
