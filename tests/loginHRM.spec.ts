import {test, expect} from '@playwright/test';

// At test level
//test.use({
//     viewport: { width: 1920, height: 925 },
// })

test("mySelfTest", async ({page})=>{
    await page.goto("https://opensource-demo.orangehrmlive.com/");
    
    await page.waitForTimeout(5000);
    //username
    const pageUsername = page.getByPlaceholder("Username");
    await pageUsername.type('admin',{delay:100});

    //password
    const pagePassword = page.getByPlaceholder("Password");
    await pagePassword.type("admin123",{delay:100});

    //click on login
    const pageClickLogin = page.locator("//button[@type='submit']");
    await pageClickLogin.click({button: 'left'});

    await page.waitForTimeout(5000);

    //assertion
    await expect(page).toHaveURL(/dashboard/);

    const pageProfilePictureAltImage = page.getByAltText("profile picture").first();
   await pageProfilePictureAltImage.click();

    //logout
    const pageLogout = page.getByText("Logout");
    await pageLogout.click();

    await page.waitForTimeout(3000);

    //assertion
    try {
        await expect(page).toHaveURL(/dashboard/);
    } catch (errors) {
        console.log(errors.errorMessage);
    }

    //checking with invalid credenitals
    await pageUsername.type('admin',{delay:100});
    await pagePassword.type("admin1234",{delay:100});

    await pageClickLogin.click({button: 'left'});

    const pageErrorLocator = page.locator("//p[@class='oxd-text oxd-text--p oxd-alert-content-text']");
    const errorMessage = await pageErrorLocator.textContent();
    console.log(errorMessage);

    await expect(errorMessage?.includes("Invalid")).toBeTruthy();
});