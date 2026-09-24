import clsx from "clsx";
import { certificate as c } from "@/content/copy";
import type { Product } from "@/content/products";
import { Button } from "@/components/primitives/Button";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { PulseDot } from "@/components/primitives/PulseDot";
import { Stamp } from "@/components/primitives/Stamp";
import { waLink } from "@/lib/whatsapp";
import { Signature } from "./Signature";

/** Özellik satırları; ürünün taşımadığı bilgiler (taş, kesim…) atlanır. */
function rowsOf(p: Product): [string, string][] {
  const s = p.stone;
  const rows: [string, string | undefined][] = [
    [c.rows.karat, p.karat.label],
    [c.rows.weight, `${p.weightG} g`],
    [c.rows.stone, s && `${s.type}, ${s.shape}`],
    [c.rows.carat, s?.carat],
    [c.rows.color, s?.color],
    [c.rows.clarity, s?.clarity],
    [c.rows.cut, s?.cut],
    [c.rows.size, p.size],
    [c.rows.status, p.status],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

type CertificateProps = {
  product: Product;
  /**
   * all: tam sertifika (masaüstü, tablet). Mobilde (§15) ikiye bölünür: head (no + ad + alt başlık,
   * levhanın üstünde) ve body (açıklama ve satırlar, levhanın altında); buton ayrıca alta yapışır.
   */
  part?: "all" | "head" | "body";
  className?: string;
};

/** WhatsApp randevu butonu (§11.3): sayfanın tek odak kırmızısı (+ Nav'daki randevu). */
export function CertificateCta({
  product: p,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <Button href={waLink(p.whatsappMessage)} external className={clsx("w-full", className)}>
      {c.cta}
    </Button>
  );
}

/** Sertifika (§11.3): kâğıt üzerinde 1px graphite çerçeve, iç boşluk 40px. */
export function Certificate({ product: p, part = "all", className }: CertificateProps) {
  // "18K · 750" → "18K" (ayar damgasının yanındaki ikinci damga)
  const karatShort = p.karat.label.split(" · ")[0] ?? p.karat.label;
  const head = part !== "body";
  const body = part !== "head";

  return (
    <article
      data-certificate
      className={clsx(
        "bg-paper",
        part === "head" ? "pb-8" : "border border-graphite p-10 max-md:p-6",
        className,
      )}
    >
      {head && (
        <>
          <header className="flex items-baseline justify-between border-b border-graphite pb-3">
            <MonoLabel size="l">{c.title}</MonoLabel>
            <MonoLabel size="l">{c.no(p.certNo)}</MonoLabel>
          </header>

          <h1 className="mt-8 text-display-s max-md:mt-6">{p.name}</h1>
          <p className="mt-2 font-serif text-subtitle italic">{p.subtitle}</p>
        </>
      )}

      {body && (
        <>
          <p className={clsx("text-body text-lead", head && "mt-6")}>{p.description}</p>

          <dl className="mt-8 border-t border-line">
            {rowsOf(p).map(([label, value]) => (
              <div
                key={label}
                data-cert-row
                className="flex h-11 items-center justify-between gap-6 border-b border-line"
              >
                <dt>
                  <MonoLabel tone="lead">{label}</MonoLabel>
                </dt>
                <dd className="text-right">
                  <MonoLabel>{value}</MonoLabel>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid grid-cols-2 items-end gap-6">
            <div>
              <Signature label={c.signatureLabel} className="h-14 w-auto text-graphite" />
              <MonoLabel size="s" className="mt-2 block">
                {c.master}
              </MonoLabel>
            </div>
            <div aria-hidden className="flex items-center justify-end">
              <Stamp rotate={-2}>{p.karat.hallmark}</Stamp>
              <Stamp rotate={1} className="-ml-1">
                {karatShort}
              </Stamp>
              <Stamp shape="oval" rotate={-1} className="-ml-1">
                {c.masterStamp}
              </Stamp>
            </div>
          </div>

          {/* Mobilde buton sertifikanın içinde değil, sayfanın altına yapışık (CertificateCta) */}
          {part === "all" && <CertificateCta product={p} className="mt-8" />}

          <p className="mt-4 flex items-center gap-2">
            <PulseDot active={p.status === "Vitrinde"} />
            <MonoLabel>{c.status[p.status]}</MonoLabel>
          </p>

          <MonoLabel size="s" tone="lead" className="mt-8 block">
            {c.note}
          </MonoLabel>
        </>
      )}
    </article>
  );
}
