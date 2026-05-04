"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)('GET /posts/1 returns expected post data', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    (0, test_1.expect)(response.status()).toBe(200);
    const body = await response.json();
    (0, test_1.expect)(body).toMatchObject({
        id: 1,
        userId: test_1.expect.any(Number),
        title: test_1.expect.any(String),
        body: test_1.expect.any(String),
    });
});
