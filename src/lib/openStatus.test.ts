import { describe, expect, it } from "vitest";
import { getOpenStatus } from "./openStatus";

// İstanbul UTC+3: 07:00Z = 10:00 yerel. 28.09.2026 Pazartesi.
const at = (iso: string) => getOpenStatus(new Date(iso));

describe("getOpenStatus", () => {
  it("Salı 10:00 açık", () => {
    expect(at("2026-09-29T07:00:00Z")).toEqual({ open: true, label: "ŞU AN AÇIK" });
  });

  it("Salı 09:59 kapalı, bugün açılır", () => {
    const s = at("2026-09-29T06:59:00Z");
    expect(s.open).toBe(false);
    expect(s.label).toBe("ŞU AN KAPALI — SALI 10:00'DA AÇILIR");
  });

  it("Salı 18:59 açık, 19:00 kapalı ve Çarşamba açılır", () => {
    expect(at("2026-09-29T15:59:00Z").open).toBe(true);
    const s = at("2026-09-29T16:00:00Z");
    expect(s.open).toBe(false);
    expect(s.label).toContain("ÇARŞAMBA");
  });

  it("Cumartesi 19:00 kapalı, Salı açılır (Pazar ve Pazartesi kapalı)", () => {
    const s = at("2026-10-03T16:00:00Z");
    expect(s.open).toBe(false);
    expect(s.label).toContain("SALI");
  });

  it("Pazar ve Pazartesi gün içinde kapalı, Salı açılır", () => {
    for (const iso of ["2026-10-04T09:00:00Z", "2026-09-28T09:00:00Z"]) {
      const s = at(iso);
      expect(s.open).toBe(false);
      expect(s.label).toContain("SALI");
    }
  });

  it("UTC gün dönümü: Pazartesi 23:30Z = Salı 02:30 yerel, bugün açılır", () => {
    const s = at("2026-09-28T23:30:00Z");
    expect(s.open).toBe(false);
    expect(s.label).toContain("SALI");
  });

  it("Cuma gecesi 23:59 yerel: Cumartesi açılır", () => {
    expect(at("2026-10-02T20:59:00Z").label).toContain("CUMARTESİ");
  });
});
