import { expect } from "@playwright/test";
export class APIUtils {
    apiContext;
    constructor(apiContext) {
        this.apiContext = apiContext;
    }
    async getToken(payLoadBody) {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", { data: payLoadBody });
        const loginResponseJson = await loginResponse.json();
        return loginResponseJson.token;
    }
    async addToCart(payLoadBody, token) {
        const addToCart = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/user/add-to-cart", {
            data: payLoadBody,
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        });
        expect(addToCart.ok()).toBeTruthy();
        expect(addToCart.status()).toBe(200);
    }
    async createOrder(payLoadBody, token) {
        const createOrderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: payLoadBody,
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        });
        expect(createOrderResponse.ok()).toBeTruthy();
        expect(createOrderResponse.status()).toBe(201);
    }
}
