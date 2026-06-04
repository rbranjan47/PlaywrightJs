import { test, expect, type Page, type Locator } from "@playwright/test";

export class cardDetails {
    readonly page: Page;
    readonly creditCardNumberInput: Locator;
    readonly cvvCodeInput: Locator
    readonly nameOnCardInput: Locator;
    readonly applyCouponInput: Locator
    readonly applyCouponButton: Locator;
    readonly orderConfirmationMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.creditCardNumberInput = page.getByText('Credit Card Number').locator('..').locator('input');
        this.cvvCodeInput = page.getByText('CVV Code ').locator('..').locator('input');
        this.nameOnCardInput = page.getByText('Name on Card').locator('..').locator('input');
        this.applyCouponInput = page.getByText('Apply Coupon').locator('..').locator('input');
        this.applyCouponButton = page.getByText('Apply Coupon').locator('..').locator('button');
        this.orderConfirmationMessage = page.locator(".hero-primary");
    }

    createOrder = async (productName: string, country: string) => {
        {
            this.creditCardNumberInput.clear();
            await this.creditCardNumberInput.pressSequentially("4111 1111 1111 1111", { delay: 100 });
            await this.cvvCodeInput.pressSequentially("123", { delay: 100 });
            await this.nameOnCardInput.pressSequentially("John Smith", { delay: 100 });

            //coupan
            await this.applyCouponInput.pressSequentially("rahulshettyacademy", { delay: 100 });
            await this.applyCouponButton.click();
            await this.page.locator("//p[contains(text(), 'Coupon Applied')]").waitFor();
            const coupanMessage = await this.page.locator("//p[contains(text(), 'Coupon Applied')]").textContent();
            await expect(coupanMessage).toContain("* Coupon Applied");

            //place order
            await this.page.locator("text=Place Order").waitFor();
            await this.page.locator("text=Place Order").click();

            // Order confirmation
            await this.orderConfirmationMessage.waitFor();
            const orderConfirmationMessage = await this.orderConfirmationMessage.textContent();
            expect(orderConfirmationMessage).toContain(" Thankyou for the order. ");

            console.log("Order number: " + await this.page.locator(".em-spacer-1 .ng-star-inserted").textContent());
            console.log("Order item: " + await this.page.locator(".line-item .title").first().textContent());
            console.log("Order price: " + await this.page.locator(".line-item .title").last().textContent());


        }
    }
}