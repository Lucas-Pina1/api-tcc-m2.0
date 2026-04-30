const transactionModel = require('../models/transactionModel');
const AppError = require('../utils/AppError');

/**
 * Cria uma nova movimentação (US03).
 *
 * @param {string} userId - ID do usuário dono da movimentação.
 * @param {object} data - Dados da movimentação (description, value, date, category, status).
 * @returns {object} - Movimentação criada.
 */
function createTransaction(userId, data) {
  const { description, value, date, category, status } = data;

  if (!description || value === undefined || value === null || !date || !category || !status) {
    throw new AppError('Todos os campos são obrigatórios (description, value, date, category, status).', 400);
  }

  // RN04 - Validação de Valores Monetários
  if (typeof value !== 'number' || value <= 0) {
    throw new AppError('O valor da movimentação deve ser maior que zero (RN04).', 422);
  }

  if (!['receita', 'despesa'].includes(category)) {
    throw new AppError('A categoria deve ser "receita" ou "despesa".', 422);
  }

  if (!['pendente', 'pago'].includes(status)) {
    throw new AppError('O status deve ser "pendente" ou "pago".', 422);
  }

  return transactionModel.create(userId, { description, value, date, category, status });
}

/**
 * Retorna o extrato cronolÃ³gico e o saldo consolidado do usuÃ¡rio (US06).
 *
 * @param {string} userId - ID do usuÃ¡rio autenticado.
 * @returns {{ transactions: Array<object>, balance: number }}
 */
function getStatement(userId) {
  const transactions = transactionModel
    .findByUserId(userId)
    .slice()
    .sort((first, second) => {
      const byDate = first.date.localeCompare(second.date);
      if (byDate !== 0) {
        return byDate;
      }

      return first.createdAt.localeCompare(second.createdAt);
    });

  const balance = transactions.reduce((total, transaction) => {
    if (transaction.category === 'receita') {
      return total + transaction.value;
    }

    return total - transaction.value;
  }, 0);

  return { transactions, balance };
}

/**
 * Efetiva o pagamento de uma movimentação (US04).
 *
 * @param {string} userId - ID do usuário que fez a requisição.
 * @param {string} transactionId - ID da movimentação.
 * @returns {object} - Movimentação atualizada.
 */
function payTransaction(userId, transactionId) {
  const transaction = transactionModel.findById(transactionId);

  if (!transaction) {
    throw new AppError('Movimentação não encontrada.', 404);
  }

  // RN02 - Isolamento de Dados
  if (transaction.userId !== userId) {
    throw new AppError('Acesso negado. Esta movimentação não pertence a você (RN02).', 403);
  }

  // RN05 - Fluxo Unidirecional de Status
  if (transaction.status === 'pago') {
    throw new AppError('Esta movimentação já consta como "paga" e não pode retornar a pendente (RN05).', 422);
  }

  return transactionModel.update(transactionId, { status: 'pago' });
}

/**
 * Exclui uma movimentação (US05).
 *
 * @param {string} userId - ID do usuário.
 * @param {string} transactionId - ID da movimentação.
 */
function deleteTransaction(userId, transactionId) {
  const transaction = transactionModel.findById(transactionId);

  if (!transaction) {
    throw new AppError('Movimentação não encontrada.', 404);
  }

  // RN02 - Isolamento de Dados
  if (transaction.userId !== userId) {
    throw new AppError('Acesso negado. Esta movimentação não pertence a você (RN02).', 403);
  }

  // RN06 - Proteção de Histórico de Pagamentos
  if (transaction.status === 'pago') {
    throw new AppError('Movimentações com status "pago" são históricas e não podem ser excluídas (RN06).', 422);
  }

  transactionModel.remove(transactionId);
}

module.exports = {
  createTransaction,
  getStatement,
  payTransaction,
  deleteTransaction,
};
