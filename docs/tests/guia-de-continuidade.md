# Guia de Continuidade — Automação de Testes

**Projeto:** FinControl Flow
**Stack:** Mocha + Chai + SuperTest + Mochawesome
**Versão:** 1.0
**Data:** 2026-04-27

---

## 1. Visão Geral da Arquitetura

```
tests/
├── .mocharc.yml               # Configuração do Mocha + Mochawesome
├── setup.js                   # Setup global (dotenv, chai)
├── helpers/
│   ├── request.js             # Instância SuperTest → app Express
│   ├── auth.helper.js         # register, login, getToken, getProfile
│   └── cleanup.helper.js      # clearUsers() — reset do estado
├── fixtures/
│   ├── users.fixture.js       # Payloads de usuário (VALID, INVALID, MISSING)
│   └── tokens.fixture.js      # Tokens adulterados e expirados
└── integration/
    ├── register.test.js       # TC-OPT-001 a TC-OPT-005 (12 asserts)
    ├── login.test.js           # TC-OPT-006 a TC-OPT-008 (10 asserts)
    ├── profile.test.js         # TC-OPT-009 a TC-OPT-012 (7 asserts)
    └── e2e-auth-flow.test.js   # TC-OPT-013 (1 fluxo completo)

reports/                        # Relatórios HTML/JSON gerados pelo Mochawesome
```

---

## 2. Como Executar

### Pré-requisitos
- Node.js 18+
- Arquivo `.env` configurado com `JWT_SECRET` e `JWT_EXPIRES_IN`

### Comandos

```bash
# Instalar dependências (caso necessário)
npm install

# Rodar todos os testes
npm test

# Rodar testes e gerar relatório HTML
npm run test:report
```

O relatório HTML é gerado automaticamente em `reports/fincontrol-flow-test-report.html`.

---

## 3. Padrões e Convenções

### 3.1 Nomenclatura de Testes

```javascript
describe('VERBO /rota/da/api', function () {
  context('TC-ID — Descrição do cenário', function () {
    it('deve <comportamento esperado>', async function () {
      // Arrange → Act → Assert
    });
  });
});
```

### 3.2 Fixtures

Toda massa de teste é centralizada em `tests/fixtures/`. Convenção de nomes:

| Prefixo | Uso |
|:---|:---|
| `VALID_*` | Dados válidos (cenários positivos) |
| `INVALID_*` | Dados inválidos (cenários negativos) |
| `MISSING_*` | Dados com campos ausentes |
| `*_EMPTY_BODY` | Corpo vazio `{}` |

### 3.3 Helpers

- **`request.js`** — Instância SuperTest. Nunca importe `supertest` diretamente nos testes.
- **`auth.helper.js`** — Encapsula operações de registro, login e obtenção de token.
- **`cleanup.helper.js`** — Reset do estado in-memory entre testes.

### 3.4 Isolamento

Cada suite usa `beforeEach` com `clearUsers()` para garantir que os testes são **independentes** e não dependem da ordem de execução.

---

## 4. Como Adicionar Novos Testes

### 4.1 Novo cenário em uma suite existente

1. Adicionar os dados necessários em `fixtures/`
2. Criar um novo bloco `context > it` no arquivo `.test.js` correspondente
3. Seguir o padrão `Arrange → Act → Assert`

### 4.2 Nova suite para um novo endpoint

1. Criar um novo arquivo em `tests/integration/` (ex: `transactions.test.js`)
2. Importar `request`, `clearUsers` e fixtures necessários
3. Configurar `beforeEach` com limpeza de estado
4. Se o endpoint requer autenticação, usar `registerAndGetToken` do `auth.helper`

### Exemplo:

```javascript
const request = require('../helpers/request');
const { registerAndGetToken } = require('../helpers/auth.helper');
const { clearUsers } = require('../helpers/cleanup.helper');

describe('POST /api/transactions', function () {
  let token;

  beforeEach(async function () {
    clearUsers();
    token = await registerAndGetToken({
      name: 'Teste',
      email: 'teste@email.com',
      password: 'senha123',
    });
  });

  it('deve criar uma transação com sucesso', async function () {
    const res = await request
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'income', amount: 100, description: 'Salário' });

    expect(res.status).to.equal(201);
  });
});
```

---

## 5. Rastreabilidade: Código ↔ Caso de Teste

| Arquivo de Teste | Casos de Teste | Requisitos |
|:---|:---|:---|
| `register.test.js` | TC-OPT-001 a TC-OPT-005 | RF01, RN01, CAG01, CAG02, CAG05 |
| `login.test.js` | TC-OPT-006 a TC-OPT-008 | RF02, CAG01, CAG02, CAG05 |
| `profile.test.js` | TC-OPT-009 a TC-OPT-012 | RF02, CAG02 |
| `e2e-auth-flow.test.js` | TC-OPT-013 | RF01, RF02, CAG01, CAG02 |

---

## 6. Próximos Passos (Sprint 02)

- [ ] Criar testes para endpoints de transações (Épico 02)
- [ ] Adicionar validação de schema com AJV/Joi nos testes
- [ ] Configurar CI/CD para execução automática em push/PR
- [ ] Implementar `clearTransactions()` no cleanup helper
- [ ] Adicionar threshold mínimo de cobertura (90%)
- [ ] Integrar relatório Mochawesome ao pipeline de CI
