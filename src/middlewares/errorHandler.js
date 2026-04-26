const { sendError } = require('../utils/responseHelper');

/**
 * errorHandler — Middleware global de tratamento de erros.
 *
 * Captura TODOS os erros da aplicação (throw, next(error))
 * e retorna uma resposta padronizada.
 *
 * Diferencia erros operacionais (AppError) de erros inesperados.
 */

// eslint-disable-next-line no-unused-vars
function errorHandler(error, _req, res, _next) {
  // Log do erro no servidor (útil para debugging/monitoramento)
  console.error(`[ERROR] ${error.message}`);
  if (!error.isOperational) {
    console.error(error.stack);
  }

  // Erros operacionais (AppError) — esperados pelo fluxo
  if (error.isOperational) {
    return sendError(res, error.statusCode, error.message, error.details);
  }

  // Erros de parsing JSON (body inválido)
  if (error.type === 'entity.parse.failed') {
    return sendError(
      res,
      400,
      'O corpo da requisição contém JSON inválido.'
    );
  }

  // Erros inesperados — nunca expor detalhes internos ao cliente
  return sendError(
    res,
    500,
    'Ocorreu um erro interno no servidor. Tente novamente mais tarde.'
  );
}

module.exports = errorHandler;
