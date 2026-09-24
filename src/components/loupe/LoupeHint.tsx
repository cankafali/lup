"use client";

import { useEffect, useSyncExternalStore } from "react";
import clsx from "clsx";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { hintSeen, subscribeHint } from "./hint";
import { refreshLoupe } from "./useLoupe";

/**
 * Dokunmatik cihazlarda ilk ziyaret ipucu (§9.6). Lup bir kez açılınca bir daha gösterilmez.
 * Sunucuda "görülmedi" varsayılır; ince imleçli (fare) cihazlarda CSS ile gizli.
 */
export function LoupeHint({ text, className }: { text: string; className?: string }) {
  const seen = useSyncExternalStore(subscribeHint, hintSeen, () => false);

  // İpucu kalkınca lupun kopyasında da kalmasın (§9.5)
  useEffect(() => {
    if (seen) refreshLoupe();
  }, [seen]);

  if (seen) return null;
  return (
    <MonoLabel
      size="s"
      tone="lead"
      data-loupe-hint
      className={clsx("hidden [@media(pointer:coarse)]:block", className)}
    >
      {text}
    </MonoLabel>
  );
}
