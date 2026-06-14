import { test, expect } from "@playwright/test";
import { type Page } from '@playwright/test';
import { count } from "console";

const OFFERS_URL = "https://rahulshettyacademy.com/seleniumPractise/#/offers";
const SEARCH_INPUT = 'input[type="search"]';
const PAGE_SIZE_SELECT = "select";
const TABLE = "table";
const TABLE_ROWS = "table tbody tr";
const NAME_HEADER = 'table th:has-text("Veg/fruit name")';
const RESULT_SELECTOR = `${TABLE_ROWS}:visible`;

const getVisibleProductNames = async (page : Page) => {
  return (await page.locator(`${RESULT_SELECTOR} td:nth-child(1)`).allTextContents()).map((text) => text.trim());
};

test.describe("Offers Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(OFFERS_URL);
  });

  test("Load Offers Page - UI sanity", async ({ page }) => {
    await expect(page.locator(SEARCH_INPUT)).toBeVisible();
    await expect(page.locator(PAGE_SIZE_SELECT)).toBeVisible();
    await expect(page.locator(TABLE)).toBeVisible();
    await expect(page.locator(`${TABLE} th:has-text("Veg/fruit name")`)).toBeVisible();
    await expect(page.locator(`${TABLE} th:has-text("Price")`)).toBeVisible();
    await expect(page.locator(`${TABLE} th:has-text("Discount price")`)).toBeVisible();

    const visibleRows = await page.locator(RESULT_SELECTOR).count();
    expect(visibleRows).toBeGreaterThan(0);

    const pageSizeOptions = await page.locator(`${PAGE_SIZE_SELECT} option`).allTextContents();
    expect(pageSizeOptions).toEqual(["5", "10", "20"]);
  });

  test("Search filters results with a known product", async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill("Tomato");

    const visibleRows = page.locator(RESULT_SELECTOR);
    await expect(visibleRows).toHaveCount(1);
    await expect(visibleRows.locator("td:nth-child(1)")).toContainText("Tomato");
  });

  test("Non-matching search hides results and restores them on clear", async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill("zzzxxyy");
    await expect(page.locator(RESULT_SELECTOR)).toHaveCount(0);

    await page.locator(SEARCH_INPUT).fill("");
    await expect(page.locator(RESULT_SELECTOR));
    expect(count).toBeGreaterThan(5);
  });

  test("Search and sort combination keeps filtered rows sorted", async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill("To");
    await expect(page.locator(RESULT_SELECTOR));
    expect(count).toBeGreaterThan(1);

    await page.locator(NAME_HEADER).click();
    const sortedNames = await getVisibleProductNames(page);
    const expectedAscending = [...sortedNames].sort((a, b) => a.localeCompare(b));
    expect(sortedNames).toEqual(expectedAscending);
  });

  test("Sorts product names ascending then descending", async ({ page }) => {
    const initialNames = await getVisibleProductNames(page);
    expect(initialNames.length).toBeGreaterThan(0);

    await page.locator(NAME_HEADER).click();
    const ascendingNames = await getVisibleProductNames(page);
    expect(ascendingNames).toEqual([...ascendingNames].sort((a, b) => a.localeCompare(b)));

    await page.locator(NAME_HEADER).click();
    const descendingNames = await getVisibleProductNames(page);
    expect(descendingNames).toEqual([...ascendingNames].sort((a, b) => b.localeCompare(a)));
  });

  test("Keyboard search input focus and filtering", async ({ page }) => {
    await page.keyboard.press("Tab");
    await expect(page.locator(SEARCH_INPUT)).toBeFocused();
    await page.keyboard.type("Rice");

    const visibleRows = page.locator(RESULT_SELECTOR);
    await expect(visibleRows).toHaveCount(1);
    await expect(visibleRows.locator("td:nth-child(1)")).toContainText("Rice");
  });

  test("Slow network resilience and optional spinner behavior", async ({ page }) => {
    await page.context().route("**/*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.continue();
    });

    await page.goto(OFFERS_URL);

    const spinner = page.locator(".spinner, .loading, #loading, .loader");
    if (await spinner.count() > 0) {
      await expect(spinner).toBeVisible();
      await expect(spinner).not.toBeVisible({ timeout: 6000 });
    }

    const visibleRows = await page.locator(RESULT_SELECTOR).count();
    expect(visibleRows).toBeGreaterThan(0);
  });
});
