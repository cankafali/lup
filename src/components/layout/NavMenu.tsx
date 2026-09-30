"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import clsx from "clsx";
import { nav } from "@/content/copy";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { ANCHOR_EVENT, useLenis } from "@/lib/lenis";

/**
 * Mobil menü (§8.9): Nav'ın sağında "MENÜ" → tam ekran kâğıt panel; bölümler Display M boyutunda,
 * numaralarıyla alt alta. Panel `body`'ye açılır (Nav kaydırmada transform aldığı için içinde kalamaz).
 * Açıkken sayfa kaymaz; Escape ya da bir bölüm seçilince kapanır, odak düğmeye döner.
 */
export function NavMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const panelId = useId();
  const button = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    // Odak ve ekran okuyucu panelde kalsın: arka plan etkisiz (panel body'de, #lup-content dışında)
    const content = document.getElementById("lup-content");
    content?.setAttribute("inert", "");
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // Lenis, kaydırma başlamadan açılmalı: start() sürmekte olan scrollTo animasyonunu sıfırlar.
    // inert de hemen kalkar: anchor işleyicisi birazdan odağı bölüme taşıyacak
    const onAnchor = () => {
      content?.removeAttribute("inert");
      lenis?.start();
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(ANCHOR_EVENT, onAnchor);
    const trigger = button.current;
    return () => {
      content?.removeAttribute("inert");
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(ANCHOR_EVENT, onAnchor);
      // Bölüme gidildiyse odak orada kalır (anchor işleyicisi taşıdı); yoksa düğmeye döner
      const active = document.activeElement;
      if (!active || active === document.body) trigger?.focus();
    };
  }, [open, lenis]);

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
        className={clsx("tap font-mono text-mono", className)}
      >
        {nav.menu}
      </button>

      {open &&
        createPortal(
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={nav.menuLabel}
            data-loupe-off
            className="fixed inset-0 z-40 flex flex-col bg-paper"
          >
            <div className="container-lup">
              <div className="flex h-16 items-center justify-between border-b border-line-strong">
                <span className="text-body-l leading-none font-medium tracking-item">
                  {nav.brand}
                </span>
                <button
                  ref={close}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="tap font-mono text-mono"
                >
                  {nav.close}
                </button>
              </div>
            </div>

            <nav aria-label={nav.menuLabel} className="container-lup flex-1 pt-10">
              <ul className="flex flex-col gap-6">
                {nav.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4"
                    >
                      <MonoLabel tone="lead">{link.no}</MonoLabel>
                      <span className="text-display-m">{link.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="container-lup pb-[max(24px,env(safe-area-inset-bottom))]">
              <Link
                href={nav.cta.href}
                onClick={() => setOpen(false)}
                className="tap font-mono text-mono text-stamp"
              >
                {nav.cta.label} <span aria-hidden>{nav.cta.arrow}</span>
              </Link>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
