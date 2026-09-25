"use client";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "./gsap";

/**
 * ScrollTrigger ve DrawSVG ayrı modülde: yalnızca bölüm animasyonları ve kılavuz çizgi
 * (motion/lazy) ile onların ihtiyaç duyduğu yerler (Lenis bağlantısı, yenileme) içe aktarır;
 * ilk yüke girmez (K-103). DrawSVG: çizgi çizimi (stroke-dashoffset).
 */
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export { ScrollTrigger };
