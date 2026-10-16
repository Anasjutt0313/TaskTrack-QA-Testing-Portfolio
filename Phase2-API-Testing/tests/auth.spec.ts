import { test, expect } from '@playwright/test';
import { AuthApi } from '../api/AuthApi';
import { generateUniqueEmail, strongPassword, invalidData, testCredentials } from '../utils/apiTestData';

test.describe('Auth API Tests', () => {
  let authApi: AuthApi;

  test.beforeEach(async ({ request }) => {
    authApi = new AuthApi(request);
  });

  // ============ REGISTER TESTS ============
  test('TC-API-001: Register with valid data returns 201 and token', async () => {
    const email = generateUniqueEmail();
    const response = await authApi.register('New User', email, strongPassword);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('_id');
    expect(body.email).toBe(email);
    expect(body.name).toBe('New User');
  });

  test('TC-API-002: Register with empty name returns 400', async () => {
    const response = await authApi.register('', generateUniqueEmail(), strongPassword);
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toContain('Please provide all fields');
  });

  test('TC-API-003: Register with empty email returns 400', async () => {
    const response = await authApi.register('Test', '', strongPassword);
    expect(response.status()).toBe(400);
    expect((await response.json()).message).toContain('Please provide all fields');
  });

  test('TC-API-004: Register with empty password returns 400', async () => {
    const response = await authApi.register('Test', generateUniqueEmail(), '');
    expect(response.status()).toBe(400);
  });

  test('TC-API-005: Register with invalid email format returns 400', async () => {
    const response = await authApi.register('Test', invalidData.invalidEmail, strongPassword);
    expect(response.status()).toBe(400);
    expect((await response.json()).message).toContain('valid email');
  });

  test('TC-API-006: Register with weak password returns 400', async () => {
    const response = await authApi.register('Test', generateUniqueEmail(), invalidData.weakPassword);
    expect(response.status()).toBe(400);
    expect((await response.json()).message).toContain('Password must be at least 8 characters');
  });

  test('TC-API-007: Register with duplicate email returns 400', async () => {
    const response = await authApi.register('Test', testCredentials.email, strongPassword);
    expect(response.status()).toBe(400);
    expect((await response.json()).message).toContain('already exists');
  });

  test('TC-API-008: Register with password missing uppercase returns 400', async () => {
    const response = await authApi.register('Test', generateUniqueEmail(), 'test@12345');
    expect(response.status()).toBe(400);
  });

  test('TC-API-009: Register with password missing special char returns 400', async () => {
    const response = await authApi.register('Test', generateUniqueEmail(), 'Test12345');
    expect(response.status()).toBe(400);
  });

  test('TC-API-010: Register with password missing number returns 400', async () => {
    const response = await authApi.register('Test', generateUniqueEmail(), 'Test@abcd');
    expect(response.status()).toBe(400);
  });

  // ============ LOGIN TESTS ============
  test('TC-API-011: Login with valid credentials returns 200 and token', async () => {
    const response = await authApi.login(testCredentials.email, testCredentials.password);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(body.email).toBe(testCredentials.email);
  });

  test('TC-API-012: Login with empty email returns 400', async () => {
    const response = await authApi.login('', testCredentials.password);
    expect(response.status()).toBe(400);
    expect((await response.json()).message).toContain('provide both email and password');
  });

  test('TC-API-013: Login with empty password returns 400', async () => {
    const response = await authApi.login(testCredentials.email, '');
    expect(response.status()).toBe(400);
  });

  test('TC-API-014: Login with wrong password returns 401', async () => {
    const response = await authApi.login(testCredentials.email, 'WrongPassword123@');
    expect(response.status()).toBe(401);
    expect((await response.json()).message).toContain('Invalid email or password');
  });

  test('TC-API-015: Login with unregistered email returns 401', async () => {
    const response = await authApi.login('notregistered999@example.com', strongPassword);
    expect(response.status()).toBe(401);
  });

  test('TC-API-016: Login is case-sensitive for password', async () => {
    const response = await authApi.login(testCredentials.email, testCredentials.password.toLowerCase());
    expect(response.status()).toBe(401);
  });
});