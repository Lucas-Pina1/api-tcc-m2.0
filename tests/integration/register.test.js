/**
 * Register Test Suite — TC-OPT-001 a TC-OPT-005
 *
 * Testes de integração para o endpoint POST /api/auth/register
 * Cobertura: RF01, RN01, US01-CA01, US01-CA02, CAG01, CAG02, CAG05
 */

const request = require('../helpers/request');
const { clearUsers } = require('../helpers/cleanup.helper');
const {
  VALID_USER,
  VALID_USER_DUPLICATE_BASE,
  DUPLICATE_USER_SAME_EMAIL,
  DUPLICATE_USER_UPPERCASE,
  MISSING_NAME,
  MISSING_EMAIL,
  MISSING_PASSWORD,
  EMPTY_BODY,
  INVALID_EMAIL_FORMAT,
  PASSWORD_BELOW_LIMIT,
  PASSWORD_AT_LIMIT,
} = require('../fixtures/users.fixture');

describe('POST /api/auth/register', function () {

  // ─── Isolamento: limpa o estado antes de cada teste ────────────
  beforeEach(function () {
    clearUsers();
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-001 — Cadastro bem-sucedido com dados válidos
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-001 — Cadastro bem-sucedido com dados válidos', function () {

    it('deve retornar status 201 com os dados do usuário', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(VALID_USER);

      expect(res.status).to.equal(201);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.equal('Usuário cadastrado com sucesso.');
    });

    it('deve retornar o objeto data.user com campos corretos', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(VALID_USER);

      const user = res.body.data.user;
      expect(user).to.have.property('id');
      expect(user).to.have.property('name', VALID_USER.name);
      expect(user).to.have.property('email', VALID_USER.email);
      expect(user).to.have.property('role', 'user');
      expect(user).to.have.property('createdAt');
    });

    it('deve retornar um UUID v4 válido no campo id', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(VALID_USER);

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(res.body.data.user.id).to.match(uuidRegex);
    });

    it('NÃO deve retornar o campo password em data.user (CAG02)', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(VALID_USER);

      expect(res.body.data.user).to.not.have.property('password');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-002 — Rejeição de cadastro com e-mail duplicado
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-002 — Rejeição de cadastro com e-mail duplicado (case-insensitive)', function () {

    beforeEach(async function () {
      // Pré-condição: cadastrar o usuário base
      await request.post('/api/auth/register').send(VALID_USER_DUPLICATE_BASE);
    });

    it('deve retornar 409 ao tentar cadastrar com o mesmo e-mail', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(DUPLICATE_USER_SAME_EMAIL);

      expect(res.status).to.equal(409);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('Este e-mail já está cadastrado na plataforma.');
    });

    it('deve retornar 409 ao tentar cadastrar com e-mail em UPPERCASE (RN01)', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(DUPLICATE_USER_UPPERCASE);

      expect(res.status).to.equal(409);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.include('cadastrado');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-003 — Rejeição com campos obrigatórios ausentes
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-003 — Rejeição de cadastro com campos obrigatórios ausentes', function () {

    it('deve retornar 400 com corpo vazio listando todos os campos ausentes', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(EMPTY_BODY);

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('Campos obrigatórios não preenchidos.');
      expect(res.body.details.missingFields).to.include.members(['name', 'email', 'password']);
    });

    it('deve retornar 400 quando falta o campo name', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(MISSING_NAME);

      expect(res.status).to.equal(400);
      expect(res.body.details.missingFields).to.include('name');
    });

    it('deve retornar 400 quando falta o campo email', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(MISSING_EMAIL);

      expect(res.status).to.equal(400);
      expect(res.body.details.missingFields).to.include('email');
    });

    it('deve retornar 400 quando falta o campo password', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(MISSING_PASSWORD);

      expect(res.status).to.equal(400);
      expect(res.body.details.missingFields).to.include('password');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-004 — Rejeição com formato de e-mail inválido
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-004 — Rejeição de cadastro com formato de e-mail inválido', function () {

    it('deve retornar 400 com mensagem de formato inválido', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(INVALID_EMAIL_FORMAT);

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('Formato de e-mail inválido.');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // TC-OPT-005 — Rejeição com senha abaixo do limite inferior
  // ═══════════════════════════════════════════════════════════════
  context('TC-OPT-005 — Rejeição de cadastro com senha no valor limite inferior', function () {

    it('deve retornar 400 para senha com 5 caracteres (abaixo do limite)', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(PASSWORD_BELOW_LIMIT);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('A senha deve conter no mínimo 6 caracteres.');
    });

    it('deve retornar 201 para senha com exatamente 6 caracteres (valor limite aceito)', async function () {
      const res = await request
        .post('/api/auth/register')
        .send(PASSWORD_AT_LIMIT);

      expect(res.status).to.equal(201);
      expect(res.body.success).to.equal(true);
    });
  });
});
