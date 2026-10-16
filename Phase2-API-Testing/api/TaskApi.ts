import { APIRequestContext } from '@playwright/test';

export class TaskApi {
  readonly request: APIRequestContext;
  private token: string;

  constructor(request: APIRequestContext, token: string = '') {
    this.request = request;
    this.token = token;
  }

  private authHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  async getAllTasks() {
    return await this.request.get('/api/tasks', {
      headers: this.authHeaders(),
    });
  }

  async createTask(data: { title: string; description?: string; status?: string; dueDate?: string }) {
    return await this.request.post('/api/tasks', {
      headers: this.authHeaders(),
      data,
    });
  }

  async updateTask(taskId: string, data: Partial<{ title: string; description: string; status: string }>) {
    return await this.request.put(`/api/tasks/${taskId}`, {
      headers: this.authHeaders(),
      data,
    });
  }

  async deleteTask(taskId: string) {
    return await this.request.delete(`/api/tasks/${taskId}`, {
      headers: this.authHeaders(),
    });
  }
}