import { test, expect } from "@playwright/test";
//test > function, to write test
//expect > function, to write assertions

test("My first test", async ({ page }: { page: string | any }) => {
  await page.goto("https://www.google.com");
  await expect(page).toHaveTitle("Google");
  console.log(await page.title());
});

//this test case will skip
test.skip("my second test", async function ({ page }: { page: string | any }) {
  await expect("hello world").toContain("hello universe");
});

test("My third test", async ({ page }: { page: string | any }) => {
  await expect(true).toBeTruthy();
  await expect.soft(false).toBeFalsy();
  await expect("Rabi Ranjan").not.toContain("rabi patel");
});
