"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)("googlePageTest", async ({ page }) => {
    await page.goto("https://www.google.com/");
    (0, test_1.expect)(page.url()).toContain("google");
    (0, test_1.expect)(page.title).toContainEqual("Google");
});
