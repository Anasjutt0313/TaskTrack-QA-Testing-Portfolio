import { APIRequestContext, expect } from '@playwright/test';

export class AuthApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async register(name: string, email: string, password: string) {
    return await this.request.post('/api/users/register', {
      data: { name, email, password },
    });
  }

  async login(email: string, password: string) {
    return await this.request.post('/api/users/login', {
      data: { email, password },
    });
  }

  async loginAndGetToken(email: string, password: string): Promise<string> {
    const response = await this.login(email, password);
    expect(response.status()).toBe(200);
    const body = await response.json();
    return body.token;
  }
}