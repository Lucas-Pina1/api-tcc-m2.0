# Casos de Teste Otimizados

**Projeto:** FinControl Flow
**Versao:** 1.0
**Escopo:** Epico 01 - Gestao de Identidade e Acesso (US01, US02)
**Autor:** QA Team
**Data:** 2026-04-27
**Referencia:** ISO/IEC 29119-3
**Tecnicas aplicadas:** Particionamento de Equivalencia, Analise de Valor Limite, Tabela de Decisao

---

## 1. US01 - Cadastro de Novo Usuario

---

### TC-OPT-001 - Cadastro bem-sucedido com dados validos

**Prioridade:** Alta
**Rastreabilidade:** RF01, RN01, US01-CA01, CAG01, CAG02, CT-US01-001, CT-US01-010, CT-US01-011, CT-US01-014, CT-US01-015, CT-US01-016

**Pre-condicoes:**
- O servidor da API esta em execucao.
- O e-mail "usuario.teste@email.com" nao esta cadastrado no sistema.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/auth/register` com o header `Content-Type: application/json` e o corpo: `{"name": "Usuario Teste", "email": "usuario.teste@email.com", "password": "senha123"}` | A API processa a requisicao sem erros. |
| 2 | Verificar o status code da resposta. | O status code retornado e `201 Created`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `true`. |
| 4 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "Usuario cadastrado com sucesso." |
| 5 | Verificar a presenca do objeto `data.user` na resposta. | O objeto `data.user` esta presente e contem os campos `id`, `name`, `email`, `role` e `createdAt`. |
| 6 | Verificar o campo `data.user.id`. | O valor e um UUID v4 valido. |
| 7 | Verificar o campo `data.user.email`. | O valor e "usuario.teste@email.com". |
| 8 | Verificar o campo `data.user.role`. | O valor e "user". |
| 9 | Verificar a ausencia do campo `password` em `data.user`. | O campo `password` NAO esta presente no objeto retornado. |

**Pos-condicoes:**
- O usuario "usuario.teste@email.com" esta registrado no sistema com role "user".

---

### TC-OPT-002 - Rejeicao de cadastro com e-mail duplicado (case-insensitive)

**Prioridade:** Alta
**Rastreabilidade:** RF01, RN01, US01-CA02, CAG01, CT-US01-002, CT-US01-009, CT-US01-012

**Pre-condicoes:**
- O servidor da API esta em execucao.
- O e-mail "duplicado@email.com" ja esta cadastrado no sistema.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/auth/register` com o corpo: `{"name": "Outro Usuario", "email": "duplicado@email.com", "password": "senha456"}` | A API processa a requisicao e identifica o conflito. |
| 2 | Verificar o status code da resposta. | O status code retornado e `409 Conflict`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `false`. |
| 4 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "Este e-mail ja esta cadastrado na plataforma." |
| 5 | Enviar uma requisicao `POST /api/auth/register` com o corpo: `{"name": "Uppercase Test", "email": "DUPLICADO@EMAIL.COM", "password": "senha789"}` | A API normaliza o e-mail para lowercase antes da verificacao. |
| 6 | Verificar o status code da resposta. | O status code retornado e `409 Conflict`. |
| 7 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` indica duplicidade de e-mail. |

**Pos-condicoes:**
- Nenhum novo registro e criado no sistema.

---

### TC-OPT-003 - Rejeicao de cadastro com campos obrigatorios ausentes (corpo vazio)

**Prioridade:** Alta
**Rastreabilidade:** RF01, CAG05, CAG01, CT-US01-003, CT-US01-004, CT-US01-005, CT-US01-006, CT-US01-013, CT-US01-016

**Pre-condicoes:**
- O servidor da API esta em execucao.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/auth/register` com o corpo: `{}` | A API processa a requisicao e identifica todos os campos ausentes. |
| 2 | Verificar o status code da resposta. | O status code retornado e `400 Bad Request`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `false`. |
| 4 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "Campos obrigatorios nao preenchidos." |
| 5 | Verificar o campo `details.missingFields`. | O array contem os valores "name", "email" e "password". |
| 6 | Enviar uma requisicao `POST /api/auth/register` com o corpo: `{"email": "teste@email.com", "password": "senha123"}` (sem "name"). | A API rejeita a requisicao. |
| 7 | Verificar o status code da resposta. | O status code retornado e `400 Bad Request`. |
| 8 | Verificar o campo `details.missingFields`. | O array contem o valor "name". |

**Pos-condicoes:**
- Nenhum novo registro e criado no sistema.

---

### TC-OPT-004 - Rejeicao de cadastro com formato de e-mail invalido

**Prioridade:** Alta
**Rastreabilidade:** RF01, CAG05, CT-US01-007

**Pre-condicoes:**
- O servidor da API esta em execucao.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/auth/register` com o corpo: `{"name": "Teste", "email": "email-invalido", "password": "senha123"}` | A API processa a requisicao e identifica o formato invalido. |
| 2 | Verificar o status code da resposta. | O status code retornado e `400 Bad Request`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `false`. |
| 4 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "Formato de e-mail invalido." |

**Pos-condicoes:**
- Nenhum novo registro e criado no sistema.

---

### TC-OPT-005 - Rejeicao de cadastro com senha no valor limite inferior (< 6 caracteres)

**Prioridade:** Media
**Rastreabilidade:** RF01, CAG05, CT-US01-008

**Pre-condicoes:**
- O servidor da API esta em execucao.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/auth/register` com o corpo: `{"name": "Teste", "email": "limite@email.com", "password": "12345"}` (5 caracteres - valor limite inferior). | A API processa a requisicao e identifica a senha fraca. |
| 2 | Verificar o status code da resposta. | O status code retornado e `400 Bad Request`. |
| 3 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "A senha deve conter no minimo 6 caracteres." |
| 4 | Enviar uma requisicao `POST /api/auth/register` com o corpo: `{"name": "Teste", "email": "limite2@email.com", "password": "123456"}` (6 caracteres - valor limite exato). | A API aceita a senha. |
| 5 | Verificar o status code da resposta. | O status code retornado e `201 Created`. |

**Pos-condicoes:**
- O usuario "limite2@email.com" e registrado no sistema (cleanup necessario).
- Nenhum registro e criado para "limite@email.com".

---

## 2. US02 - Autenticacao de Usuario

---

### TC-OPT-006 - Login bem-sucedido com credenciais validas

**Prioridade:** Alta
**Rastreabilidade:** RF02, US02-CA01, CAG01, CAG02, CT-US02-001, CT-US02-008, CT-US02-009, CT-US02-010, CT-US02-013, CT-US02-019

**Pre-condicoes:**
- O servidor da API esta em execucao.
- O usuario "login.teste@email.com" esta cadastrado no sistema com a senha "senha123".

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/auth/login` com o header `Content-Type: application/json` e o corpo: `{"email": "login.teste@email.com", "password": "senha123"}` | A API processa a requisicao e valida as credenciais. |
| 2 | Verificar o status code da resposta. | O status code retornado e `200 OK`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `true`. |
| 4 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "Login realizado com sucesso." |
| 5 | Verificar a presenca do campo `data.token`. | O campo `data.token` esta presente e contem uma string JWT valida (formato: xxxxx.xxxxx.xxxxx). |
| 6 | Verificar a presenca do objeto `data.user`. | O objeto `data.user` contem os campos `id`, `name`, `email`, `role` e `createdAt`. |
| 7 | Verificar a ausencia do campo `password` em `data.user`. | O campo `password` NAO esta presente no objeto retornado. |
| 8 | Decodificar o payload do token JWT. | O payload contem as claims `id`, `email` e `role` correspondentes ao usuario autenticado. |

**Pos-condicoes:**
- O token JWT retornado e valido e possui tempo de expiracao configurado.

---

### TC-OPT-007 - Rejeicao de login com credenciais invalidas (mensagem generica anti-enumeracao)

**Prioridade:** Alta
**Rastreabilidade:** RF02, US02-CA02, CAG01, CAG02, CT-US02-002, CT-US02-003, CT-US02-007, CT-US02-011

**Pre-condicoes:**
- O servidor da API esta em execucao.
- O usuario "login.teste@email.com" esta cadastrado com a senha "senha123".
- O e-mail "inexistente@email.com" nao esta cadastrado no sistema.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/auth/login` com o corpo: `{"email": "inexistente@email.com", "password": "qualquersenha"}` | A API processa a requisicao e nao localiza o usuario. |
| 2 | Verificar o status code da resposta. | O status code retornado e `401 Unauthorized`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `false`. |
| 4 | Verificar o campo `message` e armazenar como `mensagem_email_errado`. | O valor do campo `message` e "E-mail ou senha incorretos." |
| 5 | Enviar uma requisicao `POST /api/auth/login` com o corpo: `{"email": "login.teste@email.com", "password": "senhaerrada"}` | A API processa a requisicao e identifica a senha incorreta. |
| 6 | Verificar o status code da resposta. | O status code retornado e `401 Unauthorized`. |
| 7 | Verificar o campo `message` e armazenar como `mensagem_senha_errada`. | O valor do campo `message` e "E-mail ou senha incorretos." |
| 8 | Comparar `mensagem_email_errado` com `mensagem_senha_errada`. | As mensagens sao identicas, impedindo enumeracao de usuarios. |

**Pos-condicoes:**
- Nenhum token e gerado em nenhuma das tentativas.

---

### TC-OPT-008 - Rejeicao de login com campos obrigatorios ausentes

**Prioridade:** Alta
**Rastreabilidade:** RF02, CAG05, CAG01, CT-US02-004, CT-US02-005, CT-US02-006, CT-US02-012, CT-US02-019

**Pre-condicoes:**
- O servidor da API esta em execucao.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/auth/login` com o corpo: `{}` | A API processa a requisicao e identifica os campos ausentes. |
| 2 | Verificar o status code da resposta. | O status code retornado e `400 Bad Request`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `false`. |
| 4 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "E-mail e senha sao obrigatorios." |
| 5 | Verificar o campo `details.missingFields`. | O array contem os valores "email" e "password". |
| 6 | Enviar uma requisicao `POST /api/auth/login` com o corpo: `{"password": "senha123"}` (sem "email"). | A API rejeita a requisicao. |
| 7 | Verificar o status code da resposta. | O status code retornado e `400 Bad Request`. |
| 8 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "E-mail e senha sao obrigatorios." |
| 9 | Enviar uma requisicao `POST /api/auth/login` com o corpo: `{"email": "login.teste@email.com"}` (sem "password"). | A API rejeita a requisicao. |
| 10 | Verificar o status code da resposta. | O status code retornado e `400 Bad Request`. |
| 11 | Verificar o campo `details.missingFields`. | O array contem o valor "password". |

**Pos-condicoes:**
- Nenhum token e gerado.

---

## 3. Protecao de Rotas via Token JWT

---

### TC-OPT-009 - Acesso autorizado a rota protegida com token JWT valido

**Prioridade:** Alta
**Rastreabilidade:** RF02, CAG02, CT-US02-014

**Pre-condicoes:**
- O servidor da API esta em execucao.
- O usuario esta autenticado e possui um token JWT valido obtido via login.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `GET /api/auth/profile` com o header `Authorization: Bearer <token_valido>`. | A API valida o token e processa a requisicao. |
| 2 | Verificar o status code da resposta. | O status code retornado e `200 OK`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `true`. |
| 4 | Verificar a presenca do objeto `data.user`. | O objeto `data.user` contem os campos `id`, `name`, `email`, `role` e `createdAt` correspondentes ao usuario autenticado. |
| 5 | Verificar a ausencia do campo `password` em `data.user`. | O campo `password` NAO esta presente no objeto retornado. |

**Pos-condicoes:**
- O estado do sistema permanece inalterado.

---

### TC-OPT-010 - Rejeicao de acesso a rota protegida sem token

**Prioridade:** Alta
**Rastreabilidade:** RF02, CAG02, CT-US02-015

**Pre-condicoes:**
- O servidor da API esta em execucao.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `GET /api/auth/profile` sem o header `Authorization`. | A API identifica a ausencia do token. |
| 2 | Verificar o status code da resposta. | O status code retornado e `401 Unauthorized`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `false`. |
| 4 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "Token de autenticacao nao fornecido." |

**Pos-condicoes:**
- Nenhum dado do usuario e exposto.

---

### TC-OPT-011 - Rejeicao de acesso com token de formato invalido ou adulterado

**Prioridade:** Alta
**Rastreabilidade:** RF02, CAG02, CT-US02-016, CT-US02-018

**Pre-condicoes:**
- O servidor da API esta em execucao.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `GET /api/auth/profile` com o header `Authorization: token_sem_bearer` (sem prefixo "Bearer"). | A API identifica o formato incorreto. |
| 2 | Verificar o status code da resposta. | O status code retornado e `401 Unauthorized`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `false`. |
| 4 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` indica formato de token invalido. |
| 5 | Enviar uma requisicao `GET /api/auth/profile` com o header `Authorization: Bearer token.invalido.adulterado`. | A API identifica a assinatura invalida. |
| 6 | Verificar o status code da resposta. | O status code retornado e `401 Unauthorized`. |
| 7 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "Token invalido." |

**Pos-condicoes:**
- Nenhum dado do usuario e exposto.

---

### TC-OPT-012 - Rejeicao de acesso com token expirado

**Prioridade:** Alta
**Rastreabilidade:** RF02, CAG02, CT-US02-017

**Pre-condicoes:**
- O servidor da API esta em execucao.
- O testador possui um token JWT que ja ultrapassou o tempo de expiracao configurado.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `GET /api/auth/profile` com o header `Authorization: Bearer <token_expirado>`. | A API identifica que o token esta expirado. |
| 2 | Verificar o status code da resposta. | O status code retornado e `401 Unauthorized`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `false`. |
| 4 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "Token expirado. Realize o login novamente." |

**Pos-condicoes:**
- Nenhum dado do usuario e exposto.
- O usuario deve realizar um novo login para obter um token valido.

---

### TC-OPT-013 - Fluxo integrado: Cadastro, Login e Acesso a rota protegida (End-to-End)

**Prioridade:** Alta
**Rastreabilidade:** RF01, RF02, US01-CA01, US02-CA01, CAG01, CAG02

**Pre-condicoes:**
- O servidor da API esta em execucao.
- O e-mail "e2e.teste@email.com" nao esta cadastrado no sistema.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/auth/register` com o corpo: `{"name": "E2E Teste", "email": "e2e.teste@email.com", "password": "senha123"}` | O status code retornado e `201 Created` e o campo `success` e `true`. |
| 2 | Enviar uma requisicao `POST /api/auth/login` com o corpo: `{"email": "e2e.teste@email.com", "password": "senha123"}` | O status code retornado e `200 OK` e o campo `data.token` contem um JWT valido. |
| 3 | Armazenar o valor de `data.token` como `<token>`. | O token e armazenado para uso no proximo passo. |
| 4 | Enviar uma requisicao `GET /api/auth/profile` com o header `Authorization: Bearer <token>`. | O status code retornado e `200 OK`. |
| 5 | Verificar o campo `data.user.email`. | O valor e "e2e.teste@email.com". |
| 6 | Verificar o campo `data.user.name`. | O valor e "E2E Teste". |

**Pos-condicoes:**
- O usuario "e2e.teste@email.com" esta registrado e autenticado no sistema.

---

## Matriz de Rastreabilidade

| Requisito / Regra | Casos de Teste Otimizados |
|:---|:---|
| RF01 | TC-OPT-001, TC-OPT-002, TC-OPT-003, TC-OPT-004, TC-OPT-005, TC-OPT-013 |
| RF02 | TC-OPT-006, TC-OPT-007, TC-OPT-008, TC-OPT-009, TC-OPT-010, TC-OPT-011, TC-OPT-012, TC-OPT-013 |
| RN01 | TC-OPT-001, TC-OPT-002 |
| CAG01 | TC-OPT-001, TC-OPT-002, TC-OPT-003, TC-OPT-006, TC-OPT-007, TC-OPT-008, TC-OPT-013 |
| CAG02 | TC-OPT-001, TC-OPT-006, TC-OPT-007, TC-OPT-009, TC-OPT-010, TC-OPT-011, TC-OPT-012, TC-OPT-013 |
| CAG05 | TC-OPT-003, TC-OPT-004, TC-OPT-005, TC-OPT-008 |

---

## Resumo da Suite

| Metrica | Valor |
|:---|:---|
| Total de casos de teste | 13 |
| Cobertura de User Stories | US01, US02 (100%) |
| Cobertura de Requisitos Funcionais | RF01, RF02 (100%) |
| Cobertura de Regras de Negocio | RN01 (100%) |
| Cobertura de Criterios de Aceite Globais | CAG01, CAG02, CAG05 (100%) |
| Cenarios positivos | 3 (TC-OPT-001, TC-OPT-006, TC-OPT-009) |
| Cenarios negativos | 9 (TC-OPT-002 a TC-OPT-005, TC-OPT-007, TC-OPT-008, TC-OPT-010 a TC-OPT-012) |
| Cenarios end-to-end | 1 (TC-OPT-013) |
| Reducao em relacao a suite original | 20 → 13 (reducao de 35%) |
