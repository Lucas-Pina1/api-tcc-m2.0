# Estratégia de Testes

**Projeto:** FinControl Flow
**Versão:** 1.0
**Sprint:** 01 e 02
**Escopo:** Épico 01 - Gestão de Identidade e Acesso (US01, US02) e Épico 02 - Gestão de Movimentações Financeiras (US03, US04, US05)
**Autor:** QA Team
**Data:** 2026-04-29

---

## 1. Visão Geral

A estratégia de testes do FinControl Flow adota uma abordagem híbrida, combinando testes automatizados de API (majoritários) com testes manuais exploratórios pontuais. A suíte otimizada contém 22 casos de teste que cobrem 100% dos requisitos funcionais, regras de negócio e critérios de aceite globais para os Épicos 01 e 02.

A automação é realizada com a stack:
- **Mocha** — Test runner
- **Chai** — Biblioteca de assertivas (expect)
- **SuperTest** — Cliente HTTP para testes de API
- **Mochawesome** — Geração de relatórios HTML

---

## 2. Critérios de Classificação

| Critério | Automatizado | Manual |
|:---|:---|:---|
| Testes de regressão | ✅ | |
| Validações determinísticas de API | ✅ | |
| Verificação de status codes | ✅ | |
| Verificação de schema de resposta | ✅ | |
| Validação de regras de negócio via API | ✅ | |
| Fluxos end-to-end de API | ✅ | |
| Testes exploratórios | | ✅ |
| Validação visual de Swagger/Docs | | ✅ |
| Cenários de token expirado por tempo real | | ✅ |

---

## 3. Distribuição: Manual vs Automatizado

### 3.1 Testes Automatizados (21 de 22)

| ID | Título | Tipo |
|:---|:---|:---|
| TC-OPT-001 | Cadastro bem-sucedido com dados válidos | Automatizado |
| TC-OPT-002 | Rejeição de cadastro com e-mail duplicado (case-insensitive) | Automatizado |
| TC-OPT-003 | Rejeição de cadastro com campos obrigatórios ausentes | Automatizado |
| TC-OPT-004 | Rejeição de cadastro com formato de e-mail inválido | Automatizado |
| TC-OPT-005 | Rejeição de cadastro com senha no valor limite inferior | Automatizado |
| TC-OPT-006 | Login bem-sucedido com credenciais válidas | Automatizado |
| TC-OPT-007 | Rejeição de login com credenciais inválidas (anti-enumeração) | Automatizado |
| TC-OPT-008 | Rejeição de login com campos obrigatórios ausentes | Automatizado |
| TC-OPT-009 | Acesso autorizado a rota protegida com token válido | Automatizado |
| TC-OPT-010 | Rejeição de acesso sem token | Automatizado |
| TC-OPT-011 | Rejeição de acesso com token inválido ou adulterado | Automatizado |
| TC-OPT-013 | Fluxo integrado E2E: Cadastro, Login e Profile | Automatizado |
| TC-OPT-014 | Cadastro de movimentação de receita/despesa com sucesso | Automatizado |
| TC-OPT-015 | Rejeição de criação com valores inválidos (Regras Limite) | Automatizado |
| TC-OPT-016 | Rejeição de criação com campos ausentes ou não permitidos | Automatizado |
| TC-OPT-017 | Alteração de status para pago bem-sucedida | Automatizado |
| TC-OPT-018 | Rejeição de transição inválida de status (RN05) | Automatizado |
| TC-OPT-019 | Proteção contra alteração de movimentação de terceiros ou inexistente | Automatizado |
| TC-OPT-020 | Exclusão de movimentação pendente com sucesso | Automatizado |
| TC-OPT-021 | Rejeição de exclusão de movimentação efetivada (RN06) | Automatizado |
| TC-OPT-022 | Proteção contra exclusao de movimentação de terceiros ou inexistente | Automatizado |

### 3.2 Testes Manuais (1 de 22)

| ID | Título | Tipo |
|:---|:---|:---|
| TC-OPT-012 | Rejeição de acesso com token expirado | Manual |

**Observação:** O TC-OPT-012 exige um token que tenha expirado naturalmente pelo tempo configurado (1h). Embora seja possível gerar um token com expiração curta para automação, a validação mais fiel ao ambiente real requer execução manual ou mock controlado do tempo. A implementação automatizada com token fabricado é fornecida como complemento.

---

## 4. Métricas da Estratégia

| Métrica | Valor |
|:---|:---|
| Total de casos de teste | 22 |
| Automatizados | 21 (95,5%) |
| Manuais | 1 (4,5%) |
| Cobertura de Requisitos (RF01, RF02, RF03, RF04, RF07) | 100% |
| Cobertura de Regras de Negócio (RN01, RN02, RN04, RN05, RN06) | 100% |
| Cobertura de CAGs (CAG01, CAG02, CAG04, CAG05) | 100% |

---

## 5. Arquitetura de Automação

```
tests/
├── helpers/
│   ├── request.js            # Instância SuperTest com app
│   ├── auth.helper.js        # Funções de registro e login reutilizáveis
│   └── cleanup.helper.js     # Limpeza de estado entre testes
├── fixtures/
│   ├── users.fixture.js      # Dados de usuários para testes
│   ├── tokens.fixture.js     # Tokens inválidos/expirados para testes
│   └── transactions.fixture.js # Dados de movimentações financeiras
├── integration/
│   ├── register.test.js      # TC-OPT-001 a TC-OPT-005
│   ├── login.test.js          # TC-OPT-006 a TC-OPT-008
│   ├── profile.test.js        # TC-OPT-009 a TC-OPT-012
│   ├── e2e-auth-flow.test.js  # TC-OPT-013
│   └── transactions.test.js   # TC-OPT-014 a TC-OPT-022
├── .mocharc.yml               # Configuração do Mocha
└── setup.js                   # Setup global (hooks before/after)
```

---

## 6. Diretrizes para Evolução (Próxima Sprint)

### 6.1 Expansão do Escopo
- Automatizar testes do Épico 03: Filtros e Dashboards
- Validar listagem de movimentações por período e status
- Adicionar pasta `tests/integration/reports/` e testes para dashboard

### 6.2 Evolução Técnica
- Implementar CI/CD com execução automática dos testes
- Adicionar testes de contrato (schema validation com Joi ou AJV)
- Configurar threshold mínimo de cobertura (90%)
- Integrar relatório Mochawesome ao pipeline de CI

### 6.3 Padrões Obrigatórios
- Todo novo teste deve seguir o padrão de nomenclatura: `describe > context > it`
- Fixtures devem ser utilizadas para dados de entrada
- Helpers devem ser utilizados para operações reutilizáveis
- Nenhum teste deve depender da ordem de execução de outro

---

## 7. Extensão da Estratégia - Épico 03 e Épico 04

**Sprint:** 03  
**Escopo:** Épico 03 - Painel de Resultados e Visibilidade (US06) e Épico 04 - Administração da Plataforma (US07)  
**Data:** 2026-04-30

### 7.1 Classificação dos Casos de Teste do Escopo

| ID | Título | Classificação | Justificativa Técnica |
|:---|:---|:---|:---|
| TC-OPT-023 | Consulta de extrato e saldo com histórico vazio | Automatizado | Cenário determinístico de API com regra estável de retorno (`200`, array vazio e saldo `0`), alta repetibilidade e baixo custo de manutenção. |
| TC-OPT-024 | Consulta consolidada com saldo negativo, ordem cronológica e isolamento de dados | Automatizado | Valida cálculo de saldo, ordenação e isolamento por autenticação, todos comportamentos objetivos, regressivos e críticos para API. |
| TC-OPT-025 | Listagem administrativa de usuários com exposição mínima de dados | Automatizado | Verifica contrato HTTP, campos retornados e ausência de dados sensíveis, ideal para automação de regressão. |
| TC-OPT-026 | Banimento administrativo com invalidação de credenciais | Automatizado | Fluxo crítico e repetitivo que envolve múltiplas chamadas REST com resultados observáveis e estáveis. |
| TC-OPT-027 | Proteção de acesso e privacidade na administração da plataforma | Automatizado | Regras de autorização e privacidade são objetivas, de alto risco e com excelente retorno em execução automatizada contínua. |

### 7.2 Itens Mantidos em Execução Manual no Contexto de US06 e US07

Para este recorte, nenhum dos casos formais do escopo foi mantido como manual, porque todos são cenários determinísticos de API.  
Permanece recomendada execução manual complementar apenas para exploração não funcional fora da suíte formal, como inspeção da documentação Swagger, navegação exploratória de rotas inexistentes e análise investigativa de mensagens de erro sob tentativas anômalas.

### 7.3 Automação Implementada

- `tests/api/statement.test.js` cobre `TC-OPT-023` e `TC-OPT-024`
- `tests/api/admin-users.test.js` cobre `TC-OPT-025`, `TC-OPT-026` e `TC-OPT-027`
- `tests/helpers/auth.js` centraliza autenticação reutilizável para o novo recorte
- `tests/fixtures/statement-us06.json` e `tests/fixtures/admin-us07.json` desacoplam massa de teste da lógica dos cenários

### 7.4 Estrutura Adotada no Recorte

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

### 7.5 Execução

```bash
npm.cmd test
```

O arquivo `tests/.mocharc.yml` foi estendido para executar tanto a suíte legada em `tests/integration/` quanto os novos testes de `tests/api/`.

### 7.6 Próximos Passos Recomendados

- Consolidar gradualmente os testes de `US06` e `US07` legados com a nova estrutura `tests/api/` para reduzir duplicidade futura
- Adicionar validação de schema para os contratos de `GET /api/transactions` e `GET /api/admin/users`
- Incluir cenários negativos adicionais para payloads malformados e autenticação ausente nas rotas administrativas
