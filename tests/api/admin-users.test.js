const request = require('../helpers/request');
const { createAuthenticatedUser, loginAsAdmin, loginUser } = require('../helpers/auth');
const { clearUsers, clearTransactions } = require('../helpers/cleanup.helper');
const adminFixture = require('../fixtures/admin-us07.json');

describe('GET /api/admin/users and DELETE /api/admin/users/:id', function () {
  beforeEach(function () {
    clearUsers();
    clearTransactions();
  });

  context('TC-OPT-025 - Listagem administrativa de usuarios com exposicao minima de dados', function () {
    it('deve listar usuarios com os campos administrativos esperados e sem dados sensiveis ou financeiros', async function () {
      const { token: adminToken } = await loginAsAdmin(adminFixture.adminCredentials);
      await createAuthenticatedUser(adminFixture.commonUser);
      await createAuthenticatedUser(adminFixture.targetUser);

      const response = await request
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.equal(true);
      expect(response.body.message).to.equal('Lista de usuários obtida com sucesso.');
      expect(response.body.data.users).to.have.length(3);

      response.body.data.users.forEach((user) => {
        expect(user).to.include.all.keys('id', 'name', 'email', 'role');
        expect(user).to.not.have.property('password');
        expect(user).to.not.have.property('token');
        expect(user).to.not.have.property('balance');
        expect(user).to.not.have.property('transactions');
      });
    });
  });

  context('TC-OPT-026 - Banimento administrativo com invalidacao de credenciais', function () {
    it('deve remover a conta, impedir novo login e excluir o usuario da listagem administrativa', async function () {
      const { token: adminToken } = await loginAsAdmin(adminFixture.adminCredentials);
      const { token: targetToken, user: targetUser } = await createAuthenticatedUser(adminFixture.targetUser);

      await request
        .post('/api/transactions')
        .set('Authorization', `Bearer ${targetToken}`)
        .send(adminFixture.targetTransaction);

      const deleteResponse = await request
        .delete(`/api/admin/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(deleteResponse.status).to.equal(200);
      expect(deleteResponse.body.success).to.equal(true);
      expect(deleteResponse.body.data.user.id).to.equal(targetUser.id);

      const loginResponse = await loginUser({
        email: adminFixture.targetUser.email,
        password: adminFixture.targetUser.password,
      });

      expect(loginResponse.status).to.equal(401);
      expect(loginResponse.body.message).to.equal('E-mail ou senha incorretos.');

      const listResponse = await request
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(listResponse.status).to.equal(200);
      expect(listResponse.body.data.users.some((user) => user.id === targetUser.id)).to.equal(false);
    });
  });

  context('TC-OPT-027 - Protecao de acesso e privacidade na administracao da plataforma', function () {
    it('deve impedir que usuario comum acesse a listagem administrativa', async function () {
      const { token: commonToken } = await createAuthenticatedUser(adminFixture.commonUser);

      const response = await request
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${commonToken}`);

      expect(response.status).to.equal(403);
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to.equal('Acesso negado. Esta rota é exclusiva para administradores.');
    });

    it('deve impedir que usuario comum exclua outra conta', async function () {
      const { token: commonToken } = await createAuthenticatedUser(adminFixture.commonUser);
      const { user: targetUser } = await createAuthenticatedUser(adminFixture.targetUser);

      const response = await request
        .delete(`/api/admin/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${commonToken}`);

      expect(response.status).to.equal(403);
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to.equal('Acesso negado. Esta rota é exclusiva para administradores.');
    });

    it('deve retornar 404 quando o administrador tenta excluir uma conta inexistente', async function () {
      const { token: adminToken } = await loginAsAdmin(adminFixture.adminCredentials);

      const response = await request
        .delete('/api/admin/users/123e4567-e89b-12d3-a456-426614174000')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).to.equal(404);
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to.equal('Usuário não encontrado.');
    });

    it('deve impedir acesso do administrador aos dados financeiros de usuarios', async function () {
      const { token: adminToken } = await loginAsAdmin(adminFixture.adminCredentials);

      const response = await request
        .get('/api/transactions')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).to.equal(403);
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to.equal('Acesso negado. Administradores não podem acessar dados financeiros (RN03).');
      expect(response.body).to.not.have.property('data');
    });
  });
});
