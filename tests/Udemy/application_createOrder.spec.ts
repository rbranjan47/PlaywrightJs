import { test, expect } from "@playwright/test";

// Assertions 
// Assertion	                                          Description
// await expect(locator).toBeAttached()	                  Element is attached
// await expect(locator).toBeChecked()	                  Checkbox is checked
// await expect(locator).toBeDisabled()	                  Element is disabled
// await expect(locator).toBeEditable()	                  Element is editable
// await expect(locator).toBeEmpty()	                  Container is empty
// await expect(locator).toBeEnabled()	                  Element is enabled
// await expect(locator).toBeFocused()	                  Element is focused
// await expect(locator).toBeHidden()	                  Element is not visible
// await expect(locator).toBeInViewport()	              Element intersects viewport
// await expect(locator).toBeVisible()	                  Element is visible
// await expect(locator).toContainText()	              Element contains text
// await expect(locator).toContainClass()	              Element has specified CSS classes
// await expect(locator).toHaveAccessibleDescription()	  Element has a matching accessible description
// await expect(locator).toHaveAccessibleName()	          Element has a matching accessible name
// await expect(locator).toHaveAttribute()	              Element has a DOM attribute
// await expect(locator).toHaveClass()	                  Element has specified CSS class property
// await expect(locator).toHaveCount()	                  List has exact number of children
// await expect(locator).toHaveCSS()	                  Element has CSS property
// await expect(locator).toHaveId()	                      Element has an ID
// await expect(locator).toHaveJSProperty()	              Element has a JavaScript property
// await expect(locator).toHaveRole()	                  Element has a specific ARIA role
// await expect(locator).toHaveScreenshot()	              Element has a screenshot
// await expect(locator).toHaveText()	                  Element matches text
// await expect(locator).toHaveValue()	                  Input has a value
// await expect(locator).toHaveValues()	                  Select has options selected
// await expect(locator).toMatchAriaSnapshot()	          Element matches the Aria snapshot
// await expect(page).toMatchAriaSnapshot()	              Page matches the Aria snapshot
// await expect(page).toHaveScreenshot()	              Page has a screenshot
// await expect(page).toHaveTitle()	                      Page has a title
// await expect(page).toHaveURL()	                      Page has a URL
// await expect(response).toBeOK()	                      Response has an OK status

// NON RETRYING ASSERTIONS
// Assertion	                                          Description
// expect(value).toBe()	                                  Checks if the value is equal to the expected value
// expect(value).toBeTruthy()	                          Checks if the value is truthy
// expect(value).toBeFalsy()	                          Checks if the value is falsy
// expect(value).toBeNull()	                              Checks if the value is null
// expect(value).toBeUndefined()	                      Checks if the value is undefined
// expect(value).toBeGreaterThan()	                      Checks if the value is greater than the expected value
// expect(value).toBeLessThan()	                          Checks if the value is less than the expected value
// expect(value).toContain()	                          Checks if the value contains the expected value
// expect(value).toHaveLength()	                          Checks if the value has the expected length
// expect(value).toHaveText()	                          Checks if the value has the expected text
// expect(value).toHaveAttribute()	                      Checks if the value has the expected attribute
// expect(value).toHaveClass()	                          Checks if the value has the expected class
// expect(value).toHaveStyle()	                          Checks if the value has the expected style
// expect(value).toHaveValue()	                          Checks if the value has the expected value
// expect(value).toHaveTitle()	                          Checks if the value has the expected title
// expect(value).toHaveURL()	                          Checks if the value has the expected URL
// expect(value).toHaveScreenshot()	                      Checks if the value has the expected screenshot


// ASYMMETRIC ASSERTIONS
// Assertion	                                          Description
// expect.stringContaining()	                          Checks if the value contains the expected substring
// expect.stringMatching()	                              Checks if the value matches the expected regular expression
// expect.objectContaining()	                          Checks if the value contains the expected object properties
// expect.arrayContaining()	                              Checks if the value contains the expected array elements
// expect.any()                                           Matches any value
// expect.anything()	                                  Matches any value except null or undefined
// expect.not()	                                          Inverts the following assertion


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

    expect(itemFound).toBeTruthy();

    // ordering the product
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").type("ind", { delay: 100 });
    const dropdownOptions = page.locator(".ta-results");
    await dropdownOptions.waitFor();
    const optionsCount = await dropdownOptions.locator("button").count();
    for (let i = 0; i < optionsCount; i++) {
        const optionText = await dropdownOptions.locator("button").nth(i).textContent();
        if (optionText?.trim() === "India") {
            await dropdownOptions.locator("button").nth(i).click();
            break;
        }
    }

    // credit card details
    await page.getByText('Credit Card Number').locator('..').locator('input').clear();
    await page.getByText('Credit Card Number').locator('..').locator('input').pressSequentially("4111 1111 1111 1111", { delay: 100 });
    await page.locator("select.input.ddl").first().selectOption("10");
    await page.locator("select.input.ddl").last().selectOption("28");
    await page.getByText('CVV Code ').locator('..').locator('input').pressSequentially("123", { delay: 100 });
    await page.getByText('Name on Card').locator('..').locator('input').pressSequentially("John Smith", { delay: 100 });

    //coupan
    await page.getByText('Apply Coupon').locator('..').locator('input').pressSequentially("rahulshettyacademy", { delay: 100 });
    await page.getByText('Apply Coupon').locator('..').locator('button').click();
    await page.locator("//p[contains(text(), 'Coupon Applied')]").waitFor();
    const coupanMessage = await page.locator("//p[contains(text(), 'Coupon Applied')]").textContent();
    await expect(coupanMessage).toContain("* Coupon Applied");
    
    //place order
    await page.locator("text=Place Order").waitFor();
    await page.locator("text=Place Order").click();

    // Order confirmation
    await page.locator(".hero-primary").waitFor();
    const orderConfirmationMessage = await page.locator(".hero-primary").textContent();
    expect(orderConfirmationMessage).toContain(" Thankyou for the order. ");

    console.log("Order number: " + await page.locator(".em-spacer-1 .ng-star-inserted").textContent());
    console.log("Order item: " + await page.locator(".line-item .title").first().textContent());
    console.log("Order price: " + await page.locator(".item-price").last().textContent());

    // Downloading & Saving the csv file to the local machine
    const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.locator("text=Download Invoice").click()
    ]);

    // Save downloaded file to a desired location
    const downloadPath = await download.path();
    console.log("Download path: " + downloadPath);
    await download.saveAs("order-invoice.csv");


    await page.waitForTimeout(5000);

});