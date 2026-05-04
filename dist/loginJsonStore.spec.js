"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const testData = JSON.parse(JSON.stringify(require("../testData.json")));
(0, test_1.test)("mySelfTest", async ({ page }) => {
    await page.goto("https://opensource-demo.orangehrmlive.com/");
    await page.waitForTimeout(5000);
    //username
    const pageUsername = page.getByPlaceholder("Username");
    await pageUsername.type(testData.username, { delay: 100 });
    //password
    const pagePassword = page.getByPlaceholder("Password");
    await pagePassword.type(testData.password, { delay: 100 });
    //click on login
    const pageClickLogin = page.locator("//button[@type='submit']");
    await pageClickLogin.click({ button: "left" });
});
