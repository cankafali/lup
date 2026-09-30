import { defineConfig, devices } from "@playwright/test";

// Uçtan uca duman testleri (inceleme 7.1b): üretim derlemesine karşı, masaüstü ve mobil.
// Yerelde tarayıcı indirmeden: PW_CHANNEL=msedge (ya da chrome). CI'da Playwright'ın Chromium'u.
const channel = process.env.PW_CHANNEL;
const CI = !!process.env.CI;
const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  // CI'da takılırsa en geç 5 dakikada biter (K-112). Her test bitince loga yazılır; hata raporu
  // (html + iz dosyaları) iş akışında indirilebilir çıktı olarak yüklenir.
  globalTimeout: CI ? 5 * 60_000 : 0,
  reporter: CI ? [["list"], ["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    {
      name: "masaustu",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, channel },
    },
    { name: "mobil", use: { ...devices["Pixel 7"], channel } },
  ],
  webServer: {
    // pnpm sarmalayıcısı olmadan: kapanışta süreç ağacı temiz ölsün. `next`, pnpm betiğiyle PATH'te
    command: `next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 60_000,
  },
});
