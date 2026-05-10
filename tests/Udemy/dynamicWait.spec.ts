import { test, expect } from "@playwright/test";

test('Broswe Context Playwright Test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());

    await page.locator("#userEmail").pressSequentially("johnsmith009@test.com", { delay: 100 });
    await page.locator("#userPassword").pressSequentially("Welcome1", { delay: 100 });
    await page.locator("#login").click();


    //Wait for page to load, until all network calls are finished
    //await page.waitForLoadState("networkidle");

    //Above wait sometime not working due to flaky in nature, alternate- wait for element 
    await page.locator(".card-body b").first().waitFor();


    console.log(await page.locator(".card-body b").first().textContent());
    console.log(await page.locator(".card-body b").nth(-1).textContent());
    //all text contents
    console.log(await page.locator(".card-body b").allTextContents());


}
);