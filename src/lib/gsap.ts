"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.defaults({ ease: "expo.out", duration: 0.6 });

export { gsap, ScrollTrigger, useGSAP };
