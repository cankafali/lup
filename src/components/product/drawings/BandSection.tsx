import { productPage } from "@/content/copy";
import { Axis } from "@/components/primitives/Axis";
import type { Pt } from "@/lib/overlay";
import { hatchConvex } from "./hatch";
import { fmt, pathOf, type PlateView } from "./types";

/**
 * Kesit ölçeği: 40 birim/mm (10:1). Şartnamedeki 12 birim/mm'de kesit 26×19 birim kalıp
 * ikon gibi görünüyordu (K-046).
 */
const SCALE = 40;
/** Düz yan duvarın kalınlığa oranı; üstü eliptik kubbe. */
const SIDE = 0.4;
const ARC_STEPS = 24;

/**
 * Bandın A-A kesiti (§11.2 C): "D" profil — düz iç (üstte, parmağa bakan), yuvarlak dış.
 * Kesit alanı 45° taramalı. Ölçüler: genişlik, kalınlık, yan duvar.
 */
export function bandSectionView(
  section: { width: number; thickness: number },
  center: Pt,
): PlateView {
  const [cx, cy] = center;
  const W = section.width * SCALE;
  const T = section.thickness * SCALE;
  const top = cy - T / 2;
  const side = SIDE * T;
  const rx = W / 2;
  const ry = T - side;

  // Profil çokgeni: üst kenar, sağ duvar, kubbe (sağdan sola), sol duvar.
  const dome = Array.from({ length: ARC_STEPS + 1 }, (_, i) => {
    const a = (i / ARC_STEPS) * Math.PI;
    return [cx + rx * Math.cos(a), top + side + ry * Math.sin(a)] as Pt;
  });
  const profile: Pt[] = [[cx - rx, top], [cx + rx, top], ...dome];

  const hatch = hatchConvex(profile);

  const widthY = top - 18;
  const thickX = cx + rx + 18;
  const sideX = cx - rx - 18;

  return {
    geometry: (
      <>
        <g className="text-graphite" data-draw="axis">
          <Axis from={[cx, top - 30]} to={[cx, top + T + 16]} />
        </g>
        <path d={pathOf(profile, true)} fill="none" stroke="currentColor" data-draw="outline" />
        <g stroke="currentColor" data-draw="detail">
          {hatch.map(([a, b], i) => (
            <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
          ))}
        </g>
      </>
    ),
    dims: [
      {
        from: [cx - rx, widthY],
        to: [cx + rx, widthY],
        label: fmt(section.width),
        offset: top - widthY,
      },
      {
        from: [thickX, top],
        to: [thickX, top + T],
        label: fmt(section.thickness),
        labelSide: "right",
        offset: thickX - cx,
      },
      {
        from: [sideX, top],
        to: [sideX, top + side],
        label: fmt(SIDE * section.thickness),
        labelSide: "left",
        offset: cx - rx - sideX,
      },
    ],
    notes: [{ at: [cx, top + T + 44], text: productPage.views.section, align: "center" }],
  };
}
