import { test, expect } from "@playwright/test";

test("handling multiple tabs Using Browser Contexts", async ({ browser }) => {
  const context = browser.newContext();

  //launching new page
  const page1 = (await context).newPage();

  (await page1).goto("https://freelance-learn-automation.vercel.app/login");

  //creating promises
  const [newPages] = Promise.all;
  {
    [
      (await context).waitForEvent("page1"),

      (await page1).locator("//a[contains(@href,'facebook')]").click(),
    ];
  }
  await newPages.locator("//input[@name=email]").fill("test@email.com");
});
