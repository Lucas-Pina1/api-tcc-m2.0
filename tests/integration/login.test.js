/**
 * Login Test Suite — TC-OPT-006 a TC-OPT-008
 *
 * Testes de integração para o endpoint POST /api/auth/login
 * Cobertura: RF02, US02-CA01, US02-CA02, CAG01, CAG02, CAG05
 */

const request = require('../helpers/request');
const { registerUser } = require('../helpers/auth.helper');
const { clearUsers } = require('../helpers/cleanup.helper');
const {
  VALID_USER_LOGIN,
  INVALID_CREDENTIALS_WRONG_EMAIL,
  INVALID_CREDENTIALS_WRONG_PASSWORD,
  LOGIN_MISSING_EMAIL,
  LOGIN_MISSING_PASSWORD,
  LOGIN_EMPTY_BODY,
} = require('../fixtures/users.fixture');

describe('POST /api/auth/login', function () {

  // ─── Isolamento e pré-condição: usuário cadastrado ─────────────
  beforeEach(async function () {
    clearUsers();
    // Pré-condição: registrar um usuário para testes de login
    await registerUser(VALID_USER_LOGIN);
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-006 — Login bem-sucedido com credenciais válidas
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-006 — Login bem-sucedido com credenciais válidas', function () {

    it('deve retornar status 200 com mensagem de sucesso', async function () {
      const res = await request
        .post('/api/auth/login')
        .send({
          email: VALID_USER_LOGIN.email,
          password: VALID_USER_LOGIN.password,
        });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.equal('Login realizado com sucesso.');
    });

    it('deve retornar um token JWT no formato correto', async function () {
      const res = await request
        .post('/api/auth/login')
        .send({
          email: VALID_USER_LOGIN.email,
          password: VALID_USER_LOGIN.password,
        });

      const token = res.body.data.token;
      expect(token).to.be.a('string');
      // JWT format: xxxxx.xxxxx.xxxxx
      expect(token.split('.')).to.have.lengthOf(3);
    });

    it('deve retornar o objeto data.user sem o campo password (CAG02)', async function () {
      const res = await request
        .post('/api/auth/login')
        .send({
          email: VALID_USER_LOGIN.email,
          password: VALID_USER_LOGIN.password,
        });

      const user = res.body.data.user;
      expect(user).to.have.property('id');
      expect(user).to.have.property('name', VALID_USER_LOGIN.name);
      expect(user).to.have.property('email', VALID_USER_LOGIN.email);
      expect(user).to.have.property('role');
      expect(user).to.have.property('createdAt');
      expect(user).to.not.have.property('password');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-007 — Rejeição com credenciais inválidas (anti-enumeração)
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-007 — Rejeição de login com credenciais inválidas (anti-enumeração)', function () {

    it('deve retornar 401 com e-mail inexistente', async function () {
      const res = await request
        .post('/api/auth/login')
        .send(INVALID_CREDENTIALS_WRONG_EMAIL);

      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('E-mail ou senha incorretos.');
    });

    it('deve retornar 401 com senha incorreta', async function () {
      const res = await request
        .post('/api/auth/login')
        .send(INVALID_CREDENTIALS_WRONG_PASSWORD);

      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('E-mail ou senha incorretos.');
    });

    it('deve retornar a mesma mensagem para e-mail e senha incorretos (anti-enumeração)', async function () {
      const resWrongEmail = await request
        .post('/api/auth/login')
        .send(INVALID_CREDENTIALS_WRONG_EMAIL);

      const resWrongPassword = await request
        .post('/api/auth/login')
        .send(INVALID_CREDENTIALS_WRONG_PASSWORD);

      expect(resWrongEmail.body.message).to.equal(resWrongPassword.body.message);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-008 — Rejeição com campos obrigatórios ausentes
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-008 — Rejeição de login com campos obrigatórios ausentes', function () {

    it('deve retornar 400 com corpo vazio', async function () {
      const res = await request
        .post('/api/auth/login')
        .send(LOGIN_EMPTY_BODY);

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('E-mail e senha são obrigatórios.');
      expect(res.body.details.missingFields).to.include.members(['email', 'password']);
    });

    it('deve retornar 400 quando falta o campo email', async function () {
      const res = await request
        .post('/api/auth/login')
        .send(LOGIN_MISSING_EMAIL);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('E-mail e senha são obrigatórios.');
    });

    it('deve retornar 400 quando falta o campo password', async function () {
      const res = await request
        .post('/api/auth/login')
        .send(LOGIN_MISSING_PASSWORD);

      expect(res.status).to.equal(400);
      expect(res.body.details.missingFields).to.include('password');
    });
  });
});
