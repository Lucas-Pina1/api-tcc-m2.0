const { v4: uuidv4 } = require('uuid');

const transactions = [];

/**
 * Busca uma transação pelo ID.
 * @param {string} id
 * @returns {object|undefined}
 */
function findById(id) {
  return transactions.find((t) => t.id === id);
}

/**
 * Busca todas as transações de um usuário específico.
 * @param {string} userId
 * @returns {Array<object>}
 */
function findByUserId(userId) {
  return transactions.filter((t) => t.userId === userId);
}

/**
 * Cria uma nova movimentação.
 * @param {string} userId
 * @param {object} data
 * @returns {object}
 */
function create(userId, data) {
  const newTransaction = {
    id: uuidv4(),
    userId,
    description: data.description,
    value: data.value,
    date: data.date,
    category: data.category,
    status: data.status || 'pendente',
    createdAt: new Date().toISOString(),
  };

  transactions.push(newTransaction);
  return newTransaction;
}

/**
 * Atualiza propriedades de uma transação.
 * @param {string} id
 * @param {object} updates
 * @returns {object}
 */
function update(id, updates) {
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return null;

  transactions[index] = { ...transactions[index], ...updates };
  return transactions[index];
}

/**
 * Remove uma transação.
 * @param {string} id
 * @returns {boolean}
 */
function remove(id) {
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return false;

  transactions.splice(index, 1);
  return true;
}

/**
 * Limpa o array (para testes).
 */
function clearAll() {
  transactions.length = 0;
}

module.exports = {
  findById,
  findByUserId,
  create,
  update,
  remove,
  clearAll,
};
