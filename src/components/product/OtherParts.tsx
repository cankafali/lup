import { productPage } from "@/content/copy";
import { products, type Product } from "@/content/products";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { TrayCell } from "@/components/sections/TrayCell";
import { DragScroll } from "./DragScroll";

/**
 * Diğer parçalar (§11.4): 1px çizgi, "DİĞER PARÇALAR", mevcut parça hariç 5 parça; vitrin
 * hücresinin küçük hali (240px, 4:5) yatay kayan şeritte.
 */
export function OtherParts({ current }: { current: Product }) {
  const others = products.filter((p) => p.slug !== current.slug);

  return (
    <section aria-labelledby="diger-parcalar" className="mt-24 pb-24 max-md:mt-16 max-md:pb-16">
      <div className="container-lup">
        <h2 id="diger-parcalar" className="border-t border-line-strong pt-6">
          <MonoLabel>{productPage.others}</MonoLabel>
        </h2>
      </div>
      {/* Şerit ekran kenarına kadar kayar; ilk hücre içerik kabının kenarıyla hizalı başlar */}
      <DragScroll className="mt-6 [scroll-padding-inline:var(--strip-inset)] [--strip-inset:max(var(--grid-margin),calc((100%_-_var(--grid-max))_/_2))]">
        <ul className="flex w-max px-(--strip-inset)">
          {others.map((p) => (
            <li
              key={p.slug}
              className="w-60 shrink-0 snap-start border-y border-r border-graphite first:border-l"
            >
              <TrayCell product={p} compact />
            </li>
          ))}
        </ul>
      </DragScroll>
    </section>
  );
}
