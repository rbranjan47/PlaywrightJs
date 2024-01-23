import {test, expect} from '@playwright/test';

test('Mouse-Hover Test', async function({page}){
    await page.goto("https://www.amazon.in/");

    //timeout on loading
    await page.waitForTimeout(5000);

    const pageHoverElement = page.locator("#nav-link-accountList");
    await pageHoverElement.hover();

    const pageElements = page.locator("//span[@class='nav-text']").first();
    await pageElements.click();
})