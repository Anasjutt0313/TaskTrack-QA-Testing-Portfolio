import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly createAccountButton: Locator;
  readonly signInLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput = page.locator('input[placeholder="John Doe"]');
    this.emailInput = page.locator('input[placeholder="you@example.com"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/register');
  }

  async register(fullName: string, email: string, password: string) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.createAccountButton.click();
  }
}