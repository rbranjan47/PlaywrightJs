import { test, expect } from "@playwright/test";
test('Handle Child Window/Tab', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    //Handle child window in Playwright
    //1. Click on the link which opens the child window
    //2. Use the context.waitForEvent("page") to wait for the child window to open
    //3. Use the page object returned by the waitForEvent to interact with the child window
    await page.locator("[href*='documents-request']").click();
    //Promise- 1. A promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
    const [childPage] = await Promise.all([
        context.waitForEvent("page"),
    ]);
    await childPage.waitForLoadState();
    console.log(await childPage.title());
    console.log(await childPage.url());
    //printing the text from the element
    console.log(await childPage.locator(".red").textContent());
    //To navigate to back to parent window
    // await childPage.close();
    // console.log(await page.title());
    //To navigate to back to parent window without closing the child window
    await childPage.bringToFront();
    console.log(await page.title());
    // Differenc between textContent and inputValue
    //1. textContent- returns the text content of the element, it does not return the value of the input field
    //2. inputValue- returns the value of the input field, it does not return the text content of the element
    const username = await page.locator("#username");
    //text content of the element
    console.log(await username.textContent());
    //value of the input field
    await username.pressSequentially("rahulshettyacademy", { delay: 100 });
    console.log(await username.inputValue());
});
