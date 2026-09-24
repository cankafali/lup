import { site } from "@/content/site";

/** Hazır mesajlı wa.me linki (§12.3); mesajsız çağrılırsa yalnızca sohbet açılır. */
export const waLink = (message?: string) =>
  `https://wa.me/${site.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
