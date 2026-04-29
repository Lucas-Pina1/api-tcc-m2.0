const { expect } = require('chai');
const request = require('../helpers/request');
const { registerAndGetToken } = require('../helpers/auth.helper');
const { clearUsers, clearTransactions } = require('../helpers/cleanup.helper');
const {
  VALID_INCOME,
  VALID_EXPENSE,
  INVALID_ZERO_AMOUNT,
  INVALID_NEGATIVE_AMOUNT,
  INVALID_CATEGORY,
  INVALID_STATUS,
  TRANSACTIONS_EMPTY_BODY,
} = require('../fixtures/transactions.fixture');

describe('Movimentações (US03, US04, US05)', function () {
  let tokenA;
  let tokenB;

  beforeEach(async function () {
    clearUsers();
    clearTransactions();

    tokenA = await registerAndGetToken({
      name: 'User A',
      email: 'usera@email.com',
      password: 'senha123',
    });

    tokenB = await registerAndGetToken({
      name: 'User B',
      email: 'userb@email.com',
      password: 'senha123',
    });
  });

  describe('POST /api/transactions (US03)', function () {
    context('TC-OPT-014 - Criacao bem-sucedida de movimentacao (Receita e Despesa)', function () {
      it('deve registrar uma receita e uma despesa com sucesso', async function () {
        // Receita
        const resIncome = await request
          .post('/api/transactions')
          .set('Authorization', `Bearer ${tokenA}`)
          .send(VALID_INCOME);

        expect(resIncome.status).to.equal(201);
        expect(resIncome.body.success).to.be.true;
        expect(resIncome.body.message).to.equal('Movimentação registrada com sucesso.');
        expect(resIncome.body.data.transaction).to.have.property('id');
        expect(resIncome.body.data.transaction.category).to.equal('receita');

        // Despesa
        const resExpense = await request
          .post('/api/transactions')
          .set('Authorization', `Bearer ${tokenA}`)
          .send(VALID_EXPENSE);

        expect(resExpense.status).to.equal(201);
        expect(resExpense.body.success).to.be.true;
        expect(resExpense.body.data.transaction.category).to.equal('despesa');
      });
    });

    context('TC-OPT-015 - Rejeicao de criacao com valores invalidos (Particionamento de Equivalencia e Valor Limite)', function () {
      it('deve rejeitar movimentacao com valor zero (0)', async function () {
        const res = await request
          .post('/api/transactions')
          .set('Authorization', `Bearer ${tokenA}`)
          .send(INVALID_ZERO_AMOUNT);

        expect(res.status).to.equal(422);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('O valor da movimentação deve ser maior que zero (RN04).');
      });

      it('deve rejeitar movimentacao com valor negativo', async function () {
        const res = await request
          .post('/api/transactions')
          .set('Authorization', `Bearer ${tokenA}`)
          .send(INVALID_NEGATIVE_AMOUNT);

        expect(res.status).to.equal(422);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('O valor da movimentação deve ser maior que zero (RN04).');
      });
    });

    context('TC-OPT-016 - Rejeicao de criacao com campos obrigatorios ausentes ou nao permitidos', function () {
      it('deve rejeitar requisicao com corpo vazio', async function () {
        const res = await request
          .post('/api/transactions')
          .set('Authorization', `Bearer ${tokenA}`)
          .send(TRANSACTIONS_EMPTY_BODY);

        expect(res.status).to.equal(400);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Todos os campos são obrigatórios (description, value, date, category, status).');
      });

      it('deve rejeitar requisicao com categoria invalida', async function () {
        const res = await request
          .post('/api/transactions')
          .set('Authorization', `Bearer ${tokenA}`)
          .send(INVALID_CATEGORY);

        expect(res.status).to.equal(422);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('A categoria deve ser "receita" ou "despesa".');
      });

      it('deve rejeitar requisicao com status invalido', async function () {
        const res = await request
          .post('/api/transactions')
          .set('Authorization', `Bearer ${tokenA}`)
          .send(INVALID_STATUS);

        expect(res.status).to.equal(422);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('O status deve ser "pendente" ou "pago".');
      });
    });
  });

  describe('PATCH /api/transactions/:id/pay (US04)', function () {
    let pendingTransactionId;
    let paidTransactionId;

    beforeEach(async function () {
      const resPending = await request
        .post('/api/transactions')
        .set('Authorization', `Bearer ${tokenA}`)
        .send(VALID_EXPENSE);
      pendingTransactionId = resPending.body.data.transaction.id;

      const resPaid = await request
        .post('/api/transactions')
        .set('Authorization', `Bearer ${tokenA}`)
        .send(VALID_INCOME);
      paidTransactionId = resPaid.body.data.transaction.id;
    });

    context('TC-OPT-017 - Alteracao de status para pago bem-sucedida', function () {
      it('deve efetivar o pagamento de uma movimentacao pendente', async function () {
        const res = await request
          .patch(`/api/transactions/${pendingTransactionId}/pay`)
          .set('Authorization', `Bearer ${tokenA}`);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Movimentação marcada como paga com sucesso.');
        expect(res.body.data.transaction.status).to.equal('pago');
      });
    });

    context('TC-OPT-018 - Rejeicao de transicao invalida de status (RN05)', function () {
      it('deve rejeitar efetivacao de movimentacao ja paga', async function () {
        const res = await request
          .patch(`/api/transactions/${paidTransactionId}/pay`)
          .set('Authorization', `Bearer ${tokenA}`);

        expect(res.status).to.equal(422);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Esta movimentação já consta como "paga" e não pode retornar a pendente (RN05).');
      });
    });

    context('TC-OPT-019 - Protecao contra alteracao de movimentacao de terceiros ou inexistente', function () {
      it('deve impedir que Usuario B pague a movimentacao do Usuario A', async function () {
        const res = await request
          .patch(`/api/transactions/${pendingTransactionId}/pay`)
          .set('Authorization', `Bearer ${tokenB}`);

        expect(res.status).to.equal(403);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Acesso negado. Esta movimentação não pertence a você (RN02).');
      });

      it('deve retornar 404 para ID inexistente', async function () {
        const nonexistentId = '123e4567-e89b-12d3-a456-426614174000';
        const res = await request
          .patch(`/api/transactions/${nonexistentId}/pay`)
          .set('Authorization', `Bearer ${tokenA}`);

        expect(res.status).to.equal(404);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Movimentação não encontrada.');
      });
    });
  });

  describe('DELETE /api/transactions/:id (US05)', function () {
    let pendingTransactionId;
    let paidTransactionId;

    beforeEach(async function () {
      const resPending = await request
        .post('/api/transactions')
        .set('Authorization', `Bearer ${tokenA}`)
        .send(VALID_EXPENSE);
      pendingTransactionId = resPending.body.data.transaction.id;

      const resPaid = await request
        .post('/api/transactions')
        .set('Authorization', `Bearer ${tokenA}`)
        .send(VALID_INCOME);
      paidTransactionId = resPaid.body.data.transaction.id;
    });

    context('TC-OPT-020 - Exclusao de movimentacao pendente com sucesso', function () {
      it('deve deletar uma movimentacao pendente com sucesso', async function () {
        const res = await request
          .delete(`/api/transactions/${pendingTransactionId}`)
          .set('Authorization', `Bearer ${tokenA}`);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Movimentação excluída com sucesso.');

        // Verificar exclusão com a mesma ação de exclusão retornando 404
        const resRetry = await request
          .delete(`/api/transactions/${pendingTransactionId}`)
          .set('Authorization', `Bearer ${tokenA}`);

        expect(resRetry.status).to.equal(404);
      });
    });

    context('TC-OPT-021 - Rejeicao de exclusao de movimentacao efetivada (RN06)', function () {
      it('deve rejeitar a exclusao de movimentacao ja paga', async function () {
        const res = await request
          .delete(`/api/transactions/${paidTransactionId}`)
          .set('Authorization', `Bearer ${tokenA}`);

        expect(res.status).to.equal(422);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Movimentações com status "pago" são históricas e não podem ser excluídas (RN06).');
      });
    });

    context('TC-OPT-022 - Protecao contra exclusao de movimentacao de terceiros ou inexistente', function () {
      it('deve impedir que Usuario B exclua a movimentacao do Usuario A', async function () {
        const res = await request
          .delete(`/api/transactions/${pendingTransactionId}`)
          .set('Authorization', `Bearer ${tokenB}`);

        expect(res.status).to.equal(403);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Acesso negado. Esta movimentação não pertence a você (RN02).');
      });

      it('deve retornar 404 para exclusao de ID inexistente', async function () {
        const nonexistentId = '123e4567-e89b-12d3-a456-426614174000';
        const res = await request
          .delete(`/api/transactions/${nonexistentId}`)
          .set('Authorization', `Bearer ${tokenA}`);

        expect(res.status).to.equal(404);
      });
    });
  });
});
