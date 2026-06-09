import { Given, When, Then } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import type { Browser, Page, Locator } from 'playwright';

let browser: Browser;
let page: Page;
let userName: Locator;
let passwordField: Locator;

Given("I am on the Rahul Shetty Academy eCommerce website", async () => {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/client');
  userName = page.locator('#userEmail');
  passwordField = page.locator('#userPassword');
});

When('I enter {string} and {string}', async (username: string, password: string) => {
  await userName.fill(username);
  await passwordField.fill(password);
});

When('I click on the {string} button', async (buttonName: string) => {
  await page.locator(`[value="${buttonName}"]`).click();
  await page.waitForLoadState('networkidle');
});

Then('I should see an {string} indicating invalid login credentials', async (errorMessage: string) => {
  const errorLocator = page.locator('.error-message');
  await errorLocator.waitFor({ state: 'visible' });
  const errorText = await errorLocator.textContent();
  if (!errorText?.includes(errorMessage)) {
    throw new Error(`Expected "${errorMessage}" but got "${errorText}"`);
  }
});

Given('I am on the Rahul Shetty Academy eCommerce website with {string} and {string}', async (username: string, password: string) => {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/client');
  userName = page.locator('#userEmail');
  passwordField = page.locator('#userPassword');
  await userName.fill(username);
  await passwordField.fill(password);
  await page.locator('[value="Login"]').click();
  await page.waitForLoadState('networkidle');
});

When('I search for {string}', async (itemName: string) => {
  const cards = page.locator('.card-body');
  const count = await cards.count();
  let itemFound = false;

  for (let i = 0; i < count; i++) {
    const title = await cards.nth(i).locator('b').textContent();
    if (title?.trim() === itemName) {
      itemFound = true;
      break;
    }
  }

  if (!itemFound) {
    throw new Error(`Item "${itemName}" not found on the page`);
  }
});

When('I try to add it to the cart', async () => {
  const addToCartButton = page.locator('text=Add To Cart');
  await addToCartButton.click();
  await page.waitForLoadState('networkidle');
});

Then('I should see an {string} indicating the item is out of stock', async (errorMessage: string) => {
  const errorLocator = page.locator('.error-message');
  await errorLocator.waitFor({ state: 'visible' });
  const errorText = await errorLocator.textContent();
  if (!errorText?.includes(errorMessage)) {
    throw new Error(`Expected "${errorMessage}" but got "${errorText}"`);
  }
});