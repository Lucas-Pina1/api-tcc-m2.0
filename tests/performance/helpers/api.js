import http from 'k6/http';

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export function buildUniqueUser(prefix = 'k6') {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  return {
    name: `${prefix}-user-${suffix}`,
    email: `${prefix}.${suffix}@email.com`,
    password: 'senha123',
  };
}

export function jsonParams(token) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { headers };
}

export function registerUser(user) {
  return http.post(
    `${BASE_URL}/api/auth/register`,
    JSON.stringify(user),
    jsonParams()
  );
}

export function loginUser(credentials) {
  return http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify(credentials),
    jsonParams()
  );
}

export function createTransaction(token, transaction) {
  return http.post(
    `${BASE_URL}/api/transactions`,
    JSON.stringify(transaction),
    jsonParams(token)
  );
}

export function getStatement(token) {
  return http.get(
    `${BASE_URL}/api/transactions`,
    jsonParams(token)
  );
}

export function getHealth() {
  return http.get(`${BASE_URL}/api/health`);
}
