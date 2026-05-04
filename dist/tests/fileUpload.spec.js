import { test, expect } from "@playwright/test";
test("fileUpload test", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/upload");
    const pageUploadOption = page.locator("#file-upload");
    await pageUploadOption.setInputFiles("./upload/image.jpg");
    //file Submit Folder
    const pageUploadButton = page.locator("#file-submit");
    await pageUploadButton.click();
    await expect(page.locator("//h3")).toHaveText("File Uploaded!");
});
