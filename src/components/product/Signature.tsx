/**
 * Usta imzası (§11.3): el yazısı benzeri tek path, 1.5px graphite; font değil.
 * "M." ilmeği, nokta, "Sönmez" karalaması ve alt çekiş.
 */
const SIGNATURE =
  "M6 50 C10 36 14 18 18 12 C21 8 23 14 22 24 C21 34 20 44 21 48 C24 36 30 16 34 12 C37 9 38 16 37 26 C36 36 35 44 37 48 C40 42 42 40 44 40 " +
  "M48 47 L49.5 47.8 " +
  "M66 20 C60 14 52 18 56 25 C60 32 67 36 60 44 C55 49 48 46 51 41 C58 40 64 36 70 38 C74 40 72 46 76 44 C80 42 82 36 86 38 C90 40 88 46 92 44 C96 40 98 36 102 38 C106 42 104 46 108 44 C112 40 116 37 121 40 C125 43 123 47 129 44 L141 35 C147 31 151 33 147 39 L138 46 C152 44 172 40 196 29 " +
  "M72 29 L73 29.6 M78 29 L79 29.6";

export function Signature({ label, className }: { label: string; className?: string }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 200 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={SIGNATURE} vectorEffect="non-scaling-stroke" data-signature />
    </svg>
  );
}
