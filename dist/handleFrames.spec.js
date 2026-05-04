"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
//https://docs.oracle.com/javase/7/docs/api/
(0, test_1.test)("Handle Frames", async function ({ page }) {
    await page.goto("https://docs.oracle.com/javase/7/docs/api/");
    const iFrame = await page.frameLocator("//frame[@name='packageListFrame']");
    const pageFrameClick = page.locator("//a[text()='java.applet']").first();
    //using frame locator
    await iFrame.locator("//a[text()='java.applet']").first().click();
    await page.pause();
});
