const FOUNDED = 1987;
/** Derleme yılı: sayfalar statik üretildiği için yılda bir yeniden yayın yeterli (inceleme 2.10). */
export const YEAR = new Date().getFullYear();

export const site = {
  brand: "Sönmez",
  brandFull: "Sönmez Kuyumculuk",
  founded: FOUNDED,
  tagline: "Sitede 10×. Mağazada 1:1.",
  description:
    "Kapalıçarşı'da 1987'den beri aynı tezgâh. Parçaları sitede 10× büyütün, mağazada 1:1 görün.",
  /** Kuyumcu onaylayana kadar false: noindex, nofollow (§18). */
  indexable: false,
  address: {
    line1: "Kapalıçarşı, Kalpakçılar Cd. No. 12",
    area: "Kapalıçarşı",
    street: "Kalpakçılar Cd. No. 12",
    district: "Fatih",
    city: "İstanbul",
    plate: 34,
    coords: { lat: 41.0107, lng: 28.9681 },
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Kapal%C4%B1%C3%A7ar%C5%9F%C4%B1+Kalpak%C3%A7%C4%B1lar+Caddesi+12+%C4%B0stanbul",
  },
  phone: { display: "+90 212 000 00 00", tel: "+902120000000" },
  whatsapp: "902120000000",
  instagram: { handle: "sonmezkuyumculuk", url: "https://instagram.com/sonmezkuyumculuk" },
  hours: {
    // 0 = Pazar ... 6 = Cumartesi
    open: [2, 3, 4, 5, 6],
    from: "10:00",
    to: "19:00",
    days: "Salı–Cumartesi",
    label: "Salı–Cumartesi 10:00–19:00",
    timeZone: "Europe/Istanbul",
  },
  master: { name: "Mehmet Sönmez", initials: "M.S." },
  stats: [
    { value: YEAR - FOUNDED, unit: "yıl" },
    { value: 3, unit: "kuşak" },
    { value: 1, unit: "tezgâh" },
  ],
} as const;

// Gerçek numaralar kuyumcudan gelene kadar derlemede uyarı (inceleme 1.1). Yayını kırmasın diye
// throw değil; tarayıcı konsoluna düşmesin diye yalnızca sunucuda.
if (typeof window === "undefined" && /0{6,}/.test(site.whatsapp + site.phone.tel)) {
  console.warn("⚠ site.ts: WhatsApp/telefon hâlâ yer tutucu — yayından önce değiştirin");
}
