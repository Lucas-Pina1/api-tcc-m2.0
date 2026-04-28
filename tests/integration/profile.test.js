/**
 * Profile Test Suite — TC-OPT-009 a TC-OPT-012
 *
 * Testes de integração para o endpoint GET /api/auth/profile
 * Cobertura: RF02, CAG02, proteção de rotas via JWT
 */

const request = require('../helpers/request');
const { registerAndGetToken } = require('../helpers/auth.helper');
const { clearUsers } = require('../helpers/cleanup.helper');
const { VALID_USER } = require('../fixtures/users.fixture');
const { TAMPERED_TOKEN, generateExpiredToken } = require('../fixtures/tokens.fixture');

describe('GET /api/auth/profile', function () {

  let validToken;

  // ─── Isolamento e pré-condição: usuário autenticado ────────────
  beforeEach(async function () {
    clearUsers();
    validToken = await registerAndGetToken(VALID_USER);
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-009 — Acesso autorizado com token JWT válido
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-009 — Acesso autorizado a rota protegida com token válido', function () {

    it('deve retornar status 200 com dados do usuário', async function () {
      const res = await request
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    });

    it('deve retornar o objeto data.user com campos corretos', async function () {
      const res = await request
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${validToken}`);

      const user = res.body.data.user;
      expect(user).to.have.property('id');
      expect(user).to.have.property('name', VALID_USER.name);
      expect(user).to.have.property('email', VALID_USER.email);
      expect(user).to.have.property('role', 'user');
      expect(user).to.have.property('createdAt');
    });

    it('NÃO deve retornar o campo password em data.user (CAG02)', async function () {
      const res = await request
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.body.data.user).to.not.have.property('password');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-010 — Rejeição de acesso sem token
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-010 — Rejeição de acesso a rota protegida sem token', function () {

    it('deve retornar 401 quando o header Authorization está ausente', async function () {
      const res = await request
        .get('/api/auth/profile');

      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('Token de autenticação não fornecido.');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-011 — Rejeição com token inválido ou adulterado
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-011 — Rejeição de acesso com token inválido ou adulterado', function () {

    it('deve retornar 401 para token sem prefixo Bearer', async function () {
      const res = await request
        .get('/api/auth/profile')
        .set('Authorization', 'token_sem_bearer');

      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.include('Formato de token inválido');
    });

    it('deve retornar 401 para token com assinatura adulterada', async function () {
      const res = await request
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${TAMPERED_TOKEN}`);

      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('Token inválido.');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-012 — Rejeição com token expirado (automação complementar)
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-012 — Rejeição de acesso com token expirado', function () {

    it('deve retornar 401 para token expirado', async function () {
      // Gera um token que já nasce expirado (expiresIn: 0s)
      const expiredToken = generateExpiredToken();

      // Aguarda breve intervalo para garantir expiração
      await new Promise((resolve) => setTimeout(resolve, 100));

      const res = await request
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('Token expirado. Realize o login novamente.');
    });
  });
});
