/**
 * AppError — Classe de erro customizada para a aplicação.
 *
 * Estende Error nativo para incluir statusCode e isOperational,
 * permitindo ao errorHandler distinguir erros de negócio
 * de erros inesperados do sistema.
 */
class AppError extends Error {
  /**
   * @param {string} message — Mensagem descritiva do erro
   * @param {number} statusCode — Código HTTP correspondente
   * @param {object} [details] — Detalhes adicionais (ex: campos inválidos)
   */
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
