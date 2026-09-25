"use client";

import dynamic from "next/dynamic";

/**
 * İmleç lupu hidrasyondan sonra ayrı pakette (§17 JS bütçesi, K-103): klonu zaten boşta kurulur,
 * ilk etkileşimden önce kodunun yüklü olması gerekmez. Sunucuda hiçbir şey çizmez.
 */
export const Loupe = dynamic(() => import("./Loupe").then((m) => m.Loupe), { ssr: false });
