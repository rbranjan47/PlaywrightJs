import { test, expect } from "@playwright/test";

test("googlePageTest", async ({ page }) => {
  await page.goto("https://www.google.com/");

  expect(page.url()).toContain("google");

  expect(page.title).toContainEqual("Google");
});
