import { check, group } from 'k6';
import {
  buildUniqueUser,
  createTransaction,
  getHealth,
  getStatement,
  loginUser,
  registerUser,
} from './helpers/api.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export function setup() {
  const user = buildUniqueUser('smoke');
  const registerResponse = registerUser(user);
  const loginResponse = loginUser({
    email: user.email,
    password: user.password,
  });
  const token = loginResponse.json('data.token');

  createTransaction(token, {
    description: 'Salario smoke',
    value: 1000,
    date: '2026-05-01',
    category: 'receita',
    status: 'pago',
  });

  return {
    registerStatus: registerResponse.status,
    loginStatus: loginResponse.status,
    token,
    email: user.email,
  };
}

export default function (data) {
  group('Smoke - Health', function () {
    const response = getHealth();

    check(response, {
      'health retorna 200': (res) => res.status === 200,
      'health retorna success true': (res) => res.json('success') === true,
    });
  });

  group('Smoke - Login', function () {
    check(data, {
      'setup registrou usuario': (ctx) => ctx.registerStatus === 201,
      'setup autenticou usuario': (ctx) => ctx.loginStatus === 200,
      'setup obteve token': (ctx) => typeof ctx.token === 'string' && ctx.token.length > 20,
    });
  });

  group('Smoke - Statement', function () {
    const response = getStatement(data.token);

    check(response, {
      'statement retorna 200': (res) => res.status === 200,
      'statement retorna transacoes': (res) => Array.isArray(res.json('data.transactions')),
      'statement retorna saldo numerico': (res) => typeof res.json('data.balance') === 'number',
      'statement tem ao menos um lancamento': (res) => res.json('data.transactions').length >= 1,
    });
  });
}
