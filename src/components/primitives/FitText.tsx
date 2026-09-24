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

/**
 * Metni kapsayıcının genişliğine tam sığdırır (§10.6 wordmark). Sunucuda tahmini boyutla
 * görünür gelir (JS kapalıyken de okunur), boyamadan önce ölçülüp düzeltilir; kapsayıcı
 * genişliği ya da fontlar değişince yeniden ölçülür.
 */
export function FitText({ children, estimate, className }: FitTextProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;
    let lastWidth = -1;

    const fit = (force = false) => {
      const target = box.clientWidth;
      if (!force && target === lastWidth) return;
      lastWidth = target;
      text.style.fontSize = `${PROBE}px`;
      const natural = text.getBoundingClientRect().width;
      if (natural > 0) text.style.fontSize = `${(PROBE * target) / natural}px`;
    };

    fit(true);
    const ro = new ResizeObserver(() => fit());
    ro.observe(box);
    document.fonts?.ready.then(() => fit(true));
    return () => ro.disconnect();
  }, []);

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
