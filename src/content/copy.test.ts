import { describe, expect, it } from "vitest";
import { hero, makro, timeSuffix } from "./copy";
import { getProduct } from "./products";

describe("timeSuffix", () => {
  it.each([
    ["10:00", "DA"],
    ["11:00", "DE"],
    ["12:00", "DE"],
    ["13:00", "TE"],
    ["16:00", "DA"],
    ["19:00", "DA"],
    ["20:00", "DE"],
    ["09:00", "DA"],
    ["09:15", "TE"],
    ["08:30", "DA"],
    ["13:40", "TA"],
    ["20:50", "DE"],
    ["00:00", "DA"],
  ])("%s → %s", (time, suffix) => {
    expect(timeSuffix(time)).toBe(suffix);
  });
});

// Hero ve 10× metinleri Tektaş verisinden türetiliyor (K-047'deki ayrışma yinelenmesin)
describe("Tektaş ölçüleri", () => {
  const p = getProduct("tektas-ruya");
  const spec = p?.drawingSpec;
  if (spec?.kind !== "solitaire") throw new Error("Tektaş verisi yok");

  it("taş çapı hero, lup notu ve 10× bölümünde aynı", () => {
    expect(hero.overlay.stone).toBe(`Ø ${spec.stone} mm`);
    expect(hero.lens.caption).toContain(`Ø ${spec.stone} mm`);
    expect(makro.diameter).toContain(`Ø ${spec.stone.toFixed(2)} mm`);
  });

  it("bant notu kesit genişliğinden", () => {
    expect(hero.overlay.band).toContain(`${spec.section.width} mm`);
  });
});
