import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Birim testleri (inceleme 7.1a): yalnızca saf fonksiyonlar, tarayıcısız.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
