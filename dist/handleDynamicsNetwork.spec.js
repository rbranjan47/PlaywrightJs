"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)("Drop-Down Test", async function ({ page }) {
    await page.goto("https://freelance-learn-automation.vercel.app/login");
    const pageSignup = page.locator("//a[@class='subLink']");
    await pageSignup.click({ button: "left" });
    //wait for all load
    await page.waitForLoadState("networkidle");
    const interestsCount = await page
        .locator("//input[@type='checkbox']")
        .count();
    (0, test_1.expect)(interestsCount).toBe(13);
});
