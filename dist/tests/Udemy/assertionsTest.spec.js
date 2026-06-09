import { test, expect } from "@playwright/test";
test('Assertions Test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    //Assertion- 2 types
    //1. Hard assertion- if it fails, the test will stop executing and will be marked as failed
    //2. Soft assertion- if it fails, the test will continue executing and will be marked as failed at the end of the test
    //In playwright following assertions-
    //1. toBe- checks if the value is equal to the expected value
    //2. toBeTruthy- checks if the value is truthy
    //3. toBeFalsy- checks if the value is falsy
    //4. toBeNull- checks if the value is null
    //5. toBeUndefined- checks if the value is undefined
    //6. toBeGreaterThan- checks if the value is greater than the expected value
    //7. toBeLessThan- checks if the value is less than the expected value
    //7. toContain- checks if the value contains the expected value
    //8. toHaveLength- checks if the value has the expected length
    //9. toHaveText- checks if the value has the expected text
    //10. toHaveAttribute- checks if the value has the expected attribute
    //11. toHaveClass- checks if the value has the expected class
    //12. toHaveStyle- checks if the value has the expected style
    //13. toHaveValue- checks if the value has the expected value
    //14. toHaveTitle- checks if the value has the expected title
    //15. toHaveURL- checks if the value has the expected URL
    //16. toHaveScreenshot- checks if the value has the expected screenshot
    const documentAttribute = page.locator("[href*='documents-request']");
    await expect(documentAttribute).toHaveAttribute("class", "blinkingText");
    await expect(documentAttribute).toHaveClass(/blinkingText/);
    // await expect(documentAttribute).toHaveStyle({ "color": "rgb(255, 0, 0)" });
    await expect(documentAttribute).toHaveText("Documents");
    await expect(documentAttribute).toHaveText(/Documents/);
    await expect(documentAttribute).toHaveValue("");
    // await expect(documentAttribute).toHaveTitle("");
    // await expect(documentAttribute).toHaveURL("https://rahulshettyacademy.com/documents-request");
});
