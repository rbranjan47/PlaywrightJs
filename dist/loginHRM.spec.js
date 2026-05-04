"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
// At test level
//test.use({
//     viewport: { width: 1920, height: 925 },
// })
(0, test_1.test)("Orange HRM Tests", async ({ page }) => {
    await page.goto("https://opensource-demo.orangehrmlive.com/");
    await page.waitForTimeout(5000);
    //username
    const pageUsername = page.getByPlaceholder("Username");
    await pageUsername.type('admin', { delay: 100 });
    //password
    const pagePassword = page.getByPlaceholder("Password");
    await pagePassword.type("admin123", { delay: 100 });
    //click on login
    const pageClickLogin = page.locator("//button[@type='submit']");
    await pageClickLogin.click({ button: 'left' });
    await page.waitForTimeout(5000);
    //assertion
    await (0, test_1.expect)(page).toHaveURL(/orangehrmlive/);
    const pageProfilePictureAltImage = page.getByAltText("profile picture").first();
    await pageProfilePictureAltImage.click();
    //adding a users
    const adminLinkOption = page.getByRole('link', { name: 'Admin' });
    await adminLinkOption.click();
    const addUserButton = page.getByRole('button', { name: ' Add' });
    await addUserButton.click();
    await page.getByText('-- Select --').first().click();
    const userRoleDropdown = page.getByRole('option', { name: 'Admin' });
    await userRoleDropdown.click();
    await page.getByText('-- Select --').click();
    const statusDropdown = page.getByRole('option', { name: 'Enabled' });
    await statusDropdown.click();
    const usernameInput = page.locator("(//label[text()='Username']/parent::div/parent::div//div)[2]//input");
    await usernameInput.click();
    await usernameInput.fill('JohnSnow001');
    const passswordInput = page.locator("(//label[text()='Password']/parent::div/parent::div//div)[2]//input");
    await passswordInput.click();
    await passswordInput.fill('JohnSnow001');
    const confirmationMessageLocator = page.locator("(//label[text()='Confirm Password']/parent::div/parent::div//div)[2]//input");
    await confirmationMessageLocator.click();
    await confirmationMessageLocator.fill('JohnSnow001');
    await page.getByRole('button', { name: 'Save' }).click();
    const hintsTypeDropdown = page.getByRole('textbox', { name: 'Type for hints...' });
    await hintsTypeDropdown.click();
    await hintsTypeDropdown.fill('Peter');
    await page.getByRole('option', { name: 'Peter Mac Anderson' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    try {
        (0, test_1.expect)(await page.locator("//div[@role='alertdialog']//p").textContent()).toBe('SuccessSuccessfully Saved');
        (0, test_1.expect)(await page.locator("//div[@class='oxd-table-card']//div[contains(text(),'JohnSnow001')]").textContent()).toBe('JohnSnow001');
        (0, test_1.expect)(await page.locator("//div[@class='oxd-table-card']//div[contains(text(),'Peter Mac Anderson')]").textContent()).toBe('Peter Mac Anderson');
        (0, test_1.expect)(await page.locator("//div[@class='oxd-table-card']//div[contains(text(),'Admin')]").textContent()).toBe('Admin');
    }
    catch (errors) {
        console.log(errors);
    }
    //logout
    await page.locator("//div[@class='oxd-topbar-header']//ul//span//i").click();
    await page.getByText("Logout").click();
    await page.waitForTimeout(3000);
    //assertion
    try {
        await (0, test_1.expect)(page).toHaveURL(/auth\/login/);
    }
    catch (errors) {
        console.log(errors);
    }
    //checking with invalid credenitals
    await pageUsername.pressSequentially('admin', { delay: 100 });
    // await pageUsername.type('admin',{delay:100});
    await pagePassword.type("admin1234", { delay: 100 });
    await pageClickLogin.click({ button: 'left' });
    const pageErrorLocator = page.locator("//p[@class='oxd-text oxd-text--p oxd-alert-content-text']");
    const errorMessage = await pageErrorLocator.textContent();
    console.log(errorMessage);
    await (0, test_1.expect)(errorMessage?.includes("Invalid")).toBeTruthy();
});
