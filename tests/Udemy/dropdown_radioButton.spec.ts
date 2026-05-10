import { test, expect } from "@playwright/test";

test('Broswe Context Playwright Test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    // Dropdown- 2 types
    //1. Static dropdown- select tag with options
    //2. Dynamic dropdown- without select tag, options are visible only when we click on the dropdown

    //Static dropdown
    await page.locator("select.form-control").selectOption("consult");
    console.log(await page.locator("select.form-control").inputValue());

    //Dynamic dropdown
    await page.locator("#autosuggest").type("ind");
    await page.locator(".ui-menu-item div").first().click();
    console.log(await page.locator("#autosuggest").inputValue());

    
});