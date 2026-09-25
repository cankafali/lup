"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Çekirdek: Lenis ve lup kare döngüsü (ticker), küçük tweens. ScrollTrigger, DrawSVG ve bölüm
// animasyonları hidrasyondan sonra ayrı pakette gelir (lib/scroll, motion/lazy; §17, K-103).
gsap.registerPlugin(useGSAP);
gsap.defaults({ ease: "expo.out", duration: 0.6 });
// Bazı hedefler kırılıma göre yok (ör. 1024 altında hero lupu); uyarı üretmesin
gsap.config({ nullTargetWarn: false });

export { gsap, useGSAP };
