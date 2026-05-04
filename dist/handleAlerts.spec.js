"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)("googlePageTest", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
    const pageJSAlertButton = page.locator("//button[@onClick='jsAlert()']");
    const pageJSConfirmButton = page.locator("//button[@onClick='jsConfirm()']");
    const pageJSPromptButton = page.locator("//button[@onClick='jsPrompt()']");
    const pageClickResult = page.locator("#result");
    //we need to store the alerts in dialog
    page.on("dialog", async (d1_log) => {
        d1_log.accept();
        console.log(d1_log.message());
        //await expect(d1_log.message).toContain("I am a JS Alert");
    });
    await pageJSAlertButton.click();
    page.on("dialog", async (d2_log) => {
        d2_log.accept();
        console.log(d2_log.message());
        //await expect(d2_log.message).toContain("I am a JS Alert");
    });
    await pageJSAlertButton.click();
    await pageJSConfirmButton.click();
    //   page.waitForTimeout(3000);
    //   await pageJSPromptButton.click();
});
