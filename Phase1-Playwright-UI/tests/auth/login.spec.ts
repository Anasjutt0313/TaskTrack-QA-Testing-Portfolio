import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { validCredentials, testData } from '../../utils/testData';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC-101: Login page loads with all fields', async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
  });

  test('TC-102: Login with valid credentials succeeds', async ({ page }) => {
    await loginPage.login(validCredentials.email, validCredentials.password);
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('/');
  });

  test('TC-103: Login with wrong password fails', async ({ page }) => {
    await loginPage.login(validCredentials.email, 'WrongPassword123');
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/login/);
  });

  test('TC-104: Login with empty email is blocked', async ({ page }) => {
    await loginPage.login('', testData.validPassword);
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/login/);
  });

  test('TC-105: Login with empty password is blocked', async ({ page }) => {
    await loginPage.login(validCredentials.email, '');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/login/);
  });

  test('TC-106: Login with invalid email format is blocked', async ({ page }) => {
    await loginPage.login(testData.invalidEmail, testData.validPassword);
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/login/);
  });

  test('TC-107: Password field masks characters', async () => {
    await loginPage.passwordInput.fill('Test@12345');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC-108: "Sign up" link routes to Register page', async ({ page }) => {
    await loginPage.signUpLink.click();
    await expect(page).toHaveURL(/register/);
  });
});