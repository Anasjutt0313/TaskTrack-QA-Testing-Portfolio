import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { validCredentials } from '../../utils/testData';

test.describe('Add Task Tests', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validCredentials.email, validCredentials.password);
    
    // Wait for dashboard URL
    await page.waitForURL('/', { timeout: 15000 });
    
    dashboardPage = new DashboardPage(page);
  });

  test('TC-201: Dashboard displays welcome message', async () => {
    await expect(dashboardPage.welcomeMessage).toBeVisible({ timeout: 5000 });
  });

  test('TC-202: Add task with valid title and description', async ({ page }) => {
    const title = `Test Task ${Date.now()}`;
    await dashboardPage.addTask(title, 'This is a test description');
    await page.waitForTimeout(1500);
    await expect(page.getByText(title)).toBeVisible({ timeout: 5000 });
  });

  test('TC-203: Add task with only title (no description)', async ({ page }) => {
    const title = `Only Title ${Date.now()}`;
    await dashboardPage.addTask(title, '');
    await page.waitForTimeout(1500);
    await expect(page.getByText(title)).toBeVisible({ timeout: 5000 });
  });


  test('TC-205: Add task with long title', async ({ page }) => {
    const longTitle = `Long_${'A'.repeat(150)}_${Date.now()}`;
    await dashboardPage.addTask(longTitle, 'Long title test');
    await page.waitForTimeout(1500);
  });

  test('TC-206: Add task with special characters', async ({ page }) => {
    const specialTitle = `Task @#$% ${Date.now()}`;
    await dashboardPage.addTask(specialTitle, 'Special chars test');
    await page.waitForTimeout(1500);
    await expect(page.getByText(specialTitle)).toBeVisible({ timeout: 5000 });
  });
});