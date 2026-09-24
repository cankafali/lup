"use client";

import { useEffect, useSyncExternalStore } from "react";
import { refreshLoupe } from "@/components/loupe/useLoupe";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { PulseDot } from "@/components/primitives/PulseDot";
import { getOpenStatus } from "@/lib/openStatus";

const MINUTE = 60_000;

/** Her dakika başında haber veren saat. */
function subscribe(onTick: () => void) {
  let interval: number | undefined;
  const timeout = window.setTimeout(
    () => {
      onTick();
      interval = window.setInterval(onTick, MINUTE);
    },
    MINUTE - (Date.now() % MINUTE),
  );
  return () => {
    window.clearTimeout(timeout);
    window.clearInterval(interval);
  };
}

const getMinute = () => Math.floor(Date.now() / MINUTE);
const getServerMinute = () => null;

type OpenStatusProps = {
  /** Sunucuda ve hidrasyonda gösterilen metin: çalışma saatleri (§10.5). */
  fallback: string;
};

/** "Şu an açık / kapalı" (§10.5). Sunucuda saat bilinmez; mount sonrası İstanbul saatine göre hesaplanır. */
export function OpenStatus({ fallback }: OpenStatusProps) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  const status = minute === null ? null : getOpenStatus(new Date(minute * MINUTE));
  const label = status ? status.label : fallback;

  // Metin değişince lupun kopyası da güncellensin (§9.5)
  useEffect(() => {
    refreshLoupe();
  }, [label]);

  return (
    <p className="flex items-center gap-2">
      <PulseDot active={status?.open ?? false} />
      <MonoLabel>{label}</MonoLabel>
    </p>
  );
}
