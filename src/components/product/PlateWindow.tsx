import clsx from "clsx";
import { PLATE } from "./drawings/types";

type PlateWindowProps = {
  /** Levhanın gösterilecek bölgesi (levha birimi): [x, y, genişlik, yükseklik]. */
  crop: readonly [number, number, number, number];
  children: React.ReactNode;
  className?: string;
};

/**
 * Levhadan bir pencere (§15: mobilde levha parçalara bölünür). İçeride levha olduğu gibi durur;
 * pencere onu büyütüp kırpar. Böylece çizim, ölçü etiketleri ve lup aynı bileşenden gelir,
 * yalnızca ölçek artar (etiketler 9px'in altına inmesin).
 */
export function PlateWindow({ crop, children, className }: PlateWindowProps) {
  const [x, y, w, h] = crop;
  const [W] = PLATE;
  return (
    <div
      data-plate-window
      className={clsx("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <div
        className="absolute"
        style={{
          width: `${(W / w) * 100}%`,
          left: `${(-x / w) * 100}%`,
          top: `${(-y / h) * 100}%`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
