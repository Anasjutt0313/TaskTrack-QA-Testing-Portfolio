export function generateUniqueEmail(prefix: string = 'user'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}${random}@example.com`;
}

export function generateUniqueName(prefix: string = 'Test User'): string {
  return `${prefix} ${Date.now()}`;
}

export const validCredentials = {
  email: process.env.TEST_EMAIL || 'hafizanas0313@gmail.com',
  password: process.env.TEST_PASSWORD || 'Pakistan786@',
};

export const testData = {
  validFullName: 'Hafiz Anas',
  validPassword: 'Test@12345',
  invalidEmail: 'invalid-email',
  weakPassword: '123',
  emptyString: '',
};  