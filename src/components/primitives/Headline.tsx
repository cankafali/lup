import { Fragment } from "react";
import clsx from "clsx";
import { DISPLAY_REF } from "@/lib/tokens";

/** `cols-N`: N kolon + N ara. Sayı: 1440 referansında px, başlıkla birlikte ölçeklenir. */
type Indent = `cols-${number}` | number;

export type HeadlineLine = {
  text: string;
  /** Instrument Serif Italic, başlığın 1.15 katı. Başlık başına en fazla bir. */
  italic?: boolean;
  indent?: Indent;
  /** Mobilde (< 768) girinti; verilmezse `indent` (§15: "1 kolon içeride"). */
  indentMobile?: Indent;
  /** Önceki satırın altına bindirme (1440 referansında px). */
  overlap?: number;
};

type HeadlineProps = {
  as?: "h1" | "h2" | "h3";
  size: "xl" | "l" | "m";
  lines: readonly HeadlineLine[];
  id?: string;
  /** Ekran okuyucunun okuyacağı metin (verilirse görsel satırlar gizlenir). */
  srLabel?: string;
  className?: string;
};

const SIZE = {
  xl: "text-display-xl",
  l: "text-display-l",
  m: "text-display-m",
} as const;

/** Başlık kapsayıcısının genişliğine göre N kolon + N ara. */
const cols = (n: number) =>
  `calc(${n} * ((100% - (var(--grid-cols) - 1) * var(--grid-gutter)) / var(--grid-cols) + var(--grid-gutter)))`;

/** 1440 referansındaki px değerini, akışkan başlık boyutuyla orantılı uzunluğa çevirir. */
const refPx = (px: number) => `calc(${px} * var(--hl-u))`;

function indentValue(indent: Indent | undefined) {
  if (indent === undefined) return undefined;
  if (typeof indent === "number") return refPx(indent);
  return cols(Number(indent.slice("cols-".length)));
}

/** Geist başlık + tek italik kelime (§6). İki satır tek başlık öğesinde, ekran okuyucu tek cümle okur. */
export function Headline({ as: Tag = "h2", size, lines, id, srLabel, className }: HeadlineProps) {
  if (process.env.NODE_ENV !== "production" && lines.filter((l) => l.italic).length > 1) {
    console.error(
      `Headline: bir başlıkta en fazla bir italik parça olabilir — "${lines.map((l) => l.text).join(" ")}"`,
    );
  }

  return (
    <Tag
      id={id}
      className={clsx("font-sans", SIZE[size], className)}
      style={{
        "--hl-size": `var(--text-display-${size})`,
        "--hl-u": `calc(var(--hl-size) / ${DISPLAY_REF[size]})`,
      }}
    >
      {srLabel && <span className="sr-only">{srLabel}</span>}
      <span className="block" aria-hidden={srLabel ? true : undefined}>
        {lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span
              data-headline-mask
              className="ml-[var(--hl-indent,0px)] block max-md:ml-[var(--hl-indent-m,var(--hl-indent,0px))]"
              style={{
                "--hl-indent": indentValue(line.indent),
                "--hl-indent-m": indentValue(line.indentMobile),
                marginTop: line.overlap ? `calc(-1 * ${refPx(line.overlap)})` : undefined,
              }}
            >
              <span
                data-headline-line
                className={clsx(
                  "block whitespace-nowrap",
                  line.italic &&
                    "font-serif text-[length:calc(var(--hl-size)*var(--italic-scale))] leading-none font-normal tracking-normal italic",
                )}
              >
                {line.text}
              </span>
            </span>
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
