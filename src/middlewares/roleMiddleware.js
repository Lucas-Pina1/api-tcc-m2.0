const AppError = require('../utils/AppError');

function requireAdmin(req, _res, next) {
  if (req.userRole !== 'admin') {
    throw new AppError('Acesso negado. Esta rota é exclusiva para administradores.', 403);
  }

  return next();
}

function forbidAdminFinancialAccess(req, _res, next) {
  if (req.userRole === 'admin') {
    throw new AppError('Acesso negado. Administradores não podem acessar dados financeiros (RN03).', 403);
  }

  return next();
}

module.exports = {
  requireAdmin,
  forbidAdminFinancialAccess,
};
