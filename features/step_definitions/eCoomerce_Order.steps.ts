import { Given, When, Then } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';

let browser: Browser;
let page: Page;

// -------------------------  World Constructor  -------------------------
// This is where you can set up any shared state or utilities for your steps
// For example, you could initialize a Playwright browser and page here if needed
// Doing by making any varaible this.VARIABLE_NAME and then we can use this.VARIABLE_NAME in any step definition file

Given('I am on the Rahul Shetty Academy eCommerce website with {string} and {string}', async (username: string, password: any) => {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();

  await page.goto('https://rahulshettyacademy.com/client');
  await page.locator('#userEmail').fill(username);
  await page.locator('#userPassword').fill(password);
  await page.locator('[value="Login"]').click();
  await page.waitForLoadState('networkidle');
});

When('I add {string} to the cart', async (productName: string) => {
  const cards = page.locator('.card-body');
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    const title = await cards.nth(i).locator('b').textContent();
    if (title?.trim() === productName) {
      await cards.nth(i).locator('text=Add To Cart').click();
      break;
    }
  }

  await page.locator('[routerlink="/dashboard/cart"]').click();
  await page.waitForLoadState('networkidle');
});

When('I proceed to checkout', async () => {
  await page.locator('text=Checkout').click();
  await page.waitForLoadState('networkidle');
});

When('I fill in the {string}', async (shippingDetails: string) => {
  await page.locator('[placeholder="Select Country"]').pressSequentially('India');
  const dropdown = page.locator('.ta-results');
  await dropdown.waitFor();
  await dropdown.locator('button').first().click();
});

When('I select {string} as the payment {string}', async (method: string, _type: string) => {
  // Select payment method - adjust selector based on actual UI
  await page.locator('text=Credit Card').click();
});

When('I confirm the {string} in orderhistory page', async (_order: string) => {
  await page.locator('text=Place Order').click();
  await page.waitForLoadState('networkidle');
});

Then('I should see a {string} that my order has been placed successfully', async (_confirmationMessage: string) => {
  await page.locator('text=Thankyou for the order.').waitFor({ state: 'visible' });
  console.log('✅ Order placed successfully!');
  await browser.close();

});