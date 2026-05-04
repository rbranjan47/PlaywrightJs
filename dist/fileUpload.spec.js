"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)("fileUpload test", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/upload");
    const pageUploadOption = page.locator("#file-upload");
    await pageUploadOption.setInputFiles("./upload/image.jpg");
    //file Submit Folder
    const pageUploadButton = page.locator("#file-submit");
    await pageUploadButton.click();
    await (0, test_1.expect)(page.locator("//h3")).toHaveText("File Uploaded!");
});
