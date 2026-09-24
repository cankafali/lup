"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DESKTOP, MOTION } from "./helpers";

type Conditions = { motion: boolean; desktop: boolean };
type Setup = (root: HTMLElement, conditions: Conditions) => void | (() => void);

/**
 * Bölüm animasyonu: bileşen kendi bölümüne boş bir çapa (`<span hidden>`) koyar; çapanın ebeveyni
 * kapsamdır. `gsap.matchMedia` ile yalnızca hareket izni varken kurulur (§14.2); useGSAP söküm yapar.
 */
export function useMotion(setup: Setup) {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.parentElement;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add({ motion: MOTION, desktop: DESKTOP }, (ctx) => {
      const { motion, desktop } = ctx.conditions as Conditions;
      if (!motion) return;
      return setup(root, { motion, desktop });
    });
    return () => mm.revert();
  });

  return anchor;
}
