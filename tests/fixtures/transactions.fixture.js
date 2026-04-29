/**
 * Fixtures para Movimentações Financeiras
 */

const VALID_INCOME = {
  description: 'Salário',
  value: 5000.0,
  date: '2026-05-01',
  category: 'receita',
  status: 'pago',
};

const VALID_EXPENSE = {
  description: 'Aluguel',
  value: 1500.0,
  date: '2026-05-05',
  category: 'despesa',
  status: 'pendente',
};

const INVALID_ZERO_AMOUNT = {
  ...VALID_INCOME,
  value: 0,
};

const INVALID_NEGATIVE_AMOUNT = {
  ...VALID_INCOME,
  value: -50.0,
};

const INVALID_CATEGORY = {
  ...VALID_INCOME,
  category: 'transferencia',
};

const INVALID_STATUS = {
  ...VALID_INCOME,
  status: 'atrasado',
};

const TRANSACTIONS_EMPTY_BODY = {};

module.exports = {
  VALID_INCOME,
  VALID_EXPENSE,
  INVALID_ZERO_AMOUNT,
  INVALID_NEGATIVE_AMOUNT,
  INVALID_CATEGORY,
  INVALID_STATUS,
  TRANSACTIONS_EMPTY_BODY,
};
