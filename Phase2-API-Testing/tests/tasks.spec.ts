import { test, expect } from '@playwright/test';
import { AuthApi } from '../api/AuthApi';
import { TaskApi } from '../api/TaskApi';
import { testCredentials } from '../utils/apiTestData';

test.describe('Tasks API Tests', () => {
  let authApi: AuthApi;
  let taskApi: TaskApi;
  let token: string;

  test.beforeEach(async ({ request }) => {
    authApi = new AuthApi(request);
    token = await authApi.loginAndGetToken(testCredentials.email, testCredentials.password);
    taskApi = new TaskApi(request, token);
  });

  test('TC-API-101: Get all tasks returns 200 with array', async () => {
    const response = await taskApi.getAllTasks();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('TC-API-102: Create task with valid data returns 201', async () => {
    const title = `API Task ${Date.now()}`;
    const response = await taskApi.createTask({
      title,
      description: 'Created via API test',
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe(title);
    expect(body.status).toBe('pending');
    expect(body).toHaveProperty('_id');
  });

  test('TC-API-103: Create task with empty title returns 400', async () => {
    const response = await taskApi.createTask({ title: '' });
    expect(response.status()).toBe(400);
    expect((await response.json()).message).toContain('title is required');
  });

  test('TC-API-104: Create task with only title works', async () => {
    const response = await taskApi.createTask({ title: `Title Only ${Date.now()}` });
    expect(response.status()).toBe(201);
  });

  test('TC-API-105: Create task with invalid status returns 500', async () => {
    const response = await taskApi.createTask({
      title: `Invalid Status ${Date.now()}`,
      status: 'invalid-status',
    });
    // Mongoose enum validation → 500 (or could be 400 depending on error handler)
    expect([400, 500]).toContain(response.status());
  });

  test('TC-API-106: Create task with all fields returns 201', async () => {
    const response = await taskApi.createTask({
      title: `Full Task ${Date.now()}`,
      description: 'Full description',
      status: 'in-progress',
      dueDate: '2026-12-31',
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.status).toBe('in-progress');
  });

  test('TC-API-107: Update task title returns 200', async ({ request }) => {
    const createRes = await taskApi.createTask({ title: `Update ${Date.now()}` });
    const created = await createRes.json();

    const updateRes = await taskApi.updateTask(created._id, { title: 'Updated Title' });
    expect(updateRes.status()).toBe(200);
    const updated = await updateRes.json();
    expect(updated.title).toBe('Updated Title');
  });

  test('TC-API-108: Update task status to completed returns 200', async () => {
    const createRes = await taskApi.createTask({ title: `Status ${Date.now()}` });
    const created = await createRes.json();

    const updateRes = await taskApi.updateTask(created._id, { status: 'completed' });
    expect(updateRes.status()).toBe(200);
    expect((await updateRes.json()).status).toBe('completed');
  });

  test('TC-API-109: Update non-existent task returns 404', async () => {
    const fakeId = '000000000000000000000000';
    const response = await taskApi.updateTask(fakeId, { title: 'Ghost' });
    expect(response.status()).toBe(404);
    expect((await response.json()).message).toContain('not found');
  });

  test('TC-API-110: Delete task returns 200 with success message', async () => {
    const createRes = await taskApi.createTask({ title: `Delete Me ${Date.now()}` });
    const created = await createRes.json();

    const deleteRes = await taskApi.deleteTask(created._id);
    expect(deleteRes.status()).toBe(200);
    const body = await deleteRes.json();
    expect(body.message).toContain('deleted');
  });

  test('TC-API-111: Delete non-existent task returns 404', async () => {
    const fakeId = '000000000000000000000000';
    const response = await taskApi.deleteTask(fakeId);
    expect(response.status()).toBe(404);
  });

  test('TC-API-112: Deleted task no longer exists in list', async () => {
    const createRes = await taskApi.createTask({ title: `Gone ${Date.now()}` });
    const created = await createRes.json();

    await taskApi.deleteTask(created._id);

    const listRes = await taskApi.getAllTasks();
    const tasks = await listRes.json();
    const found = tasks.find((t: any) => t._id === created._id);
    expect(found).toBeUndefined();
  });
});