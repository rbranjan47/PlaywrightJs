import { test, expect } from '@playwright/test';
test('Broswe Context Playwright Test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    await page.locator("#userEmail").pressSequentially("johnsmith009@test.com", { delay: 100 });
    await page.locator("#userPassword").pressSequentially("Welcome1", { delay: 100 });
    await page.locator("#login").click();
    await page.locator(".card-body b").first().waitFor();
    // adding to cart
    const products = page.locator(".card-body");
    const count = await products.count();
    for (let i = 0; i < count; i++) {
        const productName = await products.nth(i).locator("b").textContent();
        if (productName?.trim() === "ZARA COAT 3") {
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    //capturing screenshot
    await page.screenshot({ path: 'added_to_cart.png' });
});
