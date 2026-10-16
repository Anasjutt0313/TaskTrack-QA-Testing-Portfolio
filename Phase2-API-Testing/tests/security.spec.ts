import { test, expect } from '@playwright/test';
import { TaskApi } from '../api/TaskApi';
import { AuthApi } from '../api/AuthApi';
import { testCredentials } from '../utils/apiTestData';

test.describe('Security Tests', () => {
  test('TC-API-201: Get tasks without token returns 401', async ({ request }) => {
    const response = await request.get('/api/tasks');
    expect(response.status()).toBe(401);
  });

  test('TC-API-202: Create task without token returns 401', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: { title: 'Unauthorized' },
    });
    expect(response.status()).toBe(401);
  });

  test('TC-API-203: Update task without token returns 401', async ({ request }) => {
    const fakeId = '000000000000000000000000';
    const response = await request.put(`/api/tasks/${fakeId}`, {
      data: { title: 'Hacked' },
    });
    expect(response.status()).toBe(401);
  });

  test('TC-API-204: Delete task without token returns 401', async ({ request }) => {
    const fakeId = '000000000000000000000000';
    const response = await request.delete(`/api/tasks/${fakeId}`);
    expect(response.status()).toBe(401);
  });

  test('TC-API-205: Invalid/tampered token returns 401', async ({ request }) => {
    const response = await request.get('/api/tasks', {
      headers: { Authorization: 'Bearer invalid-token-xyz' },
    });
    expect(response.status()).toBe(401);
  });

  test('TC-API-206: Malformed Authorization header returns 401', async ({ request }) => {
    const response = await request.get('/api/tasks', {
      headers: { Authorization: 'NotBearer xyz' },
    });
    expect(response.status()).toBe(401);
  });

  test('TC-API-207: SQL injection in login email does not crash', async ({ request }) => {
    const response = await request.post('/api/users/login', {
      data: { email: "' OR 1=1 --", password: 'anything' },
    });
    expect([400, 401]).toContain(response.status());
  });

  test('TC-API-208: NoSQL injection attempt in login', async ({ request }) => {
    const response = await request.post('/api/users/login', {
      data: { email: { $ne: null }, password: { $ne: null } },
    });
    expect([400, 401, 500]).toContain(response.status());
  });

  test('TC-API-209: XSS payload in task title stored as plain text', async ({ request }) => {
    const authApi = new AuthApi(request);
    const token = await authApi.loginAndGetToken(testCredentials.email, testCredentials.password);
    const taskApi = new TaskApi(request, token);

    const xssTitle = `<script>alert("xss")</script>`;
    const response = await taskApi.createTask({ title: xssTitle });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe(xssTitle); // Should be stored as-is (rendered safely in UI)
  });

  test('TC-API-210: One user cannot access another user\'s task', async ({ request }) => {
    // This test requires 2 users — create a second user
    const authApi = new AuthApi(request);
    const email2 = `user2_${Date.now()}@example.com`;
    await authApi.register('User Two', email2, 'Test@12345');
    const token2 = await authApi.loginAndGetToken(email2, 'Test@12345');

    // Create task as user 1
    const token1 = await authApi.loginAndGetToken(testCredentials.email, testCredentials.password);
    const taskApi1 = new TaskApi(request, token1);
    const createRes = await taskApi1.createTask({ title: `Private ${Date.now()}` });
    const created = await createRes.json();

    // Try to update as user 2
    const taskApi2 = new TaskApi(request, token2);
    const updateRes = await taskApi2.updateTask(created._id, { title: 'Hacked!' });
    expect(updateRes.status()).toBe(401);

    // Cleanup
    await taskApi1.deleteTask(created._id);
  });
});