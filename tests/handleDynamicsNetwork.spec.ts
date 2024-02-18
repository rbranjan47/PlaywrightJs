import { test, expect } from "@playwright/test";

test("Drop-Down Test", async function ({ page }) {
  await page.goto("https://freelance-learn-automation.vercel.app/login");

  const pageSignup = page.locator("//a[@class='subLink']");
  await pageSignup.click({ button: "left" });

  //wait for all load
  await page.waitForLoadState("networkidle");

  const interestsCount = await page
    .locator("//input[@type='checkbox']")
    .count();

  expect(interestsCount).toBe(13);
});
