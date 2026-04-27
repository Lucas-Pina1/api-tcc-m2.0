# Estrategia de Testes

**Projeto:** FinControl Flow
**Versao:** 1.0
**Sprint:** 01
**Escopo:** Epico 01 - Gestao de Identidade e Acesso (US01, US02)
**Autor:** QA Team
**Data:** 2026-04-27

---

## 1. Visao Geral

A estrategia de testes do FinControl Flow adota uma abordagem hibrida, combinando testes automatizados de API (majoritarios) com testes manuais exploratórios pontuais. A suite otimizada contem 13 casos de teste que cobrem 100% dos requisitos funcionais, regras de negocio e criterios de aceite globais para o Epico 01.

A automacao e realizada com a stack:
- **Mocha** — Test runner
- **Chai** — Biblioteca de assertivas (expect)
- **SuperTest** — Cliente HTTP para testes de API
- **Mochawesome** — Geracao de relatorios HTML

---

## 2. Criterios de Classificacao

| Criterio | Automatizado | Manual |
|:---|:---|:---|
| Testes de regressao | ✅ | |
| Validacoes deterministicas de API | ✅ | |
| Verificacao de status codes | ✅ | |
| Verificacao de schema de resposta | ✅ | |
| Validacao de regras de negocio via API | ✅ | |
| Fluxos end-to-end de API | ✅ | |
| Testes exploratorios | | ✅ |
| Validacao visual de Swagger/Docs | | ✅ |
| Cenarios de token expirado por tempo real | | ✅ |

---

## 3. Distribuicao: Manual vs Automatizado

### 3.1 Testes Automatizados (12 de 13)

| ID | Titulo | Tipo |
|:---|:---|:---|
| TC-OPT-001 | Cadastro bem-sucedido com dados validos | Automatizado |
| TC-OPT-002 | Rejeicao de cadastro com e-mail duplicado (case-insensitive) | Automatizado |
| TC-OPT-003 | Rejeicao de cadastro com campos obrigatorios ausentes | Automatizado |
| TC-OPT-004 | Rejeicao de cadastro com formato de e-mail invalido | Automatizado |
| TC-OPT-005 | Rejeicao de cadastro com senha no valor limite inferior | Automatizado |
| TC-OPT-006 | Login bem-sucedido com credenciais validas | Automatizado |
| TC-OPT-007 | Rejeicao de login com credenciais invalidas (anti-enumeracao) | Automatizado |
| TC-OPT-008 | Rejeicao de login com campos obrigatorios ausentes | Automatizado |
| TC-OPT-009 | Acesso autorizado a rota protegida com token valido | Automatizado |
| TC-OPT-010 | Rejeicao de acesso sem token | Automatizado |
| TC-OPT-011 | Rejeicao de acesso com token invalido ou adulterado | Automatizado |
| TC-OPT-013 | Fluxo integrado E2E: Cadastro, Login e Profile | Automatizado |

### 3.2 Testes Manuais (1 de 13)

| ID | Titulo | Tipo |
|:---|:---|:---|
| TC-OPT-012 | Rejeicao de acesso com token expirado | Manual |

**Observacao:** O TC-OPT-012 exige um token que tenha expirado naturalmente pelo tempo configurado (1h). Embora seja possivel gerar um token com expiracao curta para automacao, a validacao mais fiel ao ambiente real requer execucao manual ou mock controlado do tempo. A implementacao automatizada com token fabricado e fornecida como complemento.

---

## 4. Metricas da Estrategia

| Metrica | Valor |
|:---|:---|
| Total de casos de teste | 13 |
| Automatizados | 12 (92,3%) |
| Manuais | 1 (7,7%) |
| Cobertura de Requisitos (RF01, RF02) | 100% |
| Cobertura de Regras de Negocio (RN01) | 100% |
| Cobertura de CAGs (CAG01, CAG02, CAG05) | 100% |

---

## 5. Arquitetura de Automacao

```
tests/
├── helpers/
│   ├── request.js            # Instancia SuperTest com app
│   ├── auth.helper.js        # Funcoes de registro e login reutilizaveis
│   └── cleanup.helper.js     # Limpeza de estado entre testes
├── fixtures/
│   ├── users.fixture.js      # Dados de usuarios para testes
│   └── tokens.fixture.js     # Tokens invalidos/expirados para testes
├── integration/
│   ├── register.test.js      # TC-OPT-001 a TC-OPT-005
│   ├── login.test.js          # TC-OPT-006 a TC-OPT-008
│   ├── profile.test.js        # TC-OPT-009 a TC-OPT-012
│   └── e2e-auth-flow.test.js  # TC-OPT-013
├── .mocharc.yml               # Configuracao do Mocha
└── setup.js                   # Setup global (hooks before/after)
```

---

## 6. Diretrizes para Evolucao (Proxima Sprint)

### 6.1 Expansao do Escopo
- Automatizar testes do Epico 02 (US03 a US05): Movimentacoes financeiras
- Criar fixtures para movimentacoes (receitas e despesas)
- Adicionar pasta `tests/integration/transactions/`

### 6.2 Evolucao Tecnica
- Implementar CI/CD com execucao automatica dos testes
- Adicionar testes de contrato (schema validation com Joi ou AJV)
- Configurar threshold minimo de cobertura (90%)
- Integrar relatorio Mochawesome ao pipeline de CI

### 6.3 Padroes Obrigatorios
- Todo novo teste deve seguir o padrao de nomenclatura: `describe > context > it`
- Fixtures devem ser utilizadas para dados de entrada
- Helpers devem ser utilizados para operacoes reutilizaveis
- Nenhum teste deve depender da ordem de execucao de outro
