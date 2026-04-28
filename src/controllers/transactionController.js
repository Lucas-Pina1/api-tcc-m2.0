const transactionService = require('../services/transactionService');
const { sendSuccess } = require('../utils/responseHelper');

/**
 * TransactionController — Camada de orquestração HTTP para Movimentações.
 *
 * Responsabilidades:
 * - Extrair dados do request
 * - Delegar ao service
 * - Retornar response com status code adequado
 */

/**
 * POST /api/transactions
 * Registra uma nova movimentação financeira. (US03)
 */
async function create(req, res, next) {
  try {
    const transaction = transactionService.createTransaction(req.userId, req.body);
    return sendSuccess(res, 201, 'Movimentação registrada com sucesso.', { transaction });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/transactions/:id/pay
 * Efetiva o pagamento de uma movimentação. (US04)
 */
async function pay(req, res, next) {
  try {
    const { id } = req.params;
    const transaction = transactionService.payTransaction(req.userId, id);
    return sendSuccess(res, 200, 'Movimentação marcada como paga com sucesso.', { transaction });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/transactions/:id
 * Exclui uma movimentação. (US05)
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    transactionService.deleteTransaction(req.userId, id);
    return sendSuccess(res, 200, 'Movimentação excluída com sucesso.');
  } catch (error) {
    next(error);
  }
}

module.exports = { create, pay, remove };
