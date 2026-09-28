import { defineConfig, devices } from "@playwright/test";

// Uçtan uca duman testleri (inceleme 7.1b): üretim derlemesine karşı, masaüstü ve mobil.
// Yerelde tarayıcı indirmeden: PW_CHANNEL=msedge (ya da chrome). CI'da Playwright'ın Chromium'u.
const channel = process.env.PW_CHANNEL;
const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    {
      name: "masaustu",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, channel },
    },
    { name: "mobil", use: { ...devices["Pixel 7"], channel } },
  ],
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
