const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const authConfig = require('../config/auth');
const AppError = require('../utils/AppError');

/**
 * AuthService — Camada de regras de negócio para autenticação.
 *
 * Responsabilidades:
 * - Validar dados de entrada
 * - Verificar unicidade de e-mail (RN01)
 * - Gerar hash de senha
 * - Gerar token JWT
 * - Validar credenciais de login
 */

const SALT_ROUNDS = 10;

/**
 * Registra um novo usuário no sistema.
 *
 * @param {object} userData — { name, email, password }
 * @returns {object} — Usuário criado (sem senha)
 * @throws {AppError} — 409 se e-mail já estiver cadastrado
 * @throws {AppError} — 400 se campos obrigatórios estiverem ausentes
 */
async function register(userData) {
  const { name, email, password } = userData;

  // Validação de campos obrigatórios
  const missingFields = [];
  if (!name || !name.trim()) missingFields.push('name');
  if (!email || !email.trim()) missingFields.push('email');
  if (!password) missingFields.push('password');

  if (missingFields.length > 0) {
    throw new AppError(
      'Campos obrigatórios não preenchidos.',
      400,
      { missingFields }
    );
  }

  // Validação de formato de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Formato de e-mail inválido.', 400);
  }

  // Validação de senha (mínimo 6 caracteres)
  if (password.length < 6) {
    throw new AppError(
      'A senha deve conter no mínimo 6 caracteres.',
      400
    );
  }

  // RN01 — Unicidade de e-mail
  const existingUser = userModel.findByEmail(email.toLowerCase());
  if (existingUser) {
    throw new AppError(
      'Este e-mail já está cadastrado na plataforma.',
      409
    );
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Persistência
  const newUser = userModel.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  });

  return newUser;
}

/**
 * Autentica um usuário e retorna um token JWT.
 *
 * @param {object} credentials — { email, password }
 * @returns {object} — { user, token }
 * @throws {AppError} — 400 se campos estiverem ausentes
 * @throws {AppError} — 401 se credenciais forem inválidas
 */
async function login(credentials) {
  const { email, password } = credentials;

  // Validação de campos obrigatórios
  if (!email || !password) {
    throw new AppError(
      'E-mail e senha são obrigatórios.',
      400,
      { missingFields: [!email && 'email', !password && 'password'].filter(Boolean) }
    );
  }

  // Busca usuário
  const user = userModel.findByEmail(email.toLowerCase());
  if (!user) {
    throw new AppError(
      'E-mail ou senha incorretos.',
      401
    );
  }

  // Verifica senha
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(
      'E-mail ou senha incorretos.',
      401
    );
  }

  // Gera token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    authConfig.secret,
    { expiresIn: authConfig.expiresIn }
  );

  // Retorna dados do usuário sem a senha
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
}

/**
 * Busca o perfil de um usuário pelo ID.
 *
 * @param {string} userId
 * @returns {object} — Dados do usuário (sem senha)
 * @throws {AppError} — 404 se não encontrado
 */
function getProfile(userId) {
  const user = userModel.findById(userId);
  if (!user) {
    throw new AppError('Usuário não encontrado.', 404);
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

module.exports = { register, login, getProfile };
