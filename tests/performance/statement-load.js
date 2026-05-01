import { check, sleep } from 'k6';
import {
  buildUniqueUser,
  createTransaction,
  getStatement,
  loginUser,
  registerUser,
} from './helpers/api.js';

export const options = {
  stages: [
    { duration: '15s', target: 4 },
    { duration: '30s', target: 4 },
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<700'],
  },
};

export function setup() {
  const sessions = [];

  for (let index = 0; index < 4; index += 1) {
    const user = buildUniqueUser(`statement-${index}`);
    registerUser(user);

    const loginResponse = loginUser({
      email: user.email,
      password: user.password,
    });

    const token = loginResponse.json('data.token');

    createTransaction(token, {
      description: `Receita ${index}`,
      value: 1000 + index,
      date: '2026-05-10',
      category: 'receita',
      status: 'pago',
    });

    createTransaction(token, {
      description: `Despesa ${index}`,
      value: 250 + index,
      date: '2026-05-12',
      category: 'despesa',
      status: 'pendente',
    });

    sessions.push({
      email: user.email,
      token,
    });
  }

  return { sessions };
}

export default function (data) {
  const session = data.sessions[(__VU - 1) % data.sessions.length];
  const response = getStatement(session.token);

  check(response, {
    'statement retorna 200': (res) => res.status === 200,
    'statement retorna success true': (res) => res.json('success') === true,
    'statement retorna exatamente duas transacoes': (res) => res.json('data.transactions').length === 2,
    'statement retorna saldo numerico': (res) => typeof res.json('data.balance') === 'number',
  });

  sleep(1);
}
