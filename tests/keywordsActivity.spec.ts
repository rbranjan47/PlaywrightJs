import { test, expect } from "@playwright/test";

test("googlePageTest", async ({ page }) => {
  await page.goto("https://www.google.com/");

  const pageSearchField = page.locator("textarea[name='q']");

  await pageSearchField.type("playwright", { delay: 200 });
  await page.keyboard.press("Enter");

  await page.waitForTimeout(3000);
  await page.goBack();
  await page.waitForTimeout(3000);
  await page.goForward();

  await page.waitForTimeout(3000);
  await pageSearchField.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Backspace");
  await page.waitForTimeout(3000);
  await pageSearchField.type("playwright js documentation", { delay: 200 });
  await page.keyboard.press("Enter");
});
