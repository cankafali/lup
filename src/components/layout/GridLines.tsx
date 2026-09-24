const MAX_COLS = 12;

/**
 * Zemindeki kolon çizgileri (§7): her kolonun iki kenarında 1px çizgi.
 * Masaüstü 12, tablet 8, mobil 4 kolon; fazla kolonlar gizlenir.
 */
export function GridLines() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" data-grid-lines>
      <div className="container-lup h-full">
        <div className="grid-lup h-full">
          {Array.from({ length: MAX_COLS }, (_, i) => (
            <span
              key={i}
              className="h-full border-x border-grid max-lg:nth-[n+9]:hidden max-md:nth-[n+5]:hidden"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
