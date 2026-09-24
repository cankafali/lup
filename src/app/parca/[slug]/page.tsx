import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productPage } from "@/content/copy";
import { getProduct, products } from "@/content/products";
import { PlateMotion } from "@/components/motion/PlateMotion";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Certificate } from "@/components/product/Certificate";
import { TechnicalPlate } from "@/components/product/TechnicalPlate";

// Yalnızca 6 parça statik üretilir; bilinmeyen slug 404 (§11).
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/parca/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return { title: `${product.name} — No. ${product.certNo}`, description: product.description };
}

/** Ürün detay (§11): solda teknik levha, sağda sertifika. */
export default async function ProductPage({ params }: PageProps<"/parca/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  return (
    <main data-intro className="pt-24 max-md:pt-16">
      <PlateMotion />
      <div className="container-lup flex items-baseline justify-between py-4">
        <Link
          href={productPage.back.href}
          className="font-mono text-mono underline-offset-4 hover:underline"
        >
          {productPage.back.label}
        </Link>
        <MonoLabel size="s" tone="lead">
          {productPage.plate(product.no, products.length)}
        </MonoLabel>
      </div>

      <div className="container-lup">
        <div className="grid-lup gap-y-12 lg:min-h-[calc(100svh-96px)]">
          {/* Sol: teknik levha (1–7. kolon + sol kenar boşluğu) */}
          <div className="col-span-7 max-lg:col-span-full lg:-ml-(--grid-margin)">
            <TechnicalPlate product={product} total={products.length} />
          </div>
          {/* Sağ: sertifika (8–12. kolon), masaüstünde sabit; aradaki 1px dikey çizgi */}
          <div className="relative col-span-5 col-start-8 max-lg:col-span-full max-lg:col-start-1 lg:before:absolute lg:before:inset-y-0 lg:before:-left-[calc(var(--grid-gutter)/2)] lg:before:w-px lg:before:bg-graphite">
            <div data-loupe-sticky className="lg:sticky lg:top-[120px] lg:pb-16">
              <Certificate product={product} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
