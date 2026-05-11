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
    await page.locator("select.form-control").selectOption("consult");

    //Dynamic dropdown
    // await page.locator("#autosuggest").pressSequentially("ind", { delay: 100 });
    // await page.locator(".ui-menu-item div").first().click();
    // console.log(await page.locator("#autosuggest").inputValue());


    // Radio button
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    console.log(await page.locator(".radiotextsty").last().isChecked());

    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    await page.locator("#terms").check();
    await expect(page.locator("#terms")).toBeChecked();

    await page.locator("#terms").uncheck();
    await expect(page.locator("#terms").isChecked()).not.toBeFalsy();

});