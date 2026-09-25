"use client";

import { useRef, type ComponentProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { openPart } from "@/lib/partTransition";

type PartLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & { href: string };

/** Tepsi ve şerit hücresinin linki: ürün sayfasına görünüm geçişiyle (§11.5). */
export function PartLink({ href, ...props }: PartLinkProps) {
  const router = useRouter();
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      {...props}
      ref={ref}
      href={href}
      onNavigate={(e) => {
        if (ref.current && openPart(router, href, ref.current)) e.preventDefault();
      }}
    />
  );
}
