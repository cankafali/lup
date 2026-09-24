import { atolye, photoNote } from "@/content/copy";
import { site } from "@/content/site";
import { PlateFrame } from "@/components/layout/PlateFrame";
import { Callout } from "@/components/primitives/Callout";
import { Headline, type HeadlineLine } from "@/components/primitives/Headline";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { PhotoOverlay } from "@/components/primitives/PhotoOverlay";
import type { Pt, Side, ViewBox } from "@/lib/overlay";

// Bindirme koordinatları atolye.jpg'nin piksel uzayında (§10.4).
const IMG: ViewBox = [1264, 848];

/**
 * İkinci satır 338px içeride; birinci satırın üstünden 88px aşağıda başlar
 * (satır kutusu 0.95 × 104 = 98.8 → bindirme ≈ 11px). 88px bindirme satırları çakıştırıyor (K-030).
 */
const TITLE_LAYOUT: Pick<HeadlineLine, "indent" | "overlap">[] = [{}, { indent: 338, overlap: 11 }];

/** Notlar: nokta (görsel px) → çizgi ucu → etiket yönü (sağ üst, sol üst, aşağı). */
const NOTES: { point: Pt; to: Pt; side: Side; label: string }[] = [
  { point: [615, 358], to: [705, 288], side: "right", label: atolye.notes.ring },
  { point: [270, 173], to: [190, 113], side: "left", label: atolye.notes.loupe },
  { point: [1099, 421], to: [1099, 511], side: "below", label: atolye.notes.drawing },
];

/** 04 — Atölye (§10.4). */
export function Atolye() {
  return (
    <PlateFrame plate={4} id="atolye" labelledBy="atolye-baslik" className="pt-[110px] pb-16">
      <div className="container-lup">
        <MonoLabel className="block">{atolye.label}</MonoLabel>
        <Headline
          id="atolye-baslik"
          size="l"
          className="mt-6"
          lines={atolye.title.map((line, i) => ({ ...line, ...TITLE_LAYOUT[i] }))}
        />
      </div>

      <div className="relative mt-[50px]">
        {/* Fotoğraf sol ekran kenarına taşar: 1440'ta 960px = kenar boşluğu + 8 kolon */}
        <div className="relative w-[calc(50vw+240px)] max-lg:w-full">
          <PhotoOverlay
            src="/images/atolye.jpg"
            alt={atolye.photoAlt}
            width={IMG[0]}
            height={IMG[1]}
            sizes="(min-width: 1024px) 67vw, 100vw"
            className="aspect-[1264/848] w-full"
          >
            {NOTES.map((n) => (
              <Callout
                key={n.label}
                viewBox={IMG}
                point={n.point}
                to={n.to}
                labelSide={n.side}
                label={n.label}
                variant="tag"
                dot="ring"
                tone="paper"
              />
            ))}
          </PhotoOverlay>
          <MonoLabel size="s" tone="paper" className="absolute bottom-6 left-(--grid-margin)">
            {photoNote}
          </MonoLabel>
        </div>

        {/* İstatistik sütunu: 10–12. kolon, fotoğrafla aynı yükseklik */}
        <div className="container-lup max-lg:mt-10 lg:absolute lg:inset-0">
          <ul className="grid-lup h-full">
            <li className="col-span-3 col-start-10 flex flex-col border-b border-graphite max-lg:col-span-full max-lg:col-start-1 max-lg:flex-row">
              {site.stats.map((s) => (
                <p
                  key={s.unit}
                  className="flex flex-1 items-center border-t border-graphite text-display-l tabular-nums"
                >
                  {s.value}
                  {/* Birim: rakamın taban çizgisinde, 14px sağda (44px'lik birimin 0.318em'i) */}
                  <span className="ml-[0.318em] font-serif text-[length:calc(1em*var(--stat-unit-scale))] font-normal tracking-normal italic">
                    {s.unit}
                  </span>
                </p>
              ))}
            </li>
          </ul>
        </div>
      </div>

      {/* Dört adım */}
      <div className="container-lup mt-[100px]">
        <ol className="grid grid-cols-4 border-y border-graphite max-lg:grid-cols-2">
          {atolye.steps.map((step) => (
            <li
              key={step.label}
              className="min-h-[230px] border-graphite p-6 [&:not(:first-child)]:border-l"
            >
              <MonoLabel tone="lead" className="block">
                {step.label}
              </MonoLabel>
              <h3 className="mt-6 text-item">{step.title}</h3>
              <p className="mt-3 max-w-[268px] text-body text-lead">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </PlateFrame>
  );
}
