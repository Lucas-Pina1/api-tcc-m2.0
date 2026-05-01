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
│   ├── tokens.fixture.js      # Tokens adulterados e expirados
│   └── transactions.fixture.js# Payloads de movimentações financeiras
└── integration/
    ├── register.test.js       # TC-OPT-001 a TC-OPT-005 (12 asserts)
    ├── login.test.js           # TC-OPT-006 a TC-OPT-008 (10 asserts)
    ├── profile.test.js         # TC-OPT-009 a TC-OPT-012 (7 asserts)
    ├── e2e-auth-flow.test.js   # TC-OPT-013 (1 fluxo completo)
    └── transactions.test.js    # Testes do Épico 02 (US03, US04, US05)

reports/                        # Relatórios HTML/JSON gerados pelo Mochawesome
```

---

## 2. Como Executar

### Pré-requisitos
- Node.js 18+
- Arquivo `.env` configurado com `JWT_SECRET` e `JWT_EXPIRES_IN`

### Comando oficial

```bash
# Instalar dependências (caso necessário)
npm install

# Rodar toda a suíte e gerar o relatório Mochawesome
npm.cmd test
```

O relatório HTML é gerado automaticamente em `reports/fincontrol-flow-test-report.html`.
O script `test:report` foi mantido apenas como alias de compatibilidade e executa exatamente a mesma suíte.

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
- **`cleanup.helper.js`** — Reset do estado in-memory entre testes (`clearUsers`, `clearTransactions`).

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
| `transactions.test.js` | Casos de Teste do Épico 02 | US03, US04, US05 (RN04) |

---

## 6. Histórico de Entregas e Próximos Passos

### Concluído (Sprint Atual - Épico 01 e 02)
- [x] Criação de estrutura base de automação (Mocha + Chai + SuperTest)
- [x] Helpers para autenticação, request e cleanup (`clearUsers`, `clearTransactions`)
- [x] Fixtures separadas para cenários de usuários, tokens e transações
- [x] Cobertura E2E de Auth (US01, US02)
- [x] Testes para endpoints de transações (Épico 02 - US03, US04, US05)
- [x] Correção de bug de validação para valor `0` em transações no serviço (`transactionService.js`)

---

## 7. Continuidade da Sprint - Épico 03 e Épico 04

### 7.1 O que foi automatizado

- `TC-OPT-023` e `TC-OPT-024` em `tests/api/statement.test.js`
- `TC-OPT-025`, `TC-OPT-026` e `TC-OPT-027` em `tests/api/admin-users.test.js`
- Helper novo `tests/helpers/auth.js` para criação de usuário autenticado e login administrativo
- Fixtures JSON novas em `tests/fixtures/statement-us06.json` e `tests/fixtures/admin-us07.json`

### 7.2 O que permaneceu manual

- Não houve caso formal de `US06` ou `US07` mantido manualmente
- A recomendação manual complementar permanece apenas para exploração ad hoc de Swagger, mensagens de erro e navegação fora dos fluxos documentados

### 7.3 Estrutura criada

```text
tests/
├── api/
│   ├── statement.test.js
│   └── admin-users.test.js
├── helpers/
│   ├── request.js
│   ├── auth.js
│   └── cleanup.helper.js
└── fixtures/
    ├── statement-us06.json
    └── admin-us07.json
```

### 7.4 Ajuste funcional realizado para suportar a automação

- `src/services/adminService.js` passou a retornar `role` na listagem administrativa, alinhando a API ao critério de aceite `US07-CA01`

### 7.5 Como executar

```bash
npm.cmd test
```

Esse comando único executa:
- `tests/integration/**/*.test.js`
- `tests/api/**/*.test.js`

Todos os resultados são consolidados no mesmo relatório Mochawesome.

### 7.6 Observações importantes

- A suíte total passou com `58 passing`
- O `tests/.mocharc.yml` agora inclui `tests/api/**/*.test.js` além da suíte legada em `tests/integration/**/*.test.js`
- Os logs `[ERROR]` no terminal durante a execução correspondem aos cenários negativos validados pela própria suíte e não indicam falha do teste

### 7.7 Próximos passos sugeridos

- Avaliar migração progressiva dos testes legados de `statement.test.js` e `admin-users.test.js` para eliminar sobreposição de cobertura
- Adicionar validações contratuais de resposta para reduzir risco de regressão estrutural
- Expandir o helper de autenticação para suportar futuras suítes de administração e cenários multiusuário
