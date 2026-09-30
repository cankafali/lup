import { describe, expect, it } from "vitest";
import { coverPoint, pct } from "./overlay";

describe("coverPoint", () => {
  it("aynı oranda kırpma yok: nokta ölçeklenir", () => {
    expect(coverPoint(688, 384, { w: 1376, h: 768 }, 869, 404)).toEqual({ x: 434.5, y: 202 });
  });

  it("dar kapsayıcı: yükseklik dolar, yatay kırpılır (ortadan)", () => {
    // 390×844'te 1376×768 görsel: ölçek 844/768; genişlik taşar, ortadan kesilir
    const s = 844 / 768;
    const p = coverPoint(390, 844, { w: 1376, h: 768 }, 688, 384);
    expect(p.x).toBeCloseTo(195);
    expect(p.y).toBeCloseTo(384 * s);
  });

  it("object-position 0.72: kırpma sağa kayar (hero mobil, §15)", () => {
    const s = 844 / 768;
    const p = coverPoint(390, 844, { w: 1376, h: 768, x: 0.72 }, 869, 404);
    expect(p.x).toBeCloseTo((390 - 1376 * s) * 0.72 + 869 * s);
  });
});

describe("pct", () => {
  it("viewBox koordinatını yüzdeye çevirir", () => {
    expect(pct(220, 440)).toBe("50%");
  });
});
