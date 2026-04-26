/**
 * responseHelper — Funções utilitárias para padronização de respostas HTTP.
 *
 * Garante que TODA resposta da API siga o contrato:
 * { success: boolean, message: string, data?: any }
 */

/**
 * Envia uma resposta de sucesso padronizada.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} [data]
 */
function sendSuccess(res, statusCode, message, data = null) {
  const response = { success: true, message };
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
}

/**
 * Envia uma resposta de erro padronizada.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} [details]
 */
function sendError(res, statusCode, message, details = null) {
  const response = { success: false, message };
  if (details !== null && details !== undefined) {
    response.details = details;
  }
  return res.status(statusCode).json(response);
}

module.exports = { sendSuccess, sendError };
