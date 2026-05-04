"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)('Mouse-Hover Test', async function ({ page }) {
    await page.goto("https://www.amazon.in/");
    //timeout on loading
    await page.waitForTimeout(5000);
    const pageHoverElement = page.locator("#nav-link-accountList");
    await pageHoverElement.hover();
    const pageElements = page.locator("//span[@class='nav-text']").first();
    await pageElements.click();
});
