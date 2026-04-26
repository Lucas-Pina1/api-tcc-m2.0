const authService = require('../services/authService');
const { sendSuccess } = require('../utils/responseHelper');

/**
 * AuthController — Camada de orquestração HTTP.
 *
 * Responsabilidades:
 * - Extrair dados do request
 * - Delegar ao service
 * - Retornar response com status code adequado
 *
 * NÃO contém regra de negócio.
 */

/**
 * POST /api/auth/register
 * Cadastra um novo usuário.
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register({ name, email, password });

    return sendSuccess(res, 201, 'Usuário cadastrado com sucesso.', { user });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Autentica um usuário e retorna o token JWT.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    return sendSuccess(res, 200, 'Login realizado com sucesso.', {
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/profile
 * Retorna o perfil do usuário autenticado.
 * Rota protegida pelo authMiddleware.
 */
async function getProfile(req, res, next) {
  try {
    const user = authService.getProfile(req.userId);

    return sendSuccess(res, 200, 'Perfil do usuário obtido com sucesso.', { user });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getProfile };
