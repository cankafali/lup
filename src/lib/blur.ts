import { BLUR } from "@/content/blur";

/** next/image için bulanık yer tutucu; veri yoksa boş (inceleme 3.5). */
export function blurProps(src: string) {
  const blurDataURL = BLUR[src];
  return blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {};
}
