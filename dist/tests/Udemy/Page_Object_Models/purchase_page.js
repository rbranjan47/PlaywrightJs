import { test, expect } from "@playwright/test";
export class purchasePage {
    page;
    countryInput;
    cart;
    cartItems;
    products;
    checkoutButton;
    dropdownOptions;
    constructor(page) {
        this.page = page;
        this.countryInput = page.locator("[placeholder*='Country']");
        this.products = page.locator(".card-body");
        this.cart = page.locator("[routerlink*='cart']");
        this.cartItems = page.locator("div li div div h3");
        this.checkoutButton = page.locator("text=Checkout");
        this.dropdownOptions = page.locator(".ta-results");
    }
    searchProductAndAddToCart = async (productName) => {
        const products = this.products;
        const count = await products.count();
        for (let i = 0; i < count; i++) {
            const productNameLoc = await products.nth(i).locator("b").textContent();
            if (productNameLoc?.trim() === productName) {
                await products.nth(i).locator("text= Add To Cart").click();
                break;
            }
        }
        await expect(this.page.locator("[routerlink*='cart']")).toBeEnabled();
        await this.page.locator("[routerlink*='cart']").click();
        await this.page.locator("div li").first().waitFor();
        const cartItems = this.page.locator("div li div div h3");
        const cartCount = await cartItems.count();
        for (let i = 0; i < cartCount; i++) {
            const cartItemName = await cartItems.nth(i).textContent();
            if (cartItemName?.trim() === productName) {
                console.log("Item found in cart: " + cartItemName);
                return true;
            }
        }
        return false;
    };
    //Ordering the product
    orderProduct = async (productName, country) => {
        await this.checkoutButton.click();
        await this.countryInput.pressSequentially("ind", { delay: 100 });
        const dropdownOptions_list = this.dropdownOptions;
        await dropdownOptions_list.waitFor();
        const optionsCount = await dropdownOptions_list.locator("button").count();
        for (let i = 0; i < optionsCount; i++) {
            const optionText = await dropdownOptions_list.locator("button").nth(i).textContent();
            if (optionText?.trim() === "India") {
                await dropdownOptions_list.locator("button").nth(i).click();
                break;
            }
        }
    };
}
