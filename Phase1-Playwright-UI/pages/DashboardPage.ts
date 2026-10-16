import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;
  readonly taskTitleInput: Locator;
  readonly taskDescriptionInput: Locator;
  readonly addTaskButton: Locator;
  readonly taskList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.getByText(/Welcome, /);
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.taskTitleInput = page.locator('input[placeholder="Task Title (Required)"]');
    this.taskDescriptionInput = page.locator('input[placeholder="Short Description (Optional)"]');
    this.addTaskButton = page.getByRole('button', { name: 'Add Task' });
    this.taskList = page.locator('.task-card, [class*="task"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTask(title: string, description: string) {
    await this.taskTitleInput.fill(title);
    await this.taskDescriptionInput.fill(description);
    await this.addTaskButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}