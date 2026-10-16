import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { generateUniqueEmail } from '../../utils/testData';

test.describe('End-to-End Full Flow', () => {
  test('TC-301: Complete flow — register, login, add task, logout', async ({ page }) => {
    const email = generateUniqueEmail();
    const password = 'Test@12345';

    // Step 1: Register
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register('E2E User', email, password);

    // Step 2: Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);
    await expect(page).toHaveURL('/');

    // Step 3: Add Task
    const dashboardPage = new DashboardPage(page);
    const taskTitle = `E2E Task ${Date.now()}`;
    await dashboardPage.addTask(taskTitle, 'E2E test description');
    await expect(page.getByText(taskTitle)).toBeVisible();

    // Step 4: Logout
    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/);
  });
});