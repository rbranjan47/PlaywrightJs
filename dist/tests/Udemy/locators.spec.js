// Locators:
//1. page.getByRole() to locate by explicit and implicit accessibility attributes.
// Exmaple- <button role="button" aria-label="Submit">Submit</button>
// page.getByRole("button", { name: "Submit" }).click();
//2. page.getByText() to locate by text content.
// Exmaple- <button>Submit</button>
// page.getByText("Submit").click();
//3. page.getByLabel() to locate a form control by associated label's text.
// Exmaple- <label for="email">Email</label><input id="email" type="text" />
// page.getByLabel("Email").pressSequentially("test@gmail.com");
//4. page.getByPlaceholder() to locate an input by placeholder.
// Exmaple- <input placeholder="Enter your email" />
// page.getByPlaceholder("Enter your email").pressSequentially("test@gmail.com");
//5. page.getByAltText() to locate an element, usually image, by its text alternative.
// Exmaple- <img alt="Selenium Webdriver with Java" src="image.jpg" />
// page.getByAltText("Selenium Webdriver with Java").textContent();
//6. page.getByTitle() to locate an element by its title attribute.
// Exmaple- <a title="Learn more about Playwright" href="https://playwright.dev">Playwright</a>
// page.getByTitle("Learn more about Playwright").click();
//7. page.getByTestId() to locate an element based on its data-testid attribute (other attributes can be configured).
// Exmaple- <div data-testid="custom-element">Custom Element</div>
// page.getByTestId("custom-element").textContent();
//8. Locate by CSS or XPATH- page.locator("xpath or css")
// Exmaple- <button class="submit-btn">Submit</button>
// page.locator(".submit-btn").click();
//9. SHADOW DOM- page.locator("css=selector").locator("css=selector")
// Exmaple- <div class="shadow-host"><div class="shadow-root"><button>Click Me</button></div></div>
// page.locator(".shadow-host").locator(".shadow-root button").click();
import { test, expect } from "@playwright/test";
test('Locators', async ({ browser }) => {
    const context = await browser.newContext();
    const page1 = await context.newPage();
    await page1.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page1.title());
    await page1.locator("#username").pressSequentially("rahulshetty", { delay: 100 });
    await page1.locator("[type='password']").pressSequentially("Learning@830$3mK2", { delay: 100 });
    await page1.locator("#signInBtn").click();
    console.log(await page1.locator("[style*='block']").textContent());
    const errorMessage = await page1.locator("[style*='block']").textContent();
    expect(errorMessage).toContain("Incorrect");
    //Erase the text from the input fields 
    await page1.locator("#username").fill("");
    await page1.locator("[type='password']").fill("");
    //Enter the correct credentials
    await page1.locator("#username").pressSequentially("rahulshettyacademy", { delay: 100 });
    await page1.locator("[type='password']").pressSequentially("Learning@830$3mK2", { delay: 100 });
    await page1.locator("#signInBtn").click();
    // Multiple locators
    // const productTitles = page1.locator(".card-body a");
    // const count = await productTitles.count();
    // for (let i = 0; i < count; i++) {
    //     console.log("count is " + count);
    //     const title = await productTitles.nth(i).textContent();
    //     console.log(title);
    // }
    //first text content
    console.log(await page1.locator(".card-body a").first().textContent());
    //last text content
    console.log(await page1.locator(".card-body a").nth(-1).textContent());
    //all text contents
    console.log(await page1.locator(".card-body a").allTextContents());
});
test("Different locators", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    console.log(await page.title());
    // Get by label
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("female");
    // Get by placeholder
    await page.getByRole("textbox", { name: "Email" }).pressSequentially("test@gmail.com");
    await page.getByPlaceholder("Password").pressSequentially("Test@1234");
    await page.getByRole("button", { name: "Submit" }).click();
    // Get by alt text
    console.log(await page.getByAltText("Selenium Webdriver with Java").textContent());
});
