import { test, expect } from "@playwright/test";

test('Hidden Element Validations', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Hidden Element Validations
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await page.waitForTimeout(8000);
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
});

test('Alert Popup Validations', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Alert Popup Validations
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await page.waitForTimeout(8000);
    // To accept the dialog
    await page.on("dialog", dialog => dialog.accept());
    // To dismiss the dialog
    //await page.on("dialog", dialog => dialog.dismiss());
    await page.locator("#alertbtn").click();
    
    // Hover over menu button
    await page.locator("#mousehover").hover();
});

test('Frame Handling Validations', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Frame Handling Validations
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await page.waitForTimeout(8000);
    // Handle the frames
    const framePage = page.frameLocator("#courses-iframe");
    await framePage.locator("text='Appium - Mobile Automation using Java'").click();
    await expect(framePage.locator("text='Appium - Mobile Automation using Java'")).toBeVisible();
    const textCheck = await framePage.locator(".text h2").textContent();
    console.log(`Textcheck ${textCheck?.split(" ")[1]}`);
});