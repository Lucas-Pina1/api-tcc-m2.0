/**
 * Cleanup Helper — Funções de limpeza de estado para testes.
 *
 * Garante isolamento entre suítes de teste,
 * resetando o repositório in-memory entre execuções.
 */

const userModel = require('../../src/models/userModel');
const transactionModel = require('../../src/models/transactionModel');

/**
 * Limpa todos os registros do repositório de usuários.
 * Deve ser chamado em hooks `beforeEach` ou `afterEach`.
 */
function clearUsers() {
  userModel.clearAll();
}

/**
 * Limpa todos os registros do repositório de movimentações.
 * Deve ser chamado em hooks `beforeEach` ou `afterEach`.
 */
function clearTransactions() {
  transactionModel.clearAll();
}

module.exports = {
  clearUsers,
  clearTransactions,
};
