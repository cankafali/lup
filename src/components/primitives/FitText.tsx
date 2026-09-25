"use client";

import { useLayoutEffect, useRef } from "react";

type FitTextProps = {
  children: string;
  /** Sunucuda (ölçümden önce) kullanılan tahmini boyut. */
  estimate: string;
  className?: string;
};

/** Ölçüm için kullanılan sabit boyut (px); yalnızca oran hesabına girer. */
const PROBE = 100;
/** Negatif harf aralığının son harften taşmasını dengeleyen sağ boşluk (em); span'deki pr ile aynı. */
const PAD_EM = 0.05;

/**
 * Metni kapsayıcının genişliğine tam sığdırır (§10.6 wordmark). Sunucuda tahmini boyutla
 * görünür gelir (JS kapalıyken de okunur), boyamadan önce düzeltilir; kapsayıcı genişliği ya da
 * fontlar değişince yeniden hesaplanır. Doğal genişlik canvas ile ölçülür, kapsayıcı genişliği
 * ResizeObserver'dan gelir: DOM yerleşimi hiç zorlanmaz (§17, K-096).
 */
export function FitText({ children, estimate, className }: FitTextProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;
    const ctx = document.createElement("canvas").getContext("2d");
    let width = -1;

    /** PROBE px'teki genişlik: glifler + harf aralığı + sağ boşluk. */
    const natural = () => {
      if (!ctx) return 0;
      const cs = getComputedStyle(text);
      const size = parseFloat(cs.fontSize) || PROBE;
      const spacing = (parseFloat(cs.letterSpacing) || 0) / size;
      ctx.font = `${cs.fontWeight} ${PROBE}px ${cs.fontFamily}`;
      const glyphs = ctx.measureText(children).width;
      return glyphs + spacing * PROBE * [...children].length + PAD_EM * PROBE;
    };
    const fit = () => {
      const n = natural();
      if (width > 0 && n > 0) text.style.fontSize = `${(PROBE * width) / n}px`;
    };

    const ro = new ResizeObserver(([entry]) => {
      const next = entry?.contentRect.width ?? -1;
      if (next === width) return;
      width = next;
      fit();
    });
    ro.observe(box);
    void document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div ref={boxRef} className={className}>
      {/* Negatif harf aralığı son harften sonra da uygulanır; sağ boşluk harfin taşmasını dengeler. */}
      <span
        ref={textRef}
        className="inline-block pr-[0.05em] whitespace-nowrap"
        style={{ fontSize: estimate }}
      >
        {children}
      </span>
    </div>
  );
}
