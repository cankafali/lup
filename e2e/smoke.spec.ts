import { expect, test, type Page } from "@playwright/test";

// Kritik yollar (inceleme 7.1b). Önce `pnpm build`; sunucu playwright.config'te.

/** Konsol hataları ve yakalanmamış istisnalar. */
function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

const overflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test.describe("ana sayfa", () => {
  test("konsol hatası ve yatay taşma yok", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    await expect(page.locator("#lup-content h1")).toBeVisible();
    // Bölüm animasyonları ve lup kodu hidrasyondan sonra yüklenir; hepsi gelsin
    await page.waitForLoadState("networkidle");
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(800);
    expect(await overflow(page)).toBe(0);
    expect(errors).toEqual([]);
  });

  test("tablet genişliğinde yatay taşma yok", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(await overflow(page)).toBe(0);
  });

  test("reduced motion: giriş bölgeleri ve bölümler hemen görünür", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#lup-content h1")).toBeVisible();
    const hidden = await page.evaluate(
      () =>
        [
          ...document.querySelectorAll(
            "#lup-content [data-intro] > *, #lup-content [data-tray-cell]",
          ),
        ]
          .filter((el) => el.getClientRects().length > 0)
          .filter((el) => getComputedStyle(el).opacity !== "1").length,
    );
    expect(hidden).toBe(0);
  });
});

test.describe("ürün sayfası", () => {
  test("vitrin hücresi ürün sayfasını açar", async ({ page }) => {
    await page.goto("/");
    const cell = page.locator("#lup-content [data-tray-cell]").first();
    const href = await cell.getAttribute("href");
    await cell.scrollIntoViewIfNeeded();
    await cell.click();
    await expect(page).toHaveURL(href ?? /\/parca\//);
    await expect(page.locator("#lup-content h1").filter({ visible: true })).toHaveCount(1);
  });

  test("bilinmeyen parça 404 ve tezgâha dönüş linki", async ({ page }) => {
    const res = await page.goto("/parca/yok");
    expect(res?.status()).toBe(404);
    await expect(page.locator("#lup-content h1")).toContainText("arşivde yok");
    await expect(page.locator('#lup-content main a[href="/#vitrin"]')).toBeVisible();
  });

  test("WhatsApp linki parçanın adını ve numarasını kodlanmış mesajda taşır", async ({ page }) => {
    await page.goto("/parca/tektas-ruya");
    const href = await page
      .locator('#lup-content a[href^="https://wa.me/"]')
      .filter({ visible: true })
      .first()
      .getAttribute("href");
    const url = new URL(href ?? "");
    expect(url.searchParams.get("text")).toContain("Tektaş Rüya (No. 0147)");
    expect(href).not.toContain(" ");
  });
});

test.describe("mobil menü", () => {
  test.skip(({ isMobile }) => !isMobile, "yalnızca mobil");

  test("açılır, Escape ile kapanır, odak düğmeye döner", async ({ page }) => {
    await page.goto("/");
    const button = page.locator("header button[aria-expanded]");
    await button.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.locator("#lup-content")).toHaveAttribute("inert", "");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
    await expect(page.locator("#lup-content")).not.toHaveAttribute("inert", "");
  });
});

test.describe("lup", () => {
  test.skip(({ isMobile }) => isMobile, "fare davranışı");

  test("sol tık 2 sn basılı tutunca açılır, bırakınca kapanır, link açılmaz", async ({ page }) => {
    await page.goto("/");
    const loupe = page.locator("[data-loupe]");
    await expect(loupe).toHaveAttribute("data-ready", "clone", { timeout: 10_000 });
    const cell = page.locator("#lup-content [data-tray-cell]").first();
    await cell.scrollIntoViewIfNeeded();
    const box = await cell.boundingBox();
    if (!box) throw new Error("hücre yok");
    const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
    await page.mouse.move(x, y);
    await expect(loupe).toHaveAttribute("data-state", "off");
    await page.mouse.down();
    await page.waitForTimeout(2300);
    await expect(loupe).toHaveAttribute("data-state", "active");
    await expect(page.locator("html")).toHaveClass(/loupe-open/);
    await page.mouse.up();
    await expect(loupe).toHaveAttribute("data-state", "off");
    await page.waitForTimeout(600);
    await expect(page).toHaveURL("/");
  });
});

test("robots.txt: site kapalıyken tarama kapalı", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toMatch(/User-Agent: \*\s+Disallow: \//);
});
