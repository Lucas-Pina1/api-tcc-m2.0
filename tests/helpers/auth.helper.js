/**
 * Auth Helper — Funções reutilizáveis de autenticação.
 *
 * Encapsula operações comuns de registro e login
 * para serem reutilizadas como pré-condição de testes.
 */

const request = require('./request');

/**
 * Registra um novo usuário na API.
 *
 * @param {object} userData - { name, email, password }
 * @returns {Promise<object>} - Response do SuperTest
 */
async function registerUser(userData) {
  return request
    .post('/api/auth/register')
    .send(userData)
    .set('Content-Type', 'application/json');
}

/**
 * Realiza login na API.
 *
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} - Response do SuperTest
 */
async function loginUser(credentials) {
  return request
    .post('/api/auth/login')
    .send(credentials)
    .set('Content-Type', 'application/json');
}

/**
 * Registra um usuário e realiza login, retornando o token JWT.
 * Útil para pré-condições de testes que exigem autenticação.
 *
 * @param {object} userData - { name, email, password }
 * @returns {Promise<string>} - Token JWT
 */
async function registerAndGetToken(userData) {
  await registerUser(userData);

  const loginRes = await loginUser({
    email: userData.email,
    password: userData.password,
  });

  return loginRes.body.data.token;
}

/**
 * Acessa o perfil do usuário autenticado.
 *
 * @param {string} token - Token JWT válido
 * @returns {Promise<object>} - Response do SuperTest
 */
async function getProfile(token) {
  return request
    .get('/api/auth/profile')
    .set('Authorization', `Bearer ${token}`);
}

module.exports = {
  registerUser,
  loginUser,
  registerAndGetToken,
  getProfile,
};
