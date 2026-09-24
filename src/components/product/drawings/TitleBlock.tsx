import clsx from "clsx";
import { MonoLabel } from "@/components/primitives/MonoLabel";

type TitleBlockProps = {
  cells: readonly { label: string; value: string }[];
  className?: string;
};

/** Antet tablosu (§11.2 D): 1px çizgili, 5 hücre; etiket Mono S lead, değer Mono L graphite. */
export function TitleBlock({ cells, className }: TitleBlockProps) {
  return (
    <dl
      className={clsx(
        "grid grid-cols-[2fr_1fr_1.4fr_1fr_1fr] border border-graphite bg-paper",
        className,
      )}
    >
      {cells.map((cell) => (
        <div key={cell.label} className="border-graphite px-3 py-2 [&:not(:first-child)]:border-l">
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
