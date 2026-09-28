import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Paylaşım görselleri ImageResponse ile düz <img> ister. Kural bu dosyaları kendisi atlıyor, ama yol
  // karşılaştırması Windows'ta tutmuyor (yalnızca ilk ters bölü çevriliyor): iki ortamda aynı sonuç için
  {
    files: ["src/app/**/opengraph-image.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
