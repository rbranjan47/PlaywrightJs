import { test, expect } from '@playwright/test';
const BASE_URL = 'https://jsonplaceholder.typicode.com';
test.describe('Posts API', () => {
    let request;
    test.beforeAll(async ({ playwright }) => {
        request = await playwright.request.newContext({
            baseURL: BASE_URL,
            extraHTTPHeaders: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
    });
    test.afterAll(async () => {
        await request.dispose();
    });
    test('GET /posts - returns list of posts', async () => {
        const response = await request.get('/posts');
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
        const posts = await response.json();
        expect(Array.isArray(posts)).toBeTruthy();
        expect(posts.length).toBeGreaterThan(0);
        expect(posts[0]).toMatchObject({
            id: expect.any(Number),
            userId: expect.any(Number),
            title: expect.any(String),
            body: expect.any(String),
        });
    });
    test('GET /posts/:id - returns a single post', async () => {
        const response = await request.get('/posts/1');
        expect(response.status()).toBe(200);
        const post = await response.json();
        expect(post.id).toBe(1);
        expect(post.title).toBeTruthy();
    });
    test('GET /posts/:id - returns 404 for missing post', async () => {
        const response = await request.get('/posts/99999');
        expect(response.status()).toBe(404);
    });
    test('POST /posts - creates a new post', async () => {
        const payload = {
            title: 'Test Post',
            body: 'This is a test body.',
            userId: 1,
        };
        const response = await request.post('/posts', { data: payload });
        expect(response.status()).toBe(201);
        const created = await response.json();
        expect(created).toMatchObject({
            id: expect.any(Number),
            title: payload.title,
            body: payload.body,
            userId: payload.userId,
        });
    });
    test('PUT /posts/:id - updates an existing post', async () => {
        const payload = {
            id: 1,
            title: 'Updated Title',
            body: 'Updated body content.',
            userId: 1,
        };
        const response = await request.put('/posts/1', { data: payload });
        expect(response.status()).toBe(200);
        const updated = await response.json();
        expect(updated.title).toBe(payload.title);
        expect(updated.body).toBe(payload.body);
    });
    test('PATCH /posts/:id - partially updates a post', async () => {
        const response = await request.patch('/posts/1', {
            data: { title: 'Patched Title' },
        });
        expect(response.status()).toBe(200);
        const patched = await response.json();
        expect(patched.title).toBe('Patched Title');
    });
    test('DELETE /posts/:id - deletes a post', async () => {
        const response = await request.delete('/posts/1');
        expect(response.status()).toBe(200);
    });
});
