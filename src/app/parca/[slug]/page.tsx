import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productPage } from "@/content/copy";
import { getProduct, products } from "@/content/products";
import { PlateMotion } from "@/components/motion/lazy";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Certificate, CertificateCta } from "@/components/product/Certificate";
import { TitleBlock } from "@/components/product/drawings/TitleBlock";
import { OtherParts } from "@/components/product/OtherParts";
import { PlateWindow } from "@/components/product/PlateWindow";
import { plateCrops, TechnicalPlate, titleCells } from "@/components/product/TechnicalPlate";

// Yalnızca 6 parça statik üretilir; bilinmeyen slug 404 (§11).
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: PageProps<"/parca/[slug]">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const title = `${product.name} — No. ${product.certNo}`;
  // Alt segmentteki openGraph üsttekinin yerine geçer: paylaşım görseli ve site adı taşınır
  const { openGraph } = await parent;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/parca/${product.slug}` },
    openGraph: { ...openGraph, title, description: product.description },
  };
}

/** Ürün detay (§11): solda teknik levha, sağda sertifika. */
export default async function ProductPage({ params }: PageProps<"/parca/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  return (
    <main id="icerik" tabIndex={-1} data-intro className="pt-(--nav-h)">
      <PlateMotion />
      <div className="container-lup flex items-baseline justify-between py-4">
        <Link
          href={productPage.back.href}
          className="tap font-mono text-mono underline-offset-4 hover:underline"
        >
          <span aria-hidden>{productPage.back.arrow}</span> {productPage.back.label}
        </Link>
        <MonoLabel size="s" tone="lead">
          {productPage.plate(product.no, products.length)}
        </MonoLabel>
      </div>

      {/* Mobil (§15): önce sertifika başlığı; ilk boyamada hazır, LCP JS'i beklemez (K-097) */}
      <div data-intro-keep className="container-lup md:hidden">
        <Certificate product={product} part="head" />
      </div>

      <div className="container-lup">
        <div className="grid-lup gap-y-12 lg:min-h-[calc(100svh-96px)]">
          {/* Sol: teknik levha (1–7. kolon + sol kenar boşluğu); tablet tek sütun */}
          <div className="col-span-7 max-lg:col-span-full lg:-ml-(--grid-margin)">
            <div className="max-md:hidden">
              <TechnicalPlate product={product} total={products.length} />
            </div>
            {/* Mobil: levha parçalara bölünür (etiketler 9px'in altına inmesin) */}
            <div className="flex flex-col gap-6 md:hidden">
              {plateCrops(product.drawingSpec).map((crop, i) => (
                <PlateWindow key={crop.join()} crop={crop}>
                  <TechnicalPlate
                    product={product}
                    total={products.length}
                    windowed
                    decorative={i > 0}
                  />
                </PlateWindow>
              ))}
              <TitleBlock layout="grid" cells={titleCells(product)} />
            </div>
          </div>
          {/* Sağ: sertifika (8–12. kolon), masaüstünde sabit; aradaki 1px dikey çizgi */}
          <div className="relative col-span-5 col-start-8 max-lg:col-span-full max-lg:col-start-1 lg:before:absolute lg:before:inset-y-0 lg:before:-left-[calc(var(--grid-gutter)/2)] lg:before:w-px lg:before:bg-graphite">
            <div data-loupe-sticky className="lg:sticky lg:top-[120px] lg:pb-16">
              <Certificate product={product} className="max-md:hidden" />
              <Certificate product={product} part="body" className="md:hidden" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobil: buton alt kenara sabit (§15), güvenli alan boşluğuyla */}
      <div
        data-intro-keep
        className="sticky bottom-0 z-10 mt-8 bg-paper pt-3 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden"
      >
        <div className="container-lup">
          <CertificateCta product={product} />
        </div>
      </div>

      <OtherParts current={product} />
    </main>
  );
}
