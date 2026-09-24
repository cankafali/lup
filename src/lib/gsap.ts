"use client";

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// DrawSVG: çizgi çizimi (stroke-dashoffset) — non-scaling-stroke çizgileri ekran boyunda ölçer.
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);
gsap.defaults({ ease: "expo.out", duration: 0.6 });
// Bazı hedefler kırılıma göre yok (ör. 1024 altında hero lupu); uyarı üretmesin
gsap.config({ nullTargetWarn: false });

export { gsap, ScrollTrigger, useGSAP };
