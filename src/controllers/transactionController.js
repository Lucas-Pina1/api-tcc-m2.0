const transactionService = require('../services/transactionService');
const { sendSuccess } = require('../utils/responseHelper');

/**
 * TransactionController - Camada de orquestracao HTTP para Movimentacoes.
 *
 * Responsabilidades:
 * - Extrair dados do request
 * - Delegar ao service
 * - Retornar response com status code adequado
 */

/**
 * POST /api/transactions
 * Registra uma nova movimentacao financeira. (US03)
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
 * GET /api/transactions
 * Retorna o extrato e saldo do usuario autenticado. (US06)
 */
async function list(req, res, next) {
  try {
    const statement = transactionService.getStatement(req.userId);
    return sendSuccess(res, 200, 'Extrato financeiro obtido com sucesso.', statement);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/transactions/:id/pay
 * Efetiva o pagamento de uma movimentacao. (US04)
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
 * Exclui uma movimentacao. (US05)
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

module.exports = { create, list, pay, remove };
