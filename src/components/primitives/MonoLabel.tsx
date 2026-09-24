import clsx from "clsx";

type MonoLabelProps = React.ComponentPropsWithoutRef<"span"> & {
  size?: "s" | "m" | "l";
  tone?: "graphite" | "lead" | "stamp" | "paper";
};

const SIZE = { s: "text-mono-s", m: "text-mono", l: "text-mono-l" } as const;

const TONE = {
  graphite: "text-graphite",
  lead: "text-lead",
  stamp: "text-stamp",
  paper: "text-paper",
} as const;

/**
 * Geist Mono etiket (§8.2). Satır kırılımı `\n` ile.
 * Metin büyük harfle yazılır; text-transform yok, çünkü birimler (mm, g, ct) ve "No." küçük kalır.
 */
export function MonoLabel({
  size = "m",
  tone = "graphite",
  className,
  ...rest
}: MonoLabelProps) {
  return (
    <span
      className={clsx("font-mono whitespace-pre-line", SIZE[size], TONE[tone], className)}
      {...rest}
    />
  );
}
