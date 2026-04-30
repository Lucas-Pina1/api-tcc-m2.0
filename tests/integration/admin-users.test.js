const { expect } = require('chai');
const request = require('../helpers/request');
const { loginUser, registerAndGetToken } = require('../helpers/auth.helper');
const { clearUsers, clearTransactions } = require('../helpers/cleanup.helper');
const { VALID_EXPENSE } = require('../fixtures/transactions.fixture');
const { DEFAULT_ADMIN_CREDENTIALS } = require('../fixtures/users.fixture');

describe('Administracao de usuarios (US07)', function () {
  let adminToken;
  let userToken;
  let targetUserToken;
  let targetUserId;

  beforeEach(async function () {
    clearUsers();
    clearTransactions();

    const adminLogin = await loginUser(DEFAULT_ADMIN_CREDENTIALS);
    adminToken = adminLogin.body.data.token;

    userToken = await registerAndGetToken({
      name: 'Usuario Comum',
      email: 'comum@email.com',
      password: 'senha123',
    });

    targetUserToken = await registerAndGetToken({
      name: 'Usuario Alvo',
      email: 'alvo@email.com',
      password: 'senha123',
    });

    const profileRes = await request
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${targetUserToken}`);

    targetUserId = profileRes.body.data.user.id;
  });

  it('deve permitir que o administrador liste usuarios sem dados financeiros', async function () {
    const res = await request
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data.users).to.be.an('array');
    expect(res.body.data.users.length).to.equal(3);
    res.body.data.users.forEach((user) => {
      expect(user).to.have.property('id');
      expect(user).to.have.property('name');
      expect(user).to.have.property('email');
      expect(user).to.not.have.property('password');
      expect(user).to.not.have.property('transactions');
      expect(user).to.not.have.property('balance');
    });
  });

  it('deve impedir que usuario comum acesse rotas administrativas', async function () {
    const res = await request
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).to.equal(403);
    expect(res.body.success).to.equal(false);
    expect(res.body.message).to.equal('Acesso negado. Esta rota é exclusiva para administradores.');
  });

  it('deve permitir que o administrador remova a conta e invalide o token do usuario removido', async function () {
    await request
      .post('/api/transactions')
      .set('Authorization', `Bearer ${targetUserToken}`)
      .send(VALID_EXPENSE);

    const deleteRes = await request
      .delete(`/api/admin/users/${targetUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteRes.status).to.equal(200);
    expect(deleteRes.body.success).to.equal(true);
    expect(deleteRes.body.data.user.id).to.equal(targetUserId);

    const profileRes = await request
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${targetUserToken}`);

    expect(profileRes.status).to.equal(401);
    expect(profileRes.body.message).to.equal('Usuário autenticado não encontrado ou removido.');
  });
});
