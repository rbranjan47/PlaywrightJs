// Session storage in Playwright
// Session storage in Playwright refers to interacting with the browser's sessionStorage Web API from within your Playwright tests using page.evaluate().
// Since Playwright doesn't have a dedicated sessionStorage API (unlike cookies, which have context.addCookies()), you access it by running JavaScript directly in the browser context.
import { test, expect } from "@playwright/test";
let WebContext;
test.beforeAll('Logging in and storing the session in the json file', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    await page.locator("#userEmail").pressSequentially("johnsmith009@test.com", { delay: 100 });
    await page.locator("#userPassword").pressSequentially("Welcome1", { delay: 100 });
    await page.locator("#login").click();
    await page.waitForLoadState("networkidle");
    //Storing login session to state.json file
    await context.storageState({ path: 'state.json' });
    // Setting up state.json to webContext to utilize the file
    WebContext = await browser.newContext({ storageState: 'state.json' });
});
test('Using same json file to skip login steps', async () => {
    const page = await WebContext.newPage();
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
    await expect(page.locator("[routerlink*='cart']")).toBeEnabled();
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const cartItems = page.locator("div li div div h3");
    const cartCount = await cartItems.count();
    let itemFound = false;
    for (let i = 0; i < cartCount; i++) {
        const cartItemName = await cartItems.textContent();
        if (cartItemName?.trim() === "ZARA COAT 3") {
            console.log("Item found in cart: " + cartItemName);
            itemFound = true;
            break;
        }
    }
});
