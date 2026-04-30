/**
 * Users Fixture — Dados de teste para operações de usuários.
 *
 * Centraliza todos os payloads utilizados nos testes,
 * garantindo consistência e facilitando manutenção.
 *
 * Convenção de nomenclatura:
 * - VALID_*   → Dados válidos (cenários positivos)
 * - INVALID_* → Dados inválidos (cenários negativos)
 * - MISSING_* → Dados com campos ausentes
 */

const VALID_USER = {
  name: 'Usuario Teste',
  email: 'usuario.teste@email.com',
  password: 'senha123',
};

const VALID_USER_LOGIN = {
  name: 'Login Teste',
  email: 'login.teste@email.com',
  password: 'senha123',
};

const VALID_USER_E2E = {
  name: 'E2E Teste',
  email: 'e2e.teste@email.com',
  password: 'senha123',
};

const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'admin@fincontrol.local',
  password: 'admin123',
};

const VALID_USER_DUPLICATE_BASE = {
  name: 'Primeiro Cadastro',
  email: 'duplicado@email.com',
  password: 'senha456',
};

const DUPLICATE_USER_SAME_EMAIL = {
  name: 'Outro Usuario',
  email: 'duplicado@email.com',
  password: 'senha789',
};

const DUPLICATE_USER_UPPERCASE = {
  name: 'Uppercase Test',
  email: 'DUPLICADO@EMAIL.COM',
  password: 'senha789',
};

const MISSING_NAME = {
  email: 'semname@email.com',
  password: 'senha123',
};

const MISSING_EMAIL = {
  name: 'Sem Email',
  password: 'senha123',
};

const MISSING_PASSWORD = {
  name: 'Sem Senha',
  email: 'semsenha@email.com',
};

const EMPTY_BODY = {};

const INVALID_EMAIL_FORMAT = {
  name: 'Teste',
  email: 'email-invalido',
  password: 'senha123',
};

const PASSWORD_BELOW_LIMIT = {
  name: 'Teste',
  email: 'limite.baixo@email.com',
  password: '12345',
};

const PASSWORD_AT_LIMIT = {
  name: 'Teste',
  email: 'limite.exato@email.com',
  password: '123456',
};

const INVALID_CREDENTIALS_WRONG_EMAIL = {
  email: 'inexistente@email.com',
  password: 'qualquersenha',
};

const INVALID_CREDENTIALS_WRONG_PASSWORD = {
  email: 'login.teste@email.com',
  password: 'senhaerrada',
};

const LOGIN_MISSING_EMAIL = {
  password: 'senha123',
};

const LOGIN_MISSING_PASSWORD = {
  email: 'login.teste@email.com',
};

const LOGIN_EMPTY_BODY = {};

module.exports = {
  VALID_USER,
  VALID_USER_LOGIN,
  VALID_USER_E2E,
  DEFAULT_ADMIN_CREDENTIALS,
  VALID_USER_DUPLICATE_BASE,
  DUPLICATE_USER_SAME_EMAIL,
  DUPLICATE_USER_UPPERCASE,
  MISSING_NAME,
  MISSING_EMAIL,
  MISSING_PASSWORD,
  EMPTY_BODY,
  INVALID_EMAIL_FORMAT,
  PASSWORD_BELOW_LIMIT,
  PASSWORD_AT_LIMIT,
  INVALID_CREDENTIALS_WRONG_EMAIL,
  INVALID_CREDENTIALS_WRONG_PASSWORD,
  LOGIN_MISSING_EMAIL,
  LOGIN_MISSING_PASSWORD,
  LOGIN_EMPTY_BODY,
};
