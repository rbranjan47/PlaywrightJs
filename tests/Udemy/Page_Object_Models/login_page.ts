import { test, expect, type Page, type Locator} from "@playwright/test";

export class loginPage {

    readonly page: Page;
    readonly signInButton: Locator;
    readonly emailField: Locator;
    readonly passwordField: Locator;

    constructor(page: Page){
        this.page = page;
        this.signInButton = page.locator("#login");
        this.emailField = page.locator("#userEmail");
        this.passwordField = page.locator("#userPassword");
    }

    validLogin = async (email: string, password: string) => {
        await this.emailField.pressSequentially(email, { delay: 100 });
        await this.passwordField.pressSequentially(password, { delay: 100 });
        await this.signInButton.click();
    }
}