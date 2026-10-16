export function generateUniqueEmail(prefix: string = 'apitest'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}${random}@example.com`;
}

export const validUser = {
  name: 'API Test User',
  email: 'hafizanas0313@gmail.com',
  password: 'Pakistan786@',
};

export const testCredentials = {
  email: 'hafizanas0313@gmail.com',
  password: 'Pakistan786@',
};

export const invalidData = {
  invalidEmail: 'invalid-email',
  weakPassword: '123',
  emptyString: '',
};

export const strongPassword = 'Test@12345';