import { describe, expect, it } from "vitest";
import type { Pt } from "@/lib/overlay";
import {
  clipPolyline,
  clipToCircle,
  clipToConvex,
  HATCH_GAP,
  hatchCircle,
  hatchConvex,
  segmentsPath,
} from "./hatch";
import { pearOutline, pearPath } from "./pear";

const SQUARE: Pt[] = [
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
];
const inside = (p: Pt, eps = 1e-9) =>
  p[0] >= -eps && p[0] <= 10 + eps && p[1] >= -eps && p[1] <= 10 + eps;

describe("clipToConvex", () => {
  it("kareyi kesen yatay parçayı kenarlarda kırpar", () => {
    expect(clipToConvex(SQUARE, [-5, 5], [15, 5])).toEqual([
      [0, 5],
      [10, 5],
    ]);
  });

  it("çokgenin yönünden bağımsız", () => {
    const reversed = [...SQUARE].reverse();
    expect(clipToConvex(reversed, [-5, 5], [15, 5])).toEqual(
      clipToConvex(SQUARE, [-5, 5], [15, 5]),
    );
  });

  it("dışarıdaki parça: null", () => {
    expect(clipToConvex(SQUARE, [-5, -5], [-1, 20])).toBeNull();
  });
});

describe("clipToCircle", () => {
  it("merkezden geçen parça çap kadar kalır", () => {
    const seg = clipToCircle([0, 0], 5, [-10, 0], [10, 0]);
    expect(seg?.[0][0]).toBeCloseTo(-5);
    expect(seg?.[1][0]).toBeCloseTo(5);
  });

  it("teğet ya da dışarıda: null", () => {
    expect(clipToCircle([0, 0], 5, [-10, 5], [10, 5])).toBeNull();
    expect(clipToCircle([0, 0], 5, [-10, 8], [10, 8])).toBeNull();
  });
});

describe("tarama", () => {
  it("kare: tüm çizgiler içeride ve 45°", () => {
    const segs = hatchConvex(SQUARE);
    expect(segs.length).toBeGreaterThan(0);
    for (const [a, b] of segs) {
      expect(inside(a) && inside(b)).toBe(true);
      // dir 1: x + y sabit
      expect(a[0] + a[1]).toBeCloseTo(b[0] + b[1]);
    }
  });

  it("komşu çizgiler arası dik uzaklık HATCH_GAP", () => {
    const [s1, s2] = hatchConvex(SQUARE);
    if (!s1 || !s2) throw new Error("çizgi yok");
    const k1 = s1[0][0] + s1[0][1];
    const k2 = s2[0][0] + s2[0][1];
    expect(Math.abs(k2 - k1) / Math.SQRT2).toBeCloseTo(HATCH_GAP);
  });

  it("ters yön: x − y sabit", () => {
    for (const [a, b] of hatchConvex(SQUARE, -1)) expect(a[0] - a[1]).toBeCloseTo(b[0] - b[1]);
  });

  it("ortak ızgara: aynı çizgi ailesi iki parçada hizalı", () => {
    const right: Pt[] = [
      [10, 0],
      [20, 0],
      [20, 10],
      [10, 10],
    ];
    const step = HATCH_GAP * Math.SQRT2;
    for (const [a] of [...hatchConvex(SQUARE), ...hatchConvex(right)]) {
      const k = (a[0] + a[1]) / step;
      expect(Math.abs(k - Math.round(k))).toBeLessThan(1e-9);
    }
  });

  it("daire: tüm uçlar çemberin içinde ya da üstünde", () => {
    for (const [a, b] of hatchCircle([50, 50], 20))
      for (const p of [a, b])
        expect(Math.hypot(p[0] - 50, p[1] - 50)).toBeLessThanOrEqual(20 + 1e-9);
  });
});

describe("clipPolyline", () => {
  it("kırpma dışına çıkan çoklu çizgi iki parçaya bölünür", () => {
    const pts: Pt[] = [
      [2, 5],
      [8, 5],
      [15, 5],
      [15, 8],
      [8, 8],
      [2, 8],
    ];
    const runs = clipPolyline(pts, (a, b) => clipToConvex(SQUARE, a, b));
    expect(runs).toHaveLength(2);
    expect(runs.flat().every((p) => inside(p))).toBe(true);
  });
});

describe("segmentsPath", () => {
  it("tek path'e iki ondalıkla yazar", () => {
    expect(
      segmentsPath([
        [
          [0, 0],
          [1.234, 5],
        ],
      ]),
    ).toBe("M 0.00 0.00 L 1.23 5.00");
  });
});

describe("armut kontur", () => {
  const at: Pt = [100, 200];

  it("uç, verilen boy kadar yukarıda; alt nokta at", () => {
    const pts = pearOutline(at, 60, 40);
    const ys = pts.map((p) => p[1]);
    expect(Math.min(...ys)).toBeCloseTo(200 - 60);
    expect(Math.max(...ys)).toBeCloseTo(200, 0);
  });

  it("en geniş yer verilen en kadar", () => {
    const xs = pearOutline(at, 60, 40).map((p) => p[0]);
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(40, 0);
  });

  it("path uçtan başlar ve kapanır", () => {
    const d = pearPath(at, 60, 40);
    expect(d.startsWith("M 100 140")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
  });
});
