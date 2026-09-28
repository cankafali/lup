// public/images'taki görsellerin bulanık yer tutucularını üretir → src/content/blur.ts (K-107).
// Yeni bağımlılık yok: Next'in getirdiği sharp kullanılır. Kullanım: node scripts/blur.mjs
import { readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [require.resolve("next/package.json")] }));

const files = readdirSync("public/images")
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();
const lines = [];
for (const f of files) {
  const buf = await sharp(`public/images/${f}`).resize(12).webp({ quality: 40 }).toBuffer();
  lines.push(`  "/images/${f}":\n    "data:image/webp;base64,${buf.toString("base64")}",`);
}

writeFileSync(
  "src/content/blur.ts",
  `/**
 * Görsellerin yüklenirken gösterilen bulanık yer tutucuları (inceleme 3.5): 12px genişlik, WebP.
 * Üretilmiş veri; görsel değişirse \`node scripts/blur.mjs\` ile yeniden üretilir.
 */
export const BLUR: Readonly<Record<string, string>> = {
${lines.join("\n")}
};
`,
);
console.log(`${files.length} görsel → src/content/blur.ts`);
