import { test, expect } from "@playwright/test";
import { loginPage } from "../Page_Object_Models/login_page";
import { purchasePage } from "../Page_Object_Models/purchase_page";
import { cardDetails } from "../Page_Object_Models/card_details";
test.describe.configure({ retries: 2 }); // Retry failed tests up to 2 times
test.describe.configure({ mode: 'parallel' }); // Run tests in parallel
// Another mode ic aclled serial mode
//test.describe.configure({ mode: 'serial' }) // Run tests sequentially, one after the other
test('Broswe Context Playwright Test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const login = new loginPage(page);
    const purchase = new purchasePage(page);
    const card_details = new cardDetails(page);
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    // await page.locator("#userEmail").pressSequentially("johnsmith009@test.com", { delay: 100 });
    // await page.locator("#userPassword").pressSequentially("Welcome1", { delay: 100 });
    // await page.locator("#login").click();
    //Using Page Object Model for login screen
    await login.validLogin("johnsmith009@test.com", "Welcome1");
    await page.locator(".card-body b").first().waitFor();
    // adding to cart
    let itemFound = false;
    //Using Page Object Model for add to cart and order confirmation
    itemFound = await purchase.searchProductAndAddToCart("ZARA COAT 3");
    expect(itemFound).toBeTruthy();
    // ordering the product
    purchase.orderProduct("ZARA COAT 3", "India");
    // credit card details- Using page object model for card details and order confirmation
    await card_details.createOrder("ZARA COAT 3", "India");
    await page.waitForTimeout(5000);
});
