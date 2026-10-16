import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { generateUniqueEmail } from '../../utils/testData';

test.describe('Registration Tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('TC-001: Register page loads with all fields', async ({ page }) => {
    await expect(registerPage.fullNameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.createAccountButton).toBeVisible();
  });

  test('TC-002: Register with valid data creates account', async ({ page }) => {
    await registerPage.register('New User', generateUniqueEmail(), 'Test@12345');
    await expect(page).toHaveURL(/\/(login|$)/);
  });

  test('TC-003: Register with empty Full Name shows validation', async ({ page }) => {
    await registerPage.register('', 'test@example.com', 'Test@12345');
    // Expected: validation error or form blocked
    await expect(page).toHaveURL(/register/);
  });

  test('TC-004: Register with invalid email format fails', async ({ page }) => {
    await registerPage.register('Test', 'invalid-email', 'Test@12345');
    await expect(page).toHaveURL(/register/);
  });

  test('TC-005: Register with weak password fails', async ({ page }) => {
    await registerPage.register('Test', generateUniqueEmail(), '123');
    await expect(page).toHaveURL(/register/);
  });

  test('TC-006: Register with existing email fails', async ({ page }) => {
    await registerPage.register('Test', 'hafizanas.se@gmail.com', 'Test@12345');
    await expect(page).toHaveURL(/register/);
  });

  test('TC-007: "Sign in" link routes to login', async ({ page }) => {
    await registerPage.signInLink.click();
    await expect(page).toHaveURL(/login/);
  });

  test('TC-008: Password field masks characters', async ({ page }) => {
    await registerPage.passwordInput.fill('Test@12345');
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'password');
  });
});