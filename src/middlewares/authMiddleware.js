const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const AppError = require('../utils/AppError');

/**
 * authMiddleware — Middleware de proteção de rotas.
 *
 * Verifica se o header Authorization contém um token JWT válido.
 * Se válido, injeta req.userId e req.userRole para uso nos controllers.
 */
function authMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization;

  // Verifica presença do header
  if (!authHeader) {
    throw new AppError('Token de autenticação não fornecido.', 401);
  }

  // Verifica formato "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new AppError(
      'Formato de token inválido. Utilize: Bearer <token>',
      401
    );
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, authConfig.secret);

    // Injeta dados do usuário no request
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expirado. Realize o login novamente.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Token inválido.', 401);
    }

    throw new AppError('Falha na autenticação do token.', 401);
  }
}

module.exports = authMiddleware;
