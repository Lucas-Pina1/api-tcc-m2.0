# Testes de Performance com k6

**Projeto:** FinControl Flow  
**Objetivo:** adicionar uma camada enxuta de performance para portfólio, focada em endpoints críticos e fácil de demonstrar.  
**Ferramenta:** k6

---

## 1. Escopo

Foram criados 3 cenários de performance de baixo acoplamento:

- `tests/performance/smoke.js`
- `tests/performance/login-load.js`
- `tests/performance/statement-load.js`

Esses testes não substituem a suíte funcional com Mocha/Chai/Supertest.  
Eles complementam o projeto demonstrando preocupação com tempo de resposta, taxa de erro e comportamento básico sob carga.

---

## 2. Cenários Implementados

### 2.1 Smoke

**Arquivo:** `tests/performance/smoke.js`

Objetivo:
- validar rapidamente que a API responde nos fluxos principais
- verificar `health`, autenticação e consulta de extrato

Cobertura:
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/transactions`
- `GET /api/transactions`

Uso recomendado:
- smoke local antes de demonstração
- validação rápida após mudanças maiores na API

### 2.2 Login Load

**Arquivo:** `tests/performance/login-load.js`

Objetivo:
- medir comportamento do endpoint de login sob carga moderada
- demonstrar capacidade de autenticação repetitiva com assertions e thresholds

Cobertura:
- `POST /api/auth/register` no `setup`
- `POST /api/auth/login` durante a carga

Uso recomendado:
- portfólio
- baseline simples de autenticação

### 2.3 Statement Load

**Arquivo:** `tests/performance/statement-load.js`

Objetivo:
- medir comportamento da consulta principal do produto
- validar leitura autenticada do extrato com múltiplos usuários

Cobertura:
- `POST /api/auth/register` no `setup`
- `POST /api/auth/login` no `setup`
- `POST /api/transactions` no `setup`
- `GET /api/transactions` durante a carga

Uso recomendado:
- demonstrar foco em endpoint de negócio
- apresentar cenário de leitura autenticada em entrevistas e portfólio

---

## 3. Estrutura

```text
tests/
└── performance/
    ├── helpers/
    │   └── api.js
    ├── smoke.js
    ├── login-load.js
    └── statement-load.js
```

### Helper compartilhado

O arquivo `tests/performance/helpers/api.js` centraliza:

- `BASE_URL`
- criação de usuário único
- chamadas de `register`
- chamadas de `login`
- criação de transações
- consulta de extrato
- health check

Isso reduz duplicação e mantém os scripts legíveis.

---

## 4. Pré-requisitos

- API em execução local
- `k6` instalado e disponível no `PATH`

Exemplo para subir a API:

```bash
node server.js
```

Base URL padrão dos testes:

```text
http://localhost:3000
```

Para usar outra URL:

```bash
k6 run -e BASE_URL=http://localhost:3000 tests/performance/smoke.js
```

---

## 5. Como Executar

### Smoke

```bash
npm run perf:smoke
```

### Carga de Login

```bash
npm run perf:login
```

### Carga de Extrato

```bash
npm run perf:statement
```

Também é possível executar diretamente:

```bash
k6 run tests/performance/smoke.js
k6 run tests/performance/login-load.js
k6 run tests/performance/statement-load.js
```

---

## 6. Thresholds Adotados

### Smoke

- `http_req_failed < 1%`
- `p95 http_req_duration < 500ms`

### Login Load

- `http_req_failed < 1%`
- `p95 http_req_duration < 700ms`

### Statement Load

- `http_req_failed < 1%`
- `p95 http_req_duration < 700ms`

Os thresholds foram definidos para portfólio e baseline local, não como meta formal de produção.

---

## 7. Limitações Conhecidas

- a aplicação utiliza persistência em memória
- os resultados representam um baseline técnico local, não capacidade real de produção
- o objetivo principal aqui é demonstrar estrutura, organização e visão de qualidade

---

## 8. Valor para Portfólio

Esta camada de `k6` evidencia:

- conhecimento além de testes funcionais
- preocupação com qualidade não funcional
- organização de testes por objetivo
- uso de thresholds e setup de dados
- foco nos endpoints críticos do produto
