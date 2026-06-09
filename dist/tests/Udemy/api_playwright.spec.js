import { test, expect, request } from "@playwright/test";
/*
Playwright can be used to access the REST API of your application — sending requests to the server directly from Node.js without loading a page or running JS in a browser.
Common use cases include testing your server API, preparing server-side state before visiting a web app, and validating server-side post-conditions after browser actions.
All of this is done via APIRequestContext methods.

------------------------------Configuration------------------------------
--------------------------------------------------------------------------
Set a baseURL and common headers (like auth tokens) once in playwright.config.ts:
jsimport { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    baseURL: 'https://api.github.com',
    extraHTTPHeaders: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${process.env.API_TOKEN}`,
    },
  }
});
If your tests need to run behind a proxy, you can specify this in the config and the request fixture will pick it up automatically.




-------------------------Writing Tests-------------------------
---------------------------------------------------------------
Playwright Test comes with a built-in request fixture that respects configuration options like baseURL and extraHTTPHeaders. Here's an example:
jstest('should create a bug report', async ({ request }) => {
  const newIssue = await request.post(`/repos/${USER}/${REPO}/issues`, {
    data: {
      title: '[Bug] report 1',
      body: 'Bug description',
    }
  });
  expect(newIssue.ok()).toBeTruthy();

  const issues = await request.get(`/repos/${USER}/${REPO}/issues`);
  expect(await issues.json()).toContainEqual(expect.objectContaining({
    title: '[Bug] report 1',
  }));
});

-------------------------------------Setup & Teardown--------------------------------------
-------------------------------------------------------------------------------------------
Use beforeAll / afterAll to prepare and clean up state:
jstest.beforeAll(async ({ request }) => {
  const response = await request.post('/user/repos', { data: { name: REPO } });
  expect(response.ok()).toBeTruthy();
});

test.afterAll(async ({ request }) => {
  const response = await request.delete(`/repos/${USER}/${REPO}`);
  expect(response.ok()).toBeTruthy();
});




-------------------------Sending API Requests from UI Tests-------------------------
------------------------------------------------------------------------------------
You can mix API calls with browser tests. Two key patterns:
Preconditions — create data via API, then verify it in the browser UI.
Postconditions — interact with the UI, then verify the result via API:
jstest('last created issue should be on the server', async ({ page }) => {
  await page.goto(`https://github.com/${USER}/${REPO}/issues`);
  await page.getByText('New Issue').click();
  await page.getByRole('textbox', { name: 'Title' }).fill('Bug report 1');
  await page.getByText('Submit new issue').click();
  const issueId = new URL(page.url()).pathname.split('/').pop();

  const newIssue = await apiContext.get(
    `https://api.github.com/repos/${USER}/${REPO}/issues/${issueId}`
  );
  expect(newIssue.ok()).toBeTruthy();
});




-------------------------Reusing Authentication State-------------------------
------------------------------------------------------------------------------
Storage state is interchangeable between BrowserContext and APIRequestContext.
You can log in via API calls and then create a new browser context with those cookies already set.
jsconst requestContext = await request.newContext({
  httpCredentials: { username: 'user', password: 'passwd' }
});
await requestContext.get(`https://api.example.com/login`);
await requestContext.storageState({ path: 'state.json' });

// Reuse in a browser context
const context = await browser.newContext({ storageState: 'state.json' });




-------------------------Context Request vs Global Request-------------------------
-----------------------------------------------------------------------------------
There are two types of APIRequestContext:
one associated with a BrowserContext,
and one isolated instance created via apiRequest.newContext().

The key difference is that a context-associated request will share cookies with the browser context and automatically update them,
while an isolated instance has its own separate cookie storage.





-------------------------Key APIRequestContext Methods-------------------------
------------------------------------------------------------------------------------------
get(url)Send a GET requestrequest.
post(url, { data })Send a POST with bodyrequest.
put(url, { data })Send a PUTrequest.
patch(url, { data })Send a PATCHrequest.
delete(url)Send a DELETErequest.
fetch(request)Fetch using a Request objectrequest.
storageState()Export cookies/storagerequest.
dispose()Clean up the context
*/
const payLoadBody_Login = { "userEmail": "johnsmith009@test.com", "userPassword": "Welcome1" };
const payLoadBody_addToCart = {
    "_id": "6a00db4fe83610b531d84d09",
    "product": {
        "_id": "6960eae1c941646b7a8b3ed3",
        "productName": "ADIDAS ORIGINAL",
        "productCategory": "electronics",
        "productSubCategory": "mobiles",
        "productPrice": 11500,
        "productDescription": "Apple phone",
        "productImage": "https://rahulshettyacademy.com/api/ecom/uploads/productImage_1767959265156.jpg",
        "productRating": "0",
        "productTotalOrders": "0",
        "productStatus": true,
        "productFor": "women",
        "productAddedBy": "admin",
        "__v": 0
    }
};
const payLoadBody_CreateAnOrder = {
    "orders": [
        {
            "country": "India",
            "productOrderedId": "6960eae1c941646b7a8b3ed3"
        }
    ]
};
let login_token;
test.beforeAll("@API Validations, Before All Test", async () => {
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
        data: payLoadBody_Login
    });
    expect(loginResponse.ok()).toBeTruthy();
    expect(loginResponse.status()).toBe(200);
    const loginResponseJson = await loginResponse.json();
    console.log(loginResponseJson);
    login_token = loginResponseJson.token;
    console.log(login_token);
});
test.beforeEach("API Validations, Before Each Test", async () => {
});
test('@API Validations, Test', async ({ page }) => {
    // await page.locator("#userEmail").pressSequentially("johnsmith009@test.com", { delay: 100 });
    // await page.locator("#userPassword").pressSequentially("Welcome1", { delay: 100 });
    // await page.locator("#login").click();
    //ByPass using API Token
    await page.addInitScript(value => {
        window.localStorage.setItem("token", value);
    }, login_token);
    await page.goto("https://rahulshettyacademy.com/client/");
    console.log(await page.title());
    // await page.locator(".card-body b").first().waitFor();
    // // adding to cart
    // const products = page.locator(".card-body");
    // const count = await products.count();
    // for (let i = 0; i < count; i++) {
    //     const productName = await products.nth(i).locator("b").textContent();
    //     if (productName?.trim() === "ZARA COAT 3") {
    //         await products.nth(i).locator("text= Add To Cart").click();
    //         break;
    //     }
    // }
    //By API
    const apiContext = await request.newContext();
    const addToCart = await apiContext.post("https://rahulshettyacademy.com/api/ecom/user/add-to-cart", {
        data: payLoadBody_addToCart,
        headers: {
            "Content-Type": "application/json",
            "authorization": login_token
        }
    });
    expect(addToCart.ok()).toBeTruthy();
    expect(addToCart.status()).toBe(200);
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
    // expect(itemFound).toBeTruthy();
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
    // await page.locator("text=Place Order").waitFor();
    // await page.locator("text=Place Order").click();
    //By API
    const apiCreateOrderContext = await request.newContext();
    const createOrderResponse = await apiCreateOrderContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
        data: payLoadBody_CreateAnOrder,
        headers: {
            "Content-Type": "application/json",
            "authorization": login_token
        }
    });
    expect(createOrderResponse.ok()).toBeTruthy();
    expect(createOrderResponse.status()).toBe(201);
    // Order confirmation
    await page.locator(".hero-primary").waitFor();
    const orderConfirmationMessage = await page.locator(".hero-primary").textContent();
    expect(orderConfirmationMessage).toContain(" Thankyou for the order. ");
    console.log("Order number: " + await page.locator(".em-spacer-1 .ng-star-inserted").textContent());
    console.log("Order item: " + await page.locator(".line-item .title").first().textContent());
    console.log("Order price: " + await page.locator(".line-item .title").last().textContent());
});
test.afterAll("@API Validations, After All Test", async () => {
});
test.afterEach("@API Validations, After Each Test", async () => {
});
// To Run tag test, add tag in test and run command as below
// npx playwright test --grep @API
// npx playwright test --grep @API --headed
// This will run all the tests with @API tag in the test name. 
// You can also use --grep-invert to run all tests except those with the specified tag.
