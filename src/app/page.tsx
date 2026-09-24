import { Atolye } from "@/components/sections/Atolye";
import { Hero } from "@/components/sections/Hero";
import { Magaza } from "@/components/sections/Magaza";
import { Makro } from "@/components/sections/Makro";
import { Vitrin } from "@/components/sections/Vitrin";

export default function Home() {
  return (
    <main>
      <Hero />
      <Vitrin />
      <Makro />
      <Atolye />
      <Magaza />
    </main>
  );
}
