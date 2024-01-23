import { test, expect } from "@playwright/test";

//https://freelance-learn-automation.vercel.app/login

test("Drop-Down Test", async function ({ page }) {
  await page.goto("https://freelance-learn-automation.vercel.app/login");

  const pageSignup = page.locator("//a[@class='subLink']");
  await pageSignup.click({ button: "left" });

  const pageNameInput = page.getByPlaceholder("Name");
  await expect(page.getByPlaceholder("Name")).toBeTruthy();
  await pageNameInput.type("Sam Curren", { delay: 200 });

  const pageEmailInput = page.locator("input[id='email']");
  await expect(page.getByPlaceholder("Email")).toBeTruthy();
  await pageEmailInput.type("sam@curren.com", { delay: 200 });

  const pagePasswordInput = page.locator("input[id='password']");
  await expect(page.getByPlaceholder("Password")).toBeTruthy();
  await pagePasswordInput.type("samcurren1234", { delay: 200 });

  //click multiple checkbox and radio button

  //radio button
  const pageGender = page.locator("#gender1");
  await pageGender.click();

  //select from drop-down
  const pageStateDropdown = page.locator("#state");

  //by label > Best
  await pageStateDropdown.selectOption({ label: "Goa" });

  //by value
  await pageStateDropdown.selectOption({ value: "Jharkhand" });

  //by indes
  await pageStateDropdown.selectOption({ index: 8 });

  await page.waitForTimeout(5000);

  //Will check with condition
  const stateNameContains = await pageStateDropdown.textContent();
  if (await expect(stateNameContains?.includes("Kerala")).toBeTruthy) {
    await pageStateDropdown.selectOption({ label: "Kerala" });
  }

  await page.waitForTimeout(5000);
});
