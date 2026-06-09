import { test, expect } from "@playwright/test";
export class loginPage {
    page;
    signInButton;
    emailField;
    passwordField;
    constructor(page) {
        this.page = page;
        this.signInButton = page.locator("#login");
        this.emailField = page.locator("#userEmail");
        this.passwordField = page.locator("#userPassword");
    }
    validLogin = async (email, password) => {
        await this.emailField.pressSequentially(email, { delay: 100 });
        await this.passwordField.pressSequentially(password, { delay: 100 });
        await this.signInButton.click();
    };
}
