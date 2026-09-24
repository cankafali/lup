export const EASE = {
  lup: "cubic-bezier(0.22, 1, 0.36, 1)",
  draw: "cubic-bezier(0.65, 0, 0.35, 1)",
  gsapLup: "expo.out",
  gsapDraw: "power2.inOut",
  gsapStamp: "back.out(2)", // damga vurma — tek istisna easing (§11.3)
} as const;

export const DURATION = { fast: 0.24, base: 0.6, slow: 1.2 } as const;

export const LOUPE = {
  diameter: 200,
  diameterMobile: 140,
  ring: 16, // dış halka kalınlığı (px)
  ringOpacity: 0.25,
  scale: 3.3, // gerçek büyütme
  label: "10×", // gösterilen etiket
  lerp: 0.15,
  touchOffsetY: 60, // mobilde parmağın üstüne kaydırma
  touchHoldMs: 180,
} as const;

/** Display boyutlarının 1440 referans değerleri (px); tokens.css'teki clamp()'lerin üst sınırı. */
export const DISPLAY_REF = { xl: 150, l: 104, m: 76, s: 56 } as const;

/** Referans tuval genişliği (px). Figma koordinatları bu genişliğe göredir. */
export const CANVAS_REF = 1440;
