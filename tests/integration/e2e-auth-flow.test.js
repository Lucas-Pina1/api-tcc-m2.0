/**
 * E2E Auth Flow Test Suite — TC-OPT-013
 *
 * Teste de integração end-to-end: Cadastro → Login → Profile
 * Valida o fluxo completo de identidade e acesso em uma sequência.
 *
 * Cobertura: RF01, RF02, US01-CA01, US02-CA01, CAG01, CAG02
 */

const request = require('../helpers/request');
const { clearUsers } = require('../helpers/cleanup.helper');
const { VALID_USER_E2E } = require('../fixtures/users.fixture');

describe('Fluxo E2E — Cadastro, Login e Profile', function () {

  // ─── Isolamento ────────────────────────────────────────────────
  beforeEach(function () {
    clearUsers();
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-013 — Fluxo integrado: Cadastro, Login e Profile
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-013 — Fluxo integrado End-to-End', function () {

    it('deve completar o fluxo: Registro → Login → Profile com sucesso', async function () {

      // ── Etapa 1: Cadastro ────────────────────────────────────
      const registerRes = await request
        .post('/api/auth/register')
        .send(VALID_USER_E2E);

      expect(registerRes.status).to.equal(201);
      expect(registerRes.body.success).to.equal(true);
      expect(registerRes.body.data.user).to.have.property('id');

      // ── Etapa 2: Login ───────────────────────────────────────
      const loginRes = await request
        .post('/api/auth/login')
        .send({
          email: VALID_USER_E2E.email,
          password: VALID_USER_E2E.password,
        });

      expect(loginRes.status).to.equal(200);
      expect(loginRes.body.success).to.equal(true);
      expect(loginRes.body.data.token).to.be.a('string');

      const token = loginRes.body.data.token;

      // Valida formato JWT (3 segmentos separados por ponto)
      expect(token.split('.')).to.have.lengthOf(3);

      // ── Etapa 3: Acesso ao Profile ───────────────────────────
      const profileRes = await request
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(profileRes.status).to.equal(200);
      expect(profileRes.body.success).to.equal(true);

      const user = profileRes.body.data.user;
      expect(user).to.have.property('email', VALID_USER_E2E.email);
      expect(user).to.have.property('name', VALID_USER_E2E.name);
      expect(user).to.have.property('role', 'user');
      expect(user).to.not.have.property('password');
    });
  });
});
