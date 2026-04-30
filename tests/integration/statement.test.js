const { expect } = require('chai');
const request = require('../helpers/request');
const { registerAndGetToken, loginUser } = require('../helpers/auth.helper');
const { clearUsers, clearTransactions } = require('../helpers/cleanup.helper');
const {
  VALID_INCOME,
  VALID_EXPENSE,
} = require('../fixtures/transactions.fixture');
const { DEFAULT_ADMIN_CREDENTIALS } = require('../fixtures/users.fixture');

describe('Extrato e saldo (US06)', function () {
  let tokenA;
  let tokenB;
  let adminToken;

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

    const adminLogin = await loginUser(DEFAULT_ADMIN_CREDENTIALS);
    adminToken = adminLogin.body.data.token;
  });

  it('deve retornar movimentacoes em ordem cronologica com saldo consolidado do usuario autenticado', async function () {
    await request
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        ...VALID_EXPENSE,
        description: 'Internet',
        value: 300,
        date: '2026-05-10',
      });

    await request
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        ...VALID_INCOME,
        description: 'Freelance',
        value: 2000,
        date: '2026-05-01',
      });

    await request
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        ...VALID_EXPENSE,
        description: 'Mercado',
        value: 450,
        date: '2026-05-05',
      });

    const res = await request
      .get('/api/transactions')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.message).to.equal('Extrato financeiro obtido com sucesso.');
    expect(res.body.data.balance).to.equal(1250);
    expect(res.body.data.transactions).to.have.length(3);
    expect(res.body.data.transactions.map((transaction) => transaction.description)).to.deep.equal([
      'Freelance',
      'Mercado',
      'Internet',
    ]);
  });

  it('deve retornar apenas as movimentacoes do proprio usuario', async function () {
    await request
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(VALID_INCOME);

    await request
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        ...VALID_EXPENSE,
        description: 'Conta do User B',
      });

    const res = await request
      .get('/api/transactions')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.transactions).to.have.length(1);
    expect(res.body.data.transactions[0].description).to.equal('Salário');
  });

  it('deve impedir acesso financeiro pelo perfil administrador', async function () {
    const res = await request
      .get('/api/transactions')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(403);
    expect(res.body.success).to.equal(false);
    expect(res.body.message).to.equal('Acesso negado. Administradores não podem acessar dados financeiros (RN03).');
  });
});
