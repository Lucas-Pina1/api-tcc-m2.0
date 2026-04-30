const request = require('../helpers/request');
const { createAuthenticatedUser } = require('../helpers/auth');
const { clearUsers, clearTransactions } = require('../helpers/cleanup.helper');
const statementFixture = require('../fixtures/statement-us06.json');

describe('GET /api/transactions', function () {
  beforeEach(function () {
    clearUsers();
    clearTransactions();
  });

  context('TC-OPT-023 - Consulta de extrato e saldo com historico vazio', function () {
    it('deve retornar array vazio, saldo zero e estrutura padronizada para usuario sem movimentacoes', async function () {
      const { token } = await createAuthenticatedUser(statementFixture.primaryUser);

      const response = await request
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.equal(true);
      expect(response.body.message).to.equal('Extrato financeiro obtido com sucesso.');
      expect(response.body.data).to.deep.equal({
        transactions: [],
        balance: 0,
      });
    });
  });

  context('TC-OPT-024 - Consulta consolidada com saldo negativo, ordem cronologica e isolamento de dados', function () {
    it('deve retornar apenas dados do usuario autenticado em ordem cronologica com saldo calculado corretamente', async function () {
      const { token: primaryToken } = await createAuthenticatedUser(statementFixture.primaryUser);
      const { token: secondaryToken } = await createAuthenticatedUser(statementFixture.secondaryUser);

      const primaryTransactions = [
        statementFixture.transactions.income,
        statementFixture.transactions.firstExpense,
        statementFixture.transactions.secondExpense,
      ];

      for (const transaction of primaryTransactions) {
        // Cada POST serve como pre-condicao deterministica para a consulta consolidada.
        await request
          .post('/api/transactions')
          .set('Authorization', `Bearer ${primaryToken}`)
          .send(transaction);
      }

      await request
        .post('/api/transactions')
        .set('Authorization', `Bearer ${secondaryToken}`)
        .send(statementFixture.transactions.foreignTransaction);

      const response = await request
        .get('/api/transactions')
        .set('Authorization', `Bearer ${primaryToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.equal(true);
      expect(response.body.data.transactions).to.have.length(3);
      expect(response.body.data.transactions.map((transaction) => transaction.description)).to.deep.equal([
        'Transporte',
        'Freelance',
        'Mercado',
      ]);
      expect(response.body.data.transactions.every((transaction) => transaction.description !== 'Lancamento de outro usuario')).to.equal(true);
      expect(response.body.data.balance).to.equal(-250);
    });
  });
});
