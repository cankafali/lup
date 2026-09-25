import Link from "next/link";
import { nav } from "@/content/copy";
import { NavMotion } from "@/components/motion/lazy";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { NavMenu } from "./NavMenu";

/**
 * Üst gezinme (§8.9). Zemin tam kâğıt, bulanık/yarı saydam bant yok. Kaydırmada gizlenip
 * geri gelir (NavMotion). Mobilde (< 768) 64px; bölüm linkleri ve randevu yerine "MENÜ".
 */
export function Nav() {
  return (
    <header data-loupe-hide data-loupe-off className="fixed inset-x-0 top-0 z-20 bg-paper">
      <NavMotion />
      <div className="container-lup">
        <nav
          aria-label={nav.label}
          className="grid-lup h-24 items-center border-b border-line-strong max-md:h-16"
        >
          <Link
            href="/"
            className="col-span-5 flex min-h-11 flex-col justify-center max-lg:col-span-3 max-md:col-span-2"
          >
            <span className="block text-body-l leading-none font-medium tracking-item">
              {nav.brand}
            </span>
            <MonoLabel size="s" tone="lead" className="mt-1.5 block">
              {nav.brandSub}
            </MonoLabel>
          </Link>

          <ul className="col-span-5 col-start-6 flex gap-[3ch] font-mono text-mono max-lg:col-span-3 max-lg:col-start-4 max-md:hidden">
            {nav.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="tap flex gap-[1ch] hover:underline">
                  <span className="text-lead">{link.no}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={nav.cta.href}
            className="col-span-2 col-start-11 tap justify-self-end font-mono text-mono text-stamp hover:underline max-lg:col-start-7 max-md:hidden"
          >
            {nav.cta.label}
          </Link>

          <NavMenu className="col-span-2 col-start-3 justify-self-end md:hidden" />
        </nav>
      </div>
    </header>
  );
}
