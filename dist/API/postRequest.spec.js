"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const BASE_URL = 'https://jsonplaceholder.typicode.com';
test_1.test.describe('Posts API', () => {
    let request;
    test_1.test.beforeAll(async ({ playwright }) => {
        request = await playwright.request.newContext({
            baseURL: BASE_URL,
            extraHTTPHeaders: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
    });
    test_1.test.afterAll(async () => {
        await request.dispose();
    });
    (0, test_1.test)('GET /posts - returns list of posts', async () => {
        const response = await request.get('/posts');
        (0, test_1.expect)(response.status()).toBe(200);
        (0, test_1.expect)(response.headers()['content-type']).toContain('application/json');
        const posts = await response.json();
        (0, test_1.expect)(Array.isArray(posts)).toBeTruthy();
        (0, test_1.expect)(posts.length).toBeGreaterThan(0);
        (0, test_1.expect)(posts[0]).toMatchObject({
            id: test_1.expect.any(Number),
            userId: test_1.expect.any(Number),
            title: test_1.expect.any(String),
            body: test_1.expect.any(String),
        });
    });
    (0, test_1.test)('GET /posts/:id - returns a single post', async () => {
        const response = await request.get('/posts/1');
        (0, test_1.expect)(response.status()).toBe(200);
        const post = await response.json();
        (0, test_1.expect)(post.id).toBe(1);
        (0, test_1.expect)(post.title).toBeTruthy();
    });
    (0, test_1.test)('GET /posts/:id - returns 404 for missing post', async () => {
        const response = await request.get('/posts/99999');
        (0, test_1.expect)(response.status()).toBe(404);
    });
    (0, test_1.test)('POST /posts - creates a new post', async () => {
        const payload = {
            title: 'Test Post',
            body: 'This is a test body.',
            userId: 1,
        };
        const response = await request.post('/posts', { data: payload });
        (0, test_1.expect)(response.status()).toBe(201);
        const created = await response.json();
        (0, test_1.expect)(created).toMatchObject({
            id: test_1.expect.any(Number),
            title: payload.title,
            body: payload.body,
            userId: payload.userId,
        });
    });
    (0, test_1.test)('PUT /posts/:id - updates an existing post', async () => {
        const payload = {
            id: 1,
            title: 'Updated Title',
            body: 'Updated body content.',
            userId: 1,
        };
        const response = await request.put('/posts/1', { data: payload });
        (0, test_1.expect)(response.status()).toBe(200);
        const updated = await response.json();
        (0, test_1.expect)(updated.title).toBe(payload.title);
        (0, test_1.expect)(updated.body).toBe(payload.body);
    });
    (0, test_1.test)('PATCH /posts/:id - partially updates a post', async () => {
        const response = await request.patch('/posts/1', {
            data: { title: 'Patched Title' },
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const patched = await response.json();
        (0, test_1.expect)(patched.title).toBe('Patched Title');
    });
    (0, test_1.test)('DELETE /posts/:id - deletes a post', async () => {
        const response = await request.delete('/posts/1');
        (0, test_1.expect)(response.status()).toBe(200);
    });
});
