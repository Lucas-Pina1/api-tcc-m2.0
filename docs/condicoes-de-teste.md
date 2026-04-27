# Condicoes de Teste

**Projeto:** FinControl Flow  
**Versao:** 1.0  
**Escopo:** Epico 01 - Gestao de Identidade e Acesso (US01, US02)  
**Autor:** QA Team  
**Data:** 2026-04-26  
**Referencia:** ISO/IEC 29119-3

---

## 1. US01 - Cadastro de Novo Usuario

| ID | Descricao | Prioridade | Rastreabilidade |
|:---|:---|:---|:---|
| CT-US01-001 | Verificar que o sistema permite o cadastro de um novo usuario quando informados nome, e-mail valido e senha valida. | Alta | RF01, US01-CA01 |
| CT-US01-002 | Verificar que o sistema impede o cadastro quando o e-mail informado ja esta registrado na base de dados. | Alta | RF01, RN01, US01-CA02 |
| CT-US01-003 | Verificar que o sistema rejeita o cadastro quando o campo "name" nao e informado ou esta vazio. | Alta | RF01, CAG05 |
| CT-US01-004 | Verificar que o sistema rejeita o cadastro quando o campo "email" nao e informado ou esta vazio. | Alta | RF01, CAG05 |
| CT-US01-005 | Verificar que o sistema rejeita o cadastro quando o campo "password" nao e informado. | Alta | RF01, CAG05 |
| CT-US01-006 | Verificar que o sistema rejeita o cadastro quando nenhum campo obrigatorio e preenchido (corpo da requisicao vazio). | Alta | RF01, CAG05 |
| CT-US01-007 | Verificar que o sistema rejeita o cadastro quando o e-mail possui formato invalido (ex: "email-sem-arroba"). | Alta | RF01, CAG05 |
| CT-US01-008 | Verificar que o sistema rejeita o cadastro quando a senha possui menos de 6 caracteres. | Media | RF01, CAG05 |
| CT-US01-009 | Verificar que o sistema armazena o e-mail em formato normalizado (lowercase), garantindo que "LUCAS@EMAIL.COM" e tratado como duplicidade de "lucas@email.com". | Media | RN01 |
| CT-US01-010 | Verificar que a resposta de cadastro bem-sucedido NAO retorna o campo "password" do usuario. | Alta | CAG02 |
| CT-US01-011 | Verificar que a resposta de cadastro bem-sucedido retorna o status HTTP 201 (Created). | Alta | CAG01 |
| CT-US01-012 | Verificar que a resposta de e-mail duplicado retorna o status HTTP 409 (Conflict). | Alta | CAG01, RN01 |
| CT-US01-013 | Verificar que as respostas de erro de validacao retornam o status HTTP 400 (Bad Request). | Alta | CAG01, CAG05 |
| CT-US01-014 | Verificar que a resposta de cadastro bem-sucedido contem um ID unico (UUID) atribuido ao usuario. | Media | RF01 |
| CT-US01-015 | Verificar que a resposta de cadastro bem-sucedido contem o campo "role" com valor "user". | Media | RF01 |
| CT-US01-016 | Verificar que todas as respostas seguem o padrao estrutural definido: campos "success", "message" e "data" ou "details". | Alta | CAG01 |

---

## 2. US02 - Autenticacao de Usuario

| ID | Descricao | Prioridade | Rastreabilidade |
|:---|:---|:---|:---|
| CT-US02-001 | Verificar que o sistema autentica o usuario e retorna um token JWT quando informados e-mail e senha corretos. | Alta | RF02, US02-CA01 |
| CT-US02-002 | Verificar que o sistema rejeita a autenticacao quando o e-mail informado nao esta cadastrado. | Alta | RF02, US02-CA02 |
| CT-US02-003 | Verificar que o sistema rejeita a autenticacao quando a senha informada esta incorreta. | Alta | RF02, US02-CA02 |
| CT-US02-004 | Verificar que o sistema rejeita a autenticacao quando o campo "email" nao e informado. | Alta | RF02, CAG05 |
| CT-US02-005 | Verificar que o sistema rejeita a autenticacao quando o campo "password" nao e informado. | Alta | RF02, CAG05 |
| CT-US02-006 | Verificar que o sistema rejeita a autenticacao quando nenhum campo e informado (corpo da requisicao vazio). | Alta | RF02, CAG05 |
| CT-US02-007 | Verificar que a mensagem de erro de credenciais invalidas e generica ("E-mail ou senha incorretos"), sem indicar qual campo esta errado, para prevenir enumeracao de usuarios. | Alta | CAG02 |
| CT-US02-008 | Verificar que o token JWT retornado contem as claims esperadas: "id", "email" e "role". | Alta | RF02, CAG02 |
| CT-US02-009 | Verificar que a resposta de login bem-sucedido NAO retorna o campo "password" do usuario. | Alta | CAG02 |
| CT-US02-010 | Verificar que a resposta de login bem-sucedido retorna o status HTTP 200 (OK). | Alta | CAG01 |
| CT-US02-011 | Verificar que a resposta de credenciais invalidas retorna o status HTTP 401 (Unauthorized). | Alta | CAG01 |
| CT-US02-012 | Verificar que a resposta de campos ausentes retorna o status HTTP 400 (Bad Request). | Alta | CAG01 |
| CT-US02-013 | Verificar que o token JWT possui tempo de expiracao configurado. | Media | RF02, CAG02 |
| CT-US02-014 | Verificar que uma rota protegida permite acesso quando o token JWT valido e enviado no header Authorization. | Alta | RF02, CAG02 |
| CT-US02-015 | Verificar que uma rota protegida rejeita o acesso quando nenhum token e fornecido no header Authorization. | Alta | RF02, CAG02 |
| CT-US02-016 | Verificar que uma rota protegida rejeita o acesso quando o token fornecido possui formato invalido (sem prefixo "Bearer"). | Alta | RF02, CAG02 |
| CT-US02-017 | Verificar que uma rota protegida rejeita o acesso quando o token fornecido esta expirado. | Alta | RF02, CAG02 |
| CT-US02-018 | Verificar que uma rota protegida rejeita o acesso quando o token fornecido possui assinatura invalida (adulterado). | Alta | RF02, CAG02 |
| CT-US02-019 | Verificar que todas as respostas seguem o padrao estrutural definido: campos "success" e "message". | Alta | CAG01 |

---

## Matriz de Rastreabilidade Resumida

| Requisito / Regra | Condicoes de Teste Associadas |
|:---|:---|
| RF01 | CT-US01-001 a CT-US01-016 |
| RF02 | CT-US02-001 a CT-US02-019 |
| RN01 | CT-US01-002, CT-US01-009, CT-US01-012 |
| CAG01 | CT-US01-011 a CT-US01-013, CT-US01-016, CT-US02-010 a CT-US02-012, CT-US02-019 |
| CAG02 | CT-US01-010, CT-US02-007 a CT-US02-009, CT-US02-014 a CT-US02-018 |
| CAG05 | CT-US01-003 a CT-US01-008, CT-US02-004 a CT-US02-006 |
