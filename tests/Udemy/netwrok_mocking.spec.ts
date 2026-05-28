//Inspect network traffic, mock API responses, and test offline behavior. Inspecting requests is part of core and always available. 
// Mocking and network state control require the network capability.

import { test, expect, request } from '@playwright/test';

const { APiUtils } = require('../utils/APiUtils');
const loginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayLoad = { orders: [{ country: "India", productOrderedId: "67a8dde5c0d3e6622a297cc8" }] };
const fakePayLoadOrders = { data: [], message: "No Orders" };

let response: any;
test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APiUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);

})


//create order is success
test('@SP Place the order', async ({ page }) => {
    page.addInitScript((value: string) => {
        window.localStorage.setItem('token', value);
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client");


    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
        const response = await page.request.fetch(route.request());
        let body = JSON.stringify(fakePayLoadOrders);
        route.fulfill(
            {
                response,
                body,

            });
        //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    });

    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")

    console.log(await page.locator(".mt-4").textContent());
});