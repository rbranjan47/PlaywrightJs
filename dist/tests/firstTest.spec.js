const { test, expect } = require("@playwright/test");
//test > function, to write test
//expect > function, to write assertions
test("My first test", async ({ page }) => {
    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle("Google");
});
//this test case will skip
test.skip("my second test", async function ({ page }) {
    await expect("hello world").toContain("hello universe");
});
test("My third test", async ({ page }) => {
    await expect(true).toBeTruthy();
    await expect.soft(false).toBeFalsy();
    await expect("Rabi Ranjan").not.toContain("rabi patel");
});
export {};
