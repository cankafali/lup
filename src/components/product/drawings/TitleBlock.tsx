import clsx from "clsx";
import { MonoLabel } from "@/components/primitives/MonoLabel";

type TitleBlockProps = {
  cells: readonly { label: string; value: string }[];
  /** row: tek satır 5 hücre (levhada). grid: 2 sütun (mobilde levhanın altında). */
  layout?: "row" | "grid";
  className?: string;
};

/** Antet tablosu (§11.2 D): 1px çizgili, 5 hücre; etiket Mono S lead, değer Mono L graphite. */
export function TitleBlock({ cells, layout = "row", className }: TitleBlockProps) {
  return (
    <dl
      data-plate-meta
      className={clsx(
        "grid border-graphite bg-paper",
        layout === "row"
          ? "grid-cols-[2fr_1fr_1.4fr_1fr_1fr] border"
          : "grid-cols-2 border-t border-l",
        className,
      )}
    >
      {cells.map((cell, i) => (
        <div
          key={cell.label}
          className={clsx(
            "border-graphite px-3 py-2",
            layout === "row" ? "[&:not(:first-child)]:border-l" : "border-r border-b",
            // Tek kalan son hücre iki sütunu kaplar
            layout === "grid" && i === cells.length - 1 && cells.length % 2 === 1 && "col-span-2",
          )}
        >
          <dt>
            <MonoLabel size="s" tone="lead" className="block">
              {cell.label}
            </MonoLabel>
          </dt>
          <dd>
            <MonoLabel size="l" className="mt-1 block whitespace-nowrap">
              {cell.value}
            </MonoLabel>
          </dd>
        </div>
      ))}
    </dl>
  );
}
