import { test, expect } from '@playwright/test';
import { AuthApi } from '../api/AuthApi';
import { TaskApi } from '../api/TaskApi';
import { testCredentials, generateUniqueEmail } from '../utils/apiTestData';

test.describe('Boundary Tests', () => {
  let authApi: AuthApi;
  let taskApi: TaskApi;
  let token: string;

  test.beforeEach(async ({ request }) => {
    authApi = new AuthApi(request);
    token = await authApi.loginAndGetToken(testCredentials.email, testCredentials.password);
    taskApi = new TaskApi(request, token);
  });

  test('TC-API-301: Password exactly 8 chars with all requirements accepted', async () => {
    const response = await authApi.register('Test', generateUniqueEmail(), 'Test@123');
    expect(response.status()).toBe(201);
  });

  test('TC-API-302: Password 7 chars rejected', async () => {
    const response = await authApi.register('Test', generateUniqueEmail(), 'Test@12');
    expect(response.status()).toBe(400);
  });

  test('TC-API-303: Very long task title (500 chars) accepted or handled', async () => {
    const longTitle = 'A'.repeat(500);
    const response = await taskApi.createTask({ title: longTitle });
    expect([201, 400]).toContain(response.status());
  });

  test('TC-API-304: Task with special characters in title accepted', async () => {
    const title = `Test @#$%^&*() {}[]|;:'"<>? ${Date.now()}`;
    const response = await taskApi.createTask({ title });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe(title);
  });

  test('TC-API-305: Task with Unicode/Emoji title accepted', async () => {
    const title = `Task 😀 测试 ${Date.now()}`;
    const response = await taskApi.createTask({ title });
    expect(response.status()).toBe(201);
  });

  test('TC-API-306: Email with unicode characters rejected or accepted per regex', async () => {
    const response = await authApi.register('Test', 'тест@example.com', 'Test@12345');
    // Regex may reject unicode — either 400 or 201 acceptable per design
    expect([400, 201]).toContain(response.status());
  });
});