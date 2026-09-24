import { certificate as c } from "@/content/copy";
import type { Product } from "@/content/products";
import { Button } from "@/components/primitives/Button";
import { MonoLabel } from "@/components/primitives/MonoLabel";
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

/** Sağ sütundaki sertifika (§11.3). Sayfanın tek odak kırmızısı butondur (+ Nav'daki randevu). */
export function Certificate({ product: p }: { product: Product }) {
  // "18K · 750" → "18K" (ayar damgasının yanındaki ikinci damga)
  const karatShort = p.karat.label.split(" · ")[0] ?? p.karat.label;

  return (
    <article data-certificate className="border border-graphite bg-paper p-10 max-md:p-6">
      <header className="flex items-baseline justify-between border-b border-graphite pb-3">
        <MonoLabel size="l">{c.title}</MonoLabel>
        <MonoLabel size="l">{c.no(p.certNo)}</MonoLabel>
      </header>

      <h1 className="mt-8 text-display-s">{p.name}</h1>
      <p className="mt-2 font-serif text-subtitle italic">{p.subtitle}</p>
      <p className="mt-6 text-body text-lead">{p.description}</p>

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

      <Button href={waLink(p.whatsappMessage)} external className="mt-8 w-full">
        {c.cta}
      </Button>

      <p className="mt-4 flex items-center gap-2">
        <span aria-hidden data-status-dot className="size-1.5 shrink-0 rounded-full bg-graphite" />
        <MonoLabel>{c.status[p.status]}</MonoLabel>
      </p>

      <MonoLabel size="s" tone="lead" className="mt-8 block">
        {c.note}
      </MonoLabel>
    </article>
  );
}
