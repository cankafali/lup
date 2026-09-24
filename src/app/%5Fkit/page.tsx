import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PlateFrame } from "@/components/layout/PlateFrame";
import { Axis } from "@/components/primitives/Axis";
import { Button } from "@/components/primitives/Button";
import { Callout } from "@/components/primitives/Callout";
import { DimensionLine } from "@/components/primitives/DimensionLine";
import { Headline } from "@/components/primitives/Headline";
import { Lens } from "@/components/primitives/Lens";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { PaperTag } from "@/components/primitives/PaperTag";
import { Stamp } from "@/components/primitives/Stamp";

// Geçici geliştirme sayfası (Aşama 1): tüm primitives tek yerde. Prod build'de 404.

export const metadata: Metadata = { title: "Bileşen kiti" };

const TOTAL = 4;
const CELL: readonly [number, number] = [440, 550];

const COLORS = [
  ["paper", "bg-paper", "#EFEBE3"],
  ["graphite", "bg-graphite", "#161514"],
  ["lead", "bg-lead", "#8A857C"],
  ["stamp", "bg-stamp", "#C8321E"],
  ["line", "bg-line", "graphite %20"],
  ["line-strong", "bg-line-strong", "graphite %35"],
  ["grid", "bg-grid", "graphite %4.5"],
] as const;

const TR_GLYPHS = "ğ ı i ş ç ö ü â  Ğ I İ Ş Ç Ö Ü Â";
const TR_UPPER_SOURCE = "istanbul · ığdır · şişli · kâğıt · gümüş · iğne";

function KitHeading({ children }: { children: string }) {
  return (
    <MonoLabel size="l" className="mb-10 block">
      {children}
    </MonoLabel>
  );
}

function Row({
  name,
  full = false,
  children,
}: {
  name: string;
  /** İçerik tam grid genişliğinde (kolon girintili başlıklar için). */
  full?: boolean;
  children: React.ReactNode;
}) {
  if (full) {
    return (
      <div className="border-b border-line py-6">
        <MonoLabel tone="lead" className="mb-4 block">
          {name}
        </MonoLabel>
        {children}
      </div>
    );
  }
  return (
    <div className="grid-lup items-baseline border-b border-line py-6">
      <MonoLabel tone="lead" className="col-span-2 max-md:col-span-4 max-md:mb-3">
        {name}
      </MonoLabel>
      <div className="col-span-10 max-lg:col-span-6 max-md:col-span-4">{children}</div>
    </div>
  );
}

export default function KitPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main>
      {/* 01 — Renk ve tipografi */}
      <PlateFrame plate={1} total={TOTAL} className="pt-24 pb-32">
        <div className="container-lup pt-16">
          <KitHeading>01 — RENK VE TİPOGRAFİ</KitHeading>

          <div className="grid-lup mb-16 gap-y-6">
            {COLORS.map(([name, bg, value]) => (
              <div key={name} className="col-span-2 max-md:col-span-2">
                <div className={`${bg} mb-3 aspect-square border border-line`} />
                <MonoLabel className="block">{name}</MonoLabel>
                <MonoLabel size="s" tone="lead" className="block">
                  {value}
                </MonoLabel>
              </div>
            ))}
          </div>

          <Row name="DISPLAY XL" full>
            <Headline
              as="h1"
              size="xl"
              srLabel="Sönmez Kuyumculuk — Yakından bakın."
              lines={[{ text: "Yakından" }, { text: "bakın.", italic: true, indent: "cols-2", overlap: 20 }]}
            />
          </Row>
          <Row name="DISPLAY L" full>
            <Headline
              size="l"
              lines={[{ text: "Tezgâhta" }, { text: "altı parça.", italic: true, indent: "cols-2", overlap: 34 }]}
            />
          </Row>
          <Row name="DISPLAY M" full>
            <Headline
              size="m"
              lines={[{ text: "Çıplak gözle" }, { text: "görünmez.", italic: true, indent: 64 }]}
            />
          </Row>
          <Row name="DISPLAY S">
            <p className="text-display-s">Tektaş Rüya</p>
          </Row>
          <Row name="PARÇA ADI">
            <p className="text-item">Burma Yüzük</p>
          </Row>
          <Row name="GÖVDE L">
            <p className="max-w-[360px] text-body-l">
              Tırnağın ucundaki çekiç izi, iki fasetin buluştuğu çizgi. Lup bunu gösterir. Taşın
              ışığı ise ancak elinizde döndüğünde ortaya çıkar.
            </p>
          </Row>
          <Row name="GÖVDE">
            <p className="max-w-[360px] text-body text-lead">
              Tel, saç teli inceliğine kadar çekilip elle kıvrılır. Motif çizilmez; ustanın elinde
              oluşur.
            </p>
          </Row>
          <Row name="MONO L / M / S">
            <div className="flex flex-col gap-2">
              <MonoLabel size="l">SERTİFİKA · AĞIRLIK · BERRAKLIK</MonoLabel>
              <MonoLabel>{"TIRNAK 01 / 04\nØ 0.9 mm · EL İŞİ"}</MonoLabel>
              <MonoLabel size="s" tone="lead">
                ÖLÇEK 1:1 — LEVHA 01/05
              </MonoLabel>
            </div>
          </Row>
          <Row name="TÜRKÇE — SANS">
            <p className="text-display-m">{TR_GLYPHS}</p>
          </Row>
          <Row name="TÜRKÇE — SERIF İTALİK">
            <p className="font-serif text-display-m italic">{TR_GLYPHS}</p>
          </Row>
          <Row name="TÜRKÇE — MONO">
            <p className="font-mono text-display-m">{TR_GLYPHS}</p>
          </Row>
          <Row name="text-transform: uppercase">
            <div className="flex flex-col gap-2">
              <MonoLabel tone="lead">{`KAYNAK: ${TR_UPPER_SOURCE}`}</MonoLabel>
              <MonoLabel size="l" className="uppercase" data-kit-upper>
                {TR_UPPER_SOURCE}
              </MonoLabel>
              <p className="text-item uppercase">{TR_UPPER_SOURCE}</p>
            </div>
          </Row>
        </div>
      </PlateFrame>

      {/* 02 — Damga, etiket, buton */}
      <PlateFrame plate={2} total={TOTAL} className="pt-24 pb-32">
        <div className="container-lup pt-16">
          <KitHeading>02 — DAMGA, ETİKET, BUTON</KitHeading>

          <Row name="STAMP · SQUARE">
            <div className="flex flex-wrap items-center gap-4">
              {["585", "750", "916", "14K", "18K", "22 AYAR"].map((s) => (
                <Stamp key={s}>{s}</Stamp>
              ))}
              <Stamp size="m">750</Stamp>
              <Stamp size="m">18K</Stamp>
            </div>
          </Row>
          <Row name="STAMP · OVAL">
            <div className="flex flex-wrap items-center gap-4">
              <Stamp shape="oval">1987</Stamp>
              <Stamp shape="oval">USTA · M.S.</Stamp>
              <Stamp shape="oval" size="m">
                USTA · M.S.
              </Stamp>
              <Stamp shape="oval" tone="graphite">
                No. 0147
              </Stamp>
            </div>
          </Row>
          <Row name="STAMP · SABİT AÇI">
            <div className="flex items-center gap-1">
              <Stamp rotate={-2}>750</Stamp>
              <Stamp rotate={1}>18K</Stamp>
              <Stamp shape="oval" rotate={-1}>
                USTA · M.S.
              </Stamp>
            </div>
          </Row>
          <Row name="PAPERTAG">
            <div className="flex flex-wrap items-start gap-4">
              <PaperTag>LUP · 10×</PaperTag>
              <PaperTag>{"BURMA · Ø 17.2 mm\n18K · 750"}</PaperTag>
              <PaperTag size="s">TEMSİLİ GÖRSEL</PaperTag>
            </div>
          </Row>
          <Row name="BUTTON">
            <div className="flex flex-wrap items-center gap-10">
              <Button href="#kit">Randevu al</Button>
              <Button href="#kit">Mağazada 1:1 görün</Button>
            </div>
          </Row>
          <Row name="LINK">
            <div className="flex flex-wrap items-center gap-10">
              <Button href="#kit" variant="link">
                Yol tarifi
              </Button>
              <Button href="#kit" variant="link">
                Tüm parçalar mağazada
              </Button>
            </div>
          </Row>
        </div>
      </PlateFrame>

      {/* 03 — Ölçü, eksen, not */}
      <PlateFrame plate={3} total={TOTAL} className="pt-24 pb-32">
        <div className="container-lup pt-16">
          <KitHeading>03 — ÖLÇÜ, EKSEN, NOT</KitHeading>

          <div className="grid-lup gap-y-10">
            {/* Tepsi hücresi benzeri: fotoğraf + ölçü */}
            <div className="col-span-4 max-md:col-span-4">
              <div className="relative aspect-[4/5] overflow-hidden border border-line-strong">
                <Image
                  src="/images/vitrin-burma.jpg"
                  alt="Burgulu iki telden 22 ayar altın burma yüzük, kâğıt zemin üzerinde"
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover"
                  data-hires="/images/vitrin-burma.jpg"
                />
                <MonoLabel className="absolute top-5 left-6">No. 02</MonoLabel>
                <Stamp className="absolute top-[17px] right-6">916</Stamp>
                <DimensionLine viewBox={CELL} from={[127, 385]} to={[312, 385]} label="Ø 18.2 mm" />
              </div>
              <MonoLabel tone="lead" className="mt-3 block">
                YATAY · ÜST ETİKET
              </MonoLabel>
            </div>

            <div className="col-span-4 max-md:col-span-4">
              <div className="relative aspect-[4/5] border border-line-strong">
                <DimensionLine viewBox={CELL} from={[300, 178]} to={[300, 337]} label="24 mm" />
                <DimensionLine
                  viewBox={CELL}
                  from={[80, 470]}
                  to={[360, 470]}
                  label="Ø 5.10 mm  ·  ÖLÇEK 10:1"
                  labelSide="below"
                  offset={30}
                />
                <DimensionLine
                  viewBox={CELL}
                  from={[130, 120]}
                  to={[130, 360]}
                  label={"TOPLAM\n21.4 mm"}
                  labelSide="left"
                  offset={24}
                />
                <svg
                  aria-hidden
                  className="absolute inset-0 size-full text-graphite"
                  viewBox="0 0 440 550"
                  preserveAspectRatio="none"
                >
                  <Axis from={[40, 260]} to={[400, 260]} />
                  <Axis from={[220, 60]} to={[220, 420]} opacity={0.5} />
                </svg>
              </div>
              <MonoLabel tone="lead" className="mt-3 block">
                DİKEY · UZATMA ÇİZGİLİ · EKSEN
              </MonoLabel>
            </div>

            <div className="col-span-4 max-md:col-span-4">
              <div className="relative aspect-[4/5] border border-line-strong">
                <Callout viewBox={CELL} point={[140, 160]} dot="stamp" to={[300, 110]} label="TAŞ · ODAK" />
                <Callout
                  viewBox={CELL}
                  point={[120, 300]}
                  to={[300, 300]}
                  label={"TABLA\n%57 · 57 FASET"}
                  dotSize={8}
                />
                <Callout
                  viewBox={CELL}
                  point={[320, 420]}
                  to={[160, 470]}
                  label="RUNDİST"
                  labelSide="left"
                  dotSize={8}
                />
                <Callout
                  viewBox={CELL}
                  point={[90, 420]}
                  dot="ring"
                  to={[90, 360]}
                  label="LUP · 10×"
                  labelSide="above"
                  variant="tag"
                />
              </div>
              <MonoLabel tone="lead" className="mt-3 block">
                CALLOUT · STAMP / GRAPHITE / RING
              </MonoLabel>
            </div>
          </div>
        </div>
      </PlateFrame>

      {/* 04 — Lens */}
      <PlateFrame plate={4} total={TOTAL} className="pt-24 pb-32">
        <div className="container-lup pt-16">
          <KitHeading>04 — LENS</KitHeading>

          <div className="flex flex-wrap items-center gap-24">
            <Lens
              src="/images/lup-hero.jpg"
              alt="Turuncu yansımalı pırlanta fasetlerinin makro görüntüsü"
              diameter={240}
              label="10×"
            />
            <Lens
              src="/images/telkari-makro.jpg"
              alt="İnce altın tellerle örülmüş telkari motifin makro görüntüsü"
              diameter={300}
              label="10×"
              axes
            />
            <Lens
              src="/images/lup-detay.jpg"
              alt="Dört tırnaklı yuvada pırlantanın önden makro görüntüsü"
              diameter={170}
              ring={16}
              label="10×"
              labelPlacement="inside"
              axes={{ h: 40, v: 30 }}
              axesOpacity={0.4}
            />
          </div>
        </div>
      </PlateFrame>
    </main>
  );
}
