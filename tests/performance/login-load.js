import { check, sleep } from 'k6';
import { buildUniqueUser, loginUser, registerUser } from './helpers/api.js';

export const options = {
  stages: [
    { duration: '15s', target: 5 },
    { duration: '30s', target: 5 },
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<700'],
  },
};

export function setup() {
  const user = buildUniqueUser('login');
  const registerResponse = registerUser(user);

  return {
    user,
    registerStatus: registerResponse.status,
  };
}

export default function (data) {
  const response = loginUser({
    email: data.user.email,
    password: data.user.password,
  });

  check(response, {
    'usuario base foi cadastrado no setup': () => data.registerStatus === 201,
    'login retorna 200': (res) => res.status === 200,
    'login retorna token JWT': (res) => {
      const token = res.json('data.token');
      return typeof token === 'string' && token.split('.').length === 3;
    },
    'login retorna success true': (res) => res.json('success') === true,
  });

  sleep(1);
}
