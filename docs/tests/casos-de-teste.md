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
- O e-mail "<usuario.teste@email.com>" nao esta cadastrado no sistema.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/auth/register` com o header `Content-Type: application/json` e o corpo: `{"name": "Usuario Teste", "email": "usuario.teste@email.com", "password": "senha123"}` | A API processa a requisicao sem erros. |
| 2 | Verificar o status code da resposta. | O status code retornado e `201 Created`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `true`. |
| 4 | Verificar o campo `message` no corpo da resposta. | O valor do campo `message` e "Usuario cadastrado com sucesso." |
| 5 | Verificar a presenca do objeto `data.user` na resposta. | O objeto `data.user` esta presente e contem os campos `id`, `name`, `email`, `role` e `createdAt`. |
| 6 | Verificar o campo `data.user.id`. | O valor e um UUID v4 valido. |
| 7 | Verificar o campo `data.user.email`. | O valor e "<usuario.teste@email.com>". |
| 8 | Verificar o campo `data.user.role`. | O valor e "user". |
| 9 | Verificar a ausencia do campo `password` em `data.user`. | O campo `password` NAO esta presente no objeto retornado. |

**Pos-condicoes:**

- O usuario "<usuario.teste@email.com>" esta registrado no sistema com role "user".

---

### TC-OPT-002 - Rejeicao de cadastro com e-mail duplicado (case-insensitive)

**Prioridade:** Alta
**Rastreabilidade:** RF01, RN01, US01-CA02, CAG01, CT-US01-002, CT-US01-009, CT-US01-012

**Pre-condicoes:**

- O servidor da API esta em execucao.
- O e-mail "<duplicado@email.com>" ja esta cadastrado no sistema.

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

- O usuario "<limite2@email.com>" e registrado no sistema (cleanup necessario).
- Nenhum registro e criado para "<limite@email.com>".

---

## 2. US02 - Autenticacao de Usuario

---

### TC-OPT-006 - Login bem-sucedido com credenciais validas

**Prioridade:** Alta
**Rastreabilidade:** RF02, US02-CA01, CAG01, CAG02, CT-US02-001, CT-US02-008, CT-US02-009, CT-US02-010, CT-US02-013, CT-US02-019

**Pre-condicoes:**

- O servidor da API esta em execucao.
- O usuario "<login.teste@email.com>" esta cadastrado no sistema com a senha "senha123".

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
- O usuario "<login.teste@email.com>" esta cadastrado com a senha "senha123".
- O e-mail "<inexistente@email.com>" nao esta cadastrado no sistema.

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
- O e-mail "<e2e.teste@email.com>" nao esta cadastrado no sistema.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/auth/register` com o corpo: `{"name": "E2E Teste", "email": "e2e.teste@email.com", "password": "senha123"}` | O status code retornado e `201 Created` e o campo `success` e `true`. |
| 2 | Enviar uma requisicao `POST /api/auth/login` com o corpo: `{"email": "e2e.teste@email.com", "password": "senha123"}` | O status code retornado e `200 OK` e o campo `data.token` contem um JWT valido. |
| 3 | Armazenar o valor de `data.token` como `<token>`. | O token e armazenado para uso no proximo passo. |
| 4 | Enviar uma requisicao `GET /api/auth/profile` com o header `Authorization: Bearer <token>`. | O status code retornado e `200 OK`. |
| 5 | Verificar o campo `data.user.email`. | O valor e "<e2e.teste@email.com>". |
| 6 | Verificar o campo `data.user.name`. | O valor e "E2E Teste". |

**Pos-condicoes:**

- O usuario "<e2e.teste@email.com>" esta registrado e autenticado no sistema.

---

### 3. US03 - Registro de Movimentacao

---

### TC-OPT-014 - Criacao bem-sucedida de movimentacao (Receita e Despesa)

**Prioridade:** Alta
**Rastreabilidade:** RF03, US03-CA01, US03-CA02, CAG01, CAG02, CT-US03-001, CT-US03-011, CT-US03-012

**Pre-condicoes:**

- O servidor da API esta em execucao.
- O usuario esta autenticado e possui um token JWT valido.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/transactions` com o header `Authorization: Bearer <token_valido>` e o corpo: `{"description": "Salario", "amount": 5000.00, "date": "2026-05-01", "type": "receita", "status": "pago"}` | A API processa a requisicao sem erros. |
| 2 | Verificar o status code da resposta. | O status code retornado e `201 Created`. |
| 3 | Verificar a vinculacao e os dados no corpo da resposta. | O campo `success` e `true` e os dados retornados contem um ID gerado associado implicitamente ao usuario autenticado. |
| 4 | Enviar uma requisicao `POST /api/transactions` com o corpo: `{"description": "Aluguel", "amount": 1500.00, "date": "2026-05-05", "type": "despesa", "status": "pendente"}` | A API processa a criacao da despesa corretamente. |
| 5 | Verificar o status code da resposta. | O status code retornado e `201 Created`. |

**Pos-condicoes:**

- As movimentacoes de receita e despesa sao persistidas no banco de dados e vinculadas ao usuario dono do token.

---

### TC-OPT-015 - Rejeicao de criacao com valores invalidos (Particionamento de Equivalencia e Valor Limite)

**Prioridade:** Alta
**Rastreabilidade:** RF03, RN04, US03-CA01, CAG05, CT-US03-002, CT-US03-003

**Pre-condicoes:**

- O servidor da API esta em execucao.
- O usuario esta autenticado e possui um token JWT valido.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/transactions` preenchendo o campo `amount` com o valor `0` (zero). | A API rejeita a transacao por violar a regra de valor minimo (RN04). |
| 2 | Verificar o status code da resposta. | O status code retornado e `400 Bad Request`. |
| 3 | Verificar o campo de mensagem. | O erro especifica que o valor da movimentacao deve ser maior que zero. |
| 4 | Enviar uma requisicao `POST /api/transactions` preenchendo o campo `amount` com o valor `-50.00` (negativo). | A API rejeita a requisicao, validando o limite inferior da regra de negocio. |
| 5 | Verificar o status code da resposta. | O status code retornado e `400 Bad Request`. |

**Pos-condicoes:**

- Nenhuma movimentacao invalida e inserida na base de dados.

---

### TC-OPT-016 - Rejeicao de criacao com campos obrigatorios ausentes ou nao permitidos

**Prioridade:** Alta
**Rastreabilidade:** RF03, US03-CA02, CAG05, CT-US03-004, CT-US03-005, CT-US03-006, CT-US03-007, CT-US03-008, CT-US03-009, CT-US03-010

**Pre-condicoes:**

- O servidor da API esta em execucao.
- O usuario esta autenticado e possui um token JWT valido.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `POST /api/transactions` com o corpo vazio `{}`. | A API rejeita a requisicao, identificando as faltas. |
| 2 | Verificar o status code e a estrutura de erro. | O status code e `400 Bad Request` e a resposta indica a obrigatoriedade dos campos (description, amount, date, type, status). |
| 3 | Enviar requisicao informando valor invalido para o tipo: `{"type": "transferencia", ...}`. | A API rejeita a requisicao por valor fora do dominio de dados permitido. |
| 4 | Verificar a resposta de erro para o campo type. | O status code e `400 Bad Request` indicando que o tipo deve ser "receita" ou "despesa". |
| 5 | Enviar requisicao informando valor invalido para o status: `{"status": "atrasado", ...}`. | A API rejeita a requisicao por valor fora do dominio de dados permitido. |
| 6 | Verificar a resposta de erro para o campo status. | O status code e `400 Bad Request` indicando que o status deve ser "pendente" ou "pago". |

**Pos-condicoes:**

- O sistema mantem a integridade estrutural, nao persistindo dados inconsistentes.

---

## 4. US04 - Efetivacao de Pagamento

---

### TC-OPT-017 - Alteracao de status para pago bem-sucedida

**Prioridade:** Alta
**Rastreabilidade:** RF04, US04-CA01, CAG01, CT-US04-001, CT-US04-006, CT-US04-007

**Pre-condicoes:**

- O servidor da API esta em execucao.
- O usuario esta autenticado e possui uma movimentacao financeira com status "pendente".

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `PATCH /api/transactions/{id}/pay` (ou endpoint correspondente) utilizando o ID da movimentacao pendente pertencente ao usuario. | A API processa a alteracao de status. |
| 2 | Verificar o status code da resposta. | O status code retornado e `200 OK`. |
| 3 | Verificar os atributos atualizados no corpo da resposta. | O campo `status` e alterado para "pago" e a data de atualizacao (`updatedAt`) e modificada. |

**Pos-condicoes:**

- A movimentacao fica registrada com status definitivo de "pago".

---

### TC-OPT-018 - Rejeicao de transicao invalida de status (RN05)

**Prioridade:** Alta
**Rastreabilidade:** RF04, RN05, US04-CA02, CT-US04-002, CT-US04-003

**Pre-condicoes:**

- O servidor da API esta em execucao.
- O usuario esta autenticado e possui uma movimentacao ja efetivada com status "pago".

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Tentar efetivar pagamento enviando requisicao `PATCH /api/transactions/{id}/pay` para o ID da movimentacao ja paga. | A API identifica a redundancia e bloqueia a acao, conforme a regra RN05. |
| 2 | Verificar o status code retornado. | O status code e correspondente a erro de regra de negocio (ex: `400 Bad Request` ou `422 Unprocessable Entity`). |
| 3 | Tentar forcar o retorno do status para "pendente" enviando uma atualizacao (`PUT` ou `PATCH`) na movimentacao. | A API bloqueia a reversao. |
| 4 | Verificar a resposta de erro da tentativa de reversao. | O sistema informa que movimentacoes ja pagas nao podem retornar ao status pendente. |

**Pos-condicoes:**

- O status da movimentacao assegura a imutabilidade apos pagamento, permanecendo "pago".

---

### TC-OPT-019 - Protecao contra alteracao de movimentacao de terceiros ou inexistente

**Prioridade:** Alta
**Rastreabilidade:** RN02, CAG01, CAG02, CT-US04-004, CT-US04-005

**Pre-condicoes:**

- O servidor da API esta em execucao.
- Dois usuarios distintos estao autenticados (Usuario A e Usuario B).
- O Usuario A possui uma movimentacao "pendente".

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao de efetivacao de pagamento utilizando o token do Usuario B, informando o ID da movimentacao pertencente ao Usuario A. | A API detecta o desvio de autorizacao e protege os dados (RN02). |
| 2 | Verificar o status code retornado. | O status code e `404 Not Found` ou `403 Forbidden`. |
| 3 | Enviar uma requisicao utilizando o token do Usuario A com um ID de movimentacao que nao existe no sistema. | A API busca o registro e nao o localiza. |
| 4 | Verificar o status code retornado. | O status code e `404 Not Found`. |

**Pos-condicoes:**

- A movimentacao do Usuario A permanece inalterada e restrita a ele proprio.

---

## 5. US05 - Exclusao de Movimentacao

---

### TC-OPT-020 - Exclusao de movimentacao pendente com sucesso

**Prioridade:** Alta
**Rastreabilidade:** RF07, US05-CA01, CAG01, CT-US05-001, CT-US05-005

**Pre-condicoes:**

- O servidor da API esta em execucao.
- O usuario esta autenticado e possui uma movimentacao financeira com status "pendente".

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `DELETE /api/transactions/{id}` contendo o ID da movimentacao pendente do usuario. | A API processa a solicitacao de remocao. |
| 2 | Verificar o status code da resposta. | O status code retornado e `200 OK` ou `204 No Content`. |
| 3 | Efetuar uma nova requisicao `GET /api/transactions/{id}` buscando o ID recem-excluido. | A API nao localiza mais o registro. |
| 4 | Verificar o retorno da pesquisa. | O status code retornado na busca e `404 Not Found`. |

**Pos-condicoes:**

- O registro e removido em definitivo do sistema.

---

### TC-OPT-021 - Rejeicao de exclusao de movimentacao efetivada (RN06)

**Prioridade:** Alta
**Rastreabilidade:** RF07, RN06, US05-CA02, CAG04, CT-US05-002

**Pre-condicoes:**

- O servidor da API esta em execucao.
- O usuario esta autenticado e possui uma movimentacao financeira com status "pago".

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `DELETE /api/transactions/{id}` utilizando o ID da movimentacao que possui status "pago". | A API valida as regras de negocio e impede a delecao (RN06). |
| 2 | Verificar o status code da resposta. | O status code indica rejeicao por violacao de regra (ex: `400 Bad Request` ou `422 Unprocessable Entity`). |
| 3 | Verificar a mensagem explicativa. | O retorno informa que movimentacoes ja pagas nao podem ser deletadas do sistema. |

**Pos-condicoes:**

- A movimentacao consolidada permanece no sistema sem modificacoes.

---

### TC-OPT-022 - Protecao contra exclusao de movimentacao de terceiros ou inexistente

**Prioridade:** Alta
**Rastreabilidade:** RN02, CAG01, CAG02, CT-US05-003, CT-US05-004

**Pre-condicoes:**

- O servidor da API esta em execucao.
- Dois usuarios distintos estao autenticados (Usuario A e Usuario B).
- O Usuario A possui uma movimentacao "pendente".

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `DELETE /api/transactions/{id}` utilizando o token do Usuario B, informando o ID da movimentacao do Usuario A. | A API barra a exclusao indevida assegurando a privacidade dos dados (RN02). |
| 2 | Verificar o status code retornado. | O status code retornado e `404 Not Found` ou `403 Forbidden`. |
| 3 | Enviar requisicao `DELETE /api/transactions/{id}` utilizando o token do Usuario A contendo um ID de transacao invalido ou inexistente. | A API nao localiza o registro para delecao. |
| 4 | Verificar o status code retornado. | O status code retornado e `404 Not Found`. |

**Pos-condicoes:**

- Os registros do Usuario A e a base de dados mantem-se integros e inalterados por ataques ou erros de rota.

---

## Matriz de Rastreabilidade

| Requisito / Regra | Casos de Teste Otimizados |
|:---|:---|
| RF01 | TC-OPT-001, TC-OPT-002, TC-OPT-003, TC-OPT-004, TC-OPT-005, TC-OPT-013 |
| RF02 | TC-OPT-006, TC-OPT-007, TC-OPT-008, TC-OPT-009, TC-OPT-010, TC-OPT-011, TC-OPT-012, TC-OPT-013 |
| RF03 | TC-OPT-014, TC-OPT-015, TC-OPT-016 |
| RF04 | TC-OPT-017, TC-OPT-018, TC-OPT-019 |
| RF07 | TC-OPT-020, TC-OPT-021, TC-OPT-022 |
| RN01 | TC-OPT-001, TC-OPT-002 |
| RN02 | TC-OPT-019, TC-OPT-022 |
| RN04 | TC-OPT-015 |
| RN05 | TC-OPT-018 |
| RN06 | TC-OPT-021 |
| CAG01 | TC-OPT-001, TC-OPT-002, TC-OPT-003, TC-OPT-006, TC-OPT-007, TC-OPT-008, TC-OPT-013, TC-OPT-014, TC-OPT-017, TC-OPT-019, TC-OPT-020, TC-OPT-022 |
| CAG02 | TC-OPT-001, TC-OPT-006, TC-OPT-007, TC-OPT-009, TC-OPT-010, TC-OPT-011, TC-OPT-012, TC-OPT-013, TC-OPT-014, TC-OPT-019, TC-OPT-022 |
| CAG04 | TC-OPT-021 |
| CAG05 | TC-OPT-003, TC-OPT-004, TC-OPT-005, TC-OPT-008, TC-OPT-015, TC-OPT-016 |

---

## 6. US06 - Visualizacao de Saldo e Extrato

---

### TC-OPT-023 - Consulta de extrato e saldo com historico vazio

**Prioridade:** Alta
**Rastreabilidade:** RF05, RF06, US06-CA01, CAG01, CT-US06-001, CT-US06-006

**Pre-condicoes:**

- O servidor da API esta em execucao.
- O usuario esta autenticado e possui um token JWT valido.
- O usuario autenticado nao possui movimentacoes registradas.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `GET /api/transactions` (ou endpoint correspondente da consulta principal) com o header `Authorization: Bearer <token_valido>`. | A API processa a requisicao sem erros. |
| 2 | Verificar o status code da resposta. | O status code retornado e `200 OK`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `true`. |
| 4 | Verificar a estrutura do corpo da resposta. | A resposta contem os campos `message` e `data`, com `data.transactions` e `data.balance`. |
| 5 | Verificar o campo `data.transactions`. | O valor do campo e um array vazio. |
| 6 | Verificar o campo `data.balance`. | O valor do campo e `0`. |

**Pos-condicoes:**

- Nenhuma movimentacao e criada ou alterada no sistema.

---

### TC-OPT-024 - Consulta consolidada com saldo negativo, ordem cronologica e isolamento de dados

**Prioridade:** Alta
**Rastreabilidade:** RF05, RF06, RN02, US06-CA01, US06-CA02, CAG01, CAG02, CAG03, CT-US06-002, CT-US06-003, CT-US06-004, CT-US06-005, CT-US06-006

**Pre-condicoes:**

- O servidor da API esta em execucao.
- O Usuario A esta autenticado e possui um token JWT valido.
- O Usuario B esta autenticado e possui um token JWT valido.
- Existem exatamente 3 movimentacoes do Usuario A registradas nas datas `2026-05-02`, `2026-05-10` e `2026-05-20`, com valores `50.00` (despesa), `100.00` (receita) e `300.00` (despesa), respectivamente.
- Existe pelo menos 1 movimentacao do Usuario B registrada na base.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `GET /api/transactions` (ou endpoint correspondente da consulta principal) utilizando o token do Usuario A. | A API processa a consulta considerando apenas os dados do Usuario A. |
| 2 | Verificar o status code da resposta. | O status code retornado e `200 OK`. |
| 3 | Verificar a quantidade de itens em `data.transactions`. | O array contem exatamente 3 movimentacoes. |
| 4 | Verificar a origem dos registros retornados. | Nenhuma movimentacao pertencente ao Usuario B esta presente na resposta. |
| 5 | Verificar a ordenacao do extrato retornado. | As movimentacoes sao exibidas em ordem cronologica pelas datas `2026-05-02`, `2026-05-10` e `2026-05-20`. |
| 6 | Verificar o campo `data.balance`. | O saldo retornado e `-250.00`, resultante de `100.00 - 350.00`. |
| 7 | Verificar os valores individuais exibidos no extrato. | Os valores e tipos retornados correspondem exatamente aos lancamentos previamente registrados para o Usuario A. |

**Pos-condicoes:**

- Nenhuma movimentacao do Usuario A ou do Usuario B e alterada durante a consulta.

---

## 7. US07 - Gestao de Contas por Administrador

---

### TC-OPT-025 - Listagem administrativa de usuarios com exposicao minima de dados

**Prioridade:** Alta
**Rastreabilidade:** RF08, RN03, US07-CA01, US07-CA03, CAG01, CAG02, CT-US07-001, CT-US07-002

**Pre-condicoes:**

- O servidor da API esta em execucao.
- Existe um usuario com perfil `admin` autenticado e com token JWT valido.
- Existem pelo menos 2 usuarios comuns cadastrados no sistema.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `GET /api/admin/users` com o header `Authorization: Bearer <token_admin>`. | A API processa a requisicao da area administrativa. |
| 2 | Verificar o status code da resposta. | O status code retornado e `200 OK`. |
| 3 | Verificar o campo `success` no corpo da resposta. | O valor do campo `success` e `true`. |
| 4 | Verificar o campo `data.users`. | O campo esta presente e contem a lista de usuarios cadastrados. |
| 5 | Verificar a estrutura de cada item retornado na lista. | Cada usuario contem apenas os campos cadastrais necessarios, como `id`, `name`, `email` e `role`. |
| 6 | Verificar a ausencia de dados sensiveis na resposta. | Nenhum item da lista contem campos como `password`, `token`, `balance`, `transactions` ou qualquer detalhe financeiro. |

**Pos-condicoes:**

- Nenhuma conta e alterada ou removida durante a execucao do teste.

---

### TC-OPT-026 - Banimento administrativo com invalidacao de credenciais

**Prioridade:** Alta
**Rastreabilidade:** RF09, US07-CA02, CAG01, CAG02, CT-US07-003, CT-US07-004

**Pre-condicoes:**

- O servidor da API esta em execucao.
- Existe um usuario com perfil `admin` autenticado e com token JWT valido.
- Existe um usuario comum ativo, com credenciais conhecidas, passivel de exclusao administrativa.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `DELETE /api/admin/users/{id}` utilizando o ID do usuario comum alvo e o token do administrador. | A API processa a exclusao administrativa da conta. |
| 2 | Verificar o status code da resposta. | O status code retornado indica sucesso na operacao (`200 OK` ou `204 No Content`). |
| 3 | Enviar uma requisicao `POST /api/auth/login` com o e-mail e a senha do usuario excluido. | A API rejeita a autenticacao das credenciais invalidadas. |
| 4 | Verificar o retorno da tentativa de login do usuario excluido. | O status code retornado e `401 Unauthorized` e a mensagem informa que as credenciais sao invalidas. |
| 5 | Enviar uma nova requisicao `GET /api/admin/users` com o token do administrador. | A API retorna a lista atualizada de usuarios. |
| 6 | Verificar a presenca do usuario removido na listagem atualizada. | O usuario excluido nao esta mais presente em `data.users`. |

**Pos-condicoes:**

- A conta do usuario alvo permanece removida do sistema.
- As credenciais do usuario removido permanecem invalidadas.

---

### TC-OPT-027 - Protecao de acesso e privacidade na administracao da plataforma

**Prioridade:** Alta
**Rastreabilidade:** RF08, RF09, RN03, US07-CA03, CAG01, CAG02, CT-US07-005, CT-US07-006, CT-US07-007, CT-US07-008

**Pre-condicoes:**

- O servidor da API esta em execucao.
- Existe um usuario com perfil `admin` autenticado e com token JWT valido.
- Existe um usuario comum autenticado e com token JWT valido.
- Existe um segundo usuario comum com movimentacoes financeiras registradas.

| Passo | Acao | Resultado Esperado |
|:---|:---|:---|
| 1 | Enviar uma requisicao `GET /api/admin/users` utilizando o token do usuario comum. | A API bloqueia o acesso a funcionalidade administrativa. |
| 2 | Verificar o status code da resposta. | O status code retornado e `401 Unauthorized` ou `403 Forbidden`. |
| 3 | Enviar uma requisicao `DELETE /api/admin/users/{id}` utilizando o token do usuario comum e o ID de outro usuario. | A API bloqueia a tentativa de exclusao sem privilegio administrativo. |
| 4 | Verificar o status code da resposta. | O status code retornado e `401 Unauthorized` ou `403 Forbidden`. |
| 5 | Enviar uma requisicao `DELETE /api/admin/users/{id_inexistente}` utilizando o token do administrador. | A API processa a busca do usuario alvo e nao localiza a conta. |
| 6 | Verificar o status code da resposta. | O status code retornado e `404 Not Found`. |
| 7 | Enviar uma requisicao `GET /api/users/{id}/transactions` (ou rota equivalente de consulta financeira) utilizando o token do administrador e o ID do usuario comum com movimentacoes. | A API impede o acesso administrativo aos dados financeiros do usuario alvo. |
| 8 | Verificar o retorno da tentativa de acesso financeiro. | O status code retornado e `403 Forbidden` ou `404 Not Found`, sem exposicao de saldo, extrato ou movimentacoes no corpo da resposta. |

**Pos-condicoes:**

- Nenhuma conta e removida pelo usuario comum.
- Nenhum dado financeiro de usuario comum e exposto ao administrador.

---

## Resumo da Suite

| Metrica | Valor |
|:---|:---|
| Total de casos de teste | 22 |
| Cobertura de User Stories | US01, US02, US03, US04, US05 (100%) |
| Cobertura de Requisitos Funcionais | RF01, RF02, RF03, RF04, RF07 (100%) |
| Cobertura de Regras de Negocio | RN01, RN02, RN04, RN05, RN06 (100%) |
| Cobertura de Criterios de Aceite Globais | CAG01, CAG02, CAG04, CAG05 (100%) |
| Cenarios positivos | 6 (TC-OPT-001, TC-OPT-006, TC-OPT-009, TC-OPT-014, TC-OPT-017, TC-OPT-020) |
| Cenarios negativos | 15 (TC-OPT-002 a TC-OPT-005, TC-OPT-007, TC-OPT-008, TC-OPT-010 a TC-OPT-012, TC-OPT-015, TC-OPT-016, TC-OPT-018, TC-OPT-019, TC-OPT-021, TC-OPT-022) |
| Cenarios end-to-end | 1 (TC-OPT-013) |

---

## Matriz de Rastreabilidade Complementar

| Requisito / Regra | Casos de Teste Otimizados |
|:---|:---|
| RF05 | TC-OPT-023, TC-OPT-024 |
| RF06 | TC-OPT-023, TC-OPT-024 |
| RF08 | TC-OPT-025, TC-OPT-027 |
| RF09 | TC-OPT-026, TC-OPT-027 |
| RN02 | TC-OPT-024 |
| RN03 | TC-OPT-025, TC-OPT-027 |
| CAG01 | TC-OPT-023, TC-OPT-024, TC-OPT-025, TC-OPT-026, TC-OPT-027 |
| CAG02 | TC-OPT-024, TC-OPT-025, TC-OPT-026, TC-OPT-027 |
| CAG03 | TC-OPT-024 |

---
