/**
 * Durum noktası (§10.5, §11.3): graphite Ø6; `active` iken yavaş nabız (opacity 1 → 0.35, 1.6 s,
 * yumuşak, gidip gelen). CSS animasyonu (globals.css `pulse-dot`): bileşimci iş parçacığında,
 * JS gerektirmez (K-103). Reduced motion'da sabit.
 */
export function PulseDot({ active = true }: { active?: boolean }) {
  return (
    <span
      aria-hidden
      data-status-dot
      data-open={active || undefined}
      className="size-1.5 shrink-0 rounded-full bg-graphite"
    />
  );
}
