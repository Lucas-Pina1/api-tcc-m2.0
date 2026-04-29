# Condições de Teste

**Projeto:** FinControl Flow  
**Versão:** 1.0  
**Escopo:** Épico 01 - Gestão de Identidade e Acesso (US01, US02)  
**Autor:** QA Team  
**Data:** 2026-04-26  
**Referência:** ISO/IEC 29119-3

---

## 1. US01 - Cadastro de Novo Usuário

| ID | Descrição | Prioridade | Rastreabilidade |
|:---|:---|:---|:---|
| CT-US01-001 | Verificar que o sistema permite o cadastro de um novo usuário quando informados nome, e-mail válido e senha válida. | Alta | RF01, US01-CA01 |
| CT-US01-002 | Verificar que o sistema impede o cadastro quando o e-mail informado já está registrado na base de dados. | Alta | RF01, RN01, US01-CA02 |
| CT-US01-003 | Verificar que o sistema rejeita o cadastro quando o campo "name" não é informado ou está vazio. | Alta | RF01, CAG05 |
| CT-US01-004 | Verificar que o sistema rejeita o cadastro quando o campo "email" não é informado ou está vazio. | Alta | RF01, CAG05 |
| CT-US01-005 | Verificar que o sistema rejeita o cadastro quando o campo "password" não é informado. | Alta | RF01, CAG05 |
| CT-US01-006 | Verificar que o sistema rejeita o cadastro quando nenhum campo obrigatório é preenchido (corpo da requisição vazio). | Alta | RF01, CAG05 |
| CT-US01-007 | Verificar que o sistema rejeita o cadastro quando o e-mail possui formato inválido (ex: "email-sem-arroba"). | Alta | RF01, CAG05 |
| CT-US01-008 | Verificar que o sistema rejeita o cadastro quando a senha possui menos de 6 caracteres. | Média | RF01, CAG05 |
| CT-US01-009 | Verificar que o sistema armazena o e-mail em formato normalizado (lowercase), garantindo que "LUCAS@EMAIL.COM" é tratado como duplicidade de "lucas@email.com". | Média | RN01 |
| CT-US01-010 | Verificar que a resposta de cadastro bem-sucedido NÃO retorna o campo "password" do usuário. | Alta | CAG02 |
| CT-US01-011 | Verificar que a resposta de cadastro bem-sucedido retorna o status HTTP 201 (Created). | Alta | CAG01 |
| CT-US01-012 | Verificar que a resposta de e-mail duplicado retorna o status HTTP 409 (Conflict). | Alta | CAG01, RN01 |
| CT-US01-013 | Verificar que as respostas de erro de validação retornam o status HTTP 400 (Bad Request). | Alta | CAG01, CAG05 |
| CT-US01-014 | Verificar que a resposta de cadastro bem-sucedido contém um ID único (UUID) atribuído ao usuário. | Média | RF01 |
| CT-US01-015 | Verificar que a resposta de cadastro bem-sucedido contém o campo "role" com valor "user". | Média | RF01 |
| CT-US01-016 | Verificar que todas as respostas seguem o padrão estrutural definido: campos "success", "message" e "data" ou "details". | Alta | CAG01 |

---

## 2. US02 - Autenticação de Usuário

| ID | Descrição | Prioridade | Rastreabilidade |
|:---|:---|:---|:---|
| CT-US02-001 | Verificar que o sistema autentica o usuário e retorna um token JWT quando informados e-mail e senha corretos. | Alta | RF02, US02-CA01 |
| CT-US02-002 | Verificar que o sistema rejeita a autenticação quando o e-mail informado não está cadastrado. | Alta | RF02, US02-CA02 |
| CT-US02-003 | Verificar que o sistema rejeita a autenticação quando a senha informada está incorreta. | Alta | RF02, US02-CA02 |
| CT-US02-004 | Verificar que o sistema rejeita a autenticação quando o campo "email" não é informado. | Alta | RF02, CAG05 |
| CT-US02-005 | Verificar que o sistema rejeita a autenticação quando o campo "password" não é informado. | Alta | RF02, CAG05 |
| CT-US02-006 | Verificar que o sistema rejeita a autenticação quando nenhum campo é informado (corpo da requisição vazio). | Alta | RF02, CAG05 |
| CT-US02-007 | Verificar que a mensagem de erro de credenciais inválidas é genérica ("E-mail ou senha incorretos"), sem indicar qual campo está errado, para prevenir enumeração de usuários. | Alta | CAG02 |
| CT-US02-008 | Verificar que o token JWT retornado contém as claims esperadas: "id", "email" e "role". | Alta | RF02, CAG02 |
| CT-US02-009 | Verificar que a resposta de login bem-sucedido NÃO retorna o campo "password" do usuário. | Alta | CAG02 |
| CT-US02-010 | Verificar que a resposta de login bem-sucedido retorna o status HTTP 200 (OK). | Alta | CAG01 |
| CT-US02-011 | Verificar que a resposta de credenciais inválidas retorna o status HTTP 401 (Unauthorized). | Alta | CAG01 |
| CT-US02-012 | Verificar que a resposta de campos ausentes retorna o status HTTP 400 (Bad Request). | Alta | CAG01 |
| CT-US02-013 | Verificar que o token JWT possui tempo de expiração configurado. | Média | RF02, CAG02 |
| CT-US02-014 | Verificar que uma rota protegida permite acesso quando o token JWT válido é enviado no header Authorization. | Alta | RF02, CAG02 |
| CT-US02-015 | Verificar que uma rota protegida rejeita o acesso quando nenhum token é fornecido no header Authorization. | Alta | RF02, CAG02 |
| CT-US02-016 | Verificar que uma rota protegida rejeita o acesso quando o token fornecido possui formato inválido (sem prefixo "Bearer"). | Alta | RF02, CAG02 |
| CT-US02-017 | Verificar que uma rota protegida rejeita o acesso quando o token fornecido está expirado. | Alta | RF02, CAG02 |
| CT-US02-018 | Verificar que uma rota protegida rejeita o acesso quando o token fornecido possui assinatura inválida (adulterado). | Alta | RF02, CAG02 |
| CT-US02-019 | Verificar que todas as respostas seguem o padrão estrutural definido: campos "success" e "message". | Alta | CAG01 |

---

## 3. US03 - Registro de Movimentação

| ID | Descrição | Prioridade | Rastreabilidade |
|:---|:---|:---|:---|
| CT-US03-001 | Verificar que o sistema cria uma movimentação financeira com sucesso quando todos os campos obrigatórios e válidos são informados. | Alta | RF03, US03-CA01, US03-CA02 |
| CT-US03-002 | Verificar que o sistema rejeita a criação quando o valor informado é igual a zero. | Alta | RF03, RN04, US03-CA01, CAG05 |
| CT-US03-003 | Verificar que o sistema rejeita a criação quando o valor informado é negativo. | Alta | RF03, RN04, US03-CA01, CAG05 |
| CT-US03-004 | Verificar que o sistema rejeita a criação quando o campo "description" não é informado ou está vazio. | Alta | RF03, US03-CA02, CAG05 |
| CT-US03-005 | Verificar que o sistema rejeita a criação quando o campo "amount" (valor) não é informado. | Alta | RF03, US03-CA02, CAG05 |
| CT-US03-006 | Verificar que o sistema rejeita a criação quando o campo "date" (data) não é informado. | Alta | RF03, US03-CA02, CAG05 |
| CT-US03-007 | Verificar que o sistema rejeita a criação quando o campo "type" (categoria) não é informado. | Alta | RF03, US03-CA02, CAG05 |
| CT-US03-008 | Verificar que o sistema rejeita a criação quando o campo "status" (status inicial) não é informado. | Alta | RF03, US03-CA02, CAG05 |
| CT-US03-009 | Verificar que o sistema rejeita a criação quando o campo "type" (categoria) recebe um valor inválido (diferente de "receita" ou "despesa"). | Alta | RF03, CAG05 |
| CT-US03-010 | Verificar que o sistema rejeita a criação quando o campo "status" recebe um valor inválido (diferente de "pendente" ou "pago"). | Alta | RF03, CAG05 |
| CT-US03-011 | Verificar que o sistema vincula automaticamente a movimentação criada ao usuário autenticado através do token JWT fornecido. | Alta | RF03, CAG02 |
| CT-US03-012 | Verificar que a resposta de criação bem-sucedida retorna o status HTTP 201 (Created). | Alta | CAG01 |

---

## 4. US04 - Efetivação de Pagamento

| ID | Descrição | Prioridade | Rastreabilidade |
|:---|:---|:---|:---|
| CT-US04-001 | Verificar que o sistema altera o status de "Pendente" para "Pago" com sucesso quando solicitado pelo proprietário da movimentação. | Alta | RF04, US04-CA01 |
| CT-US04-002 | Verificar que o sistema impede a alteração de status de "Pago" para "Pendente", retornando erro de regra de negócio. | Alta | RF04, RN05, US04-CA02 |
| CT-US04-003 | Verificar que o sistema impede a alteração de status quando a movimentação já possui o status "Pago". | Média | RF04, RN05, US04-CA02 |
| CT-US04-004 | Verificar que o sistema impede a alteração do status de uma movimentação pertencente a outro usuário, mesmo informando um ID válido. | Alta | RN02, CAG02 |
| CT-US04-005 | Verificar que o sistema retorna erro HTTP 404 (Not Found) ao tentar alterar o status de uma movimentação inexistente. | Média | CAG01 |
| CT-US04-006 | Verificar que a alteração de status bem-sucedida atualiza a data de modificação do registro. | Baixa | US04-CA01 |
| CT-US04-007 | Verificar que a alteração bem-sucedida retorna o status HTTP 200 (OK) com os dados atualizados. | Alta | CAG01 |

---

## 5. US05 - Exclusão de Movimentação

| ID | Descrição | Prioridade | Rastreabilidade |
|:---|:---|:---|:---|
| CT-US05-001 | Verificar que o sistema exclui uma movimentação com sucesso quando seu status é "Pendente" e a requisição parte do proprietário. | Alta | RF07, US05-CA01 |
| CT-US05-002 | Verificar que o sistema impede a exclusão de uma movimentação quando seu status é "Pago". | Alta | RF07, RN06, US05-CA02, CAG04 |
| CT-US05-003 | Verificar que o sistema impede a exclusão de uma movimentação pertencente a outro usuário. | Alta | RN02, CAG02 |
| CT-US05-004 | Verificar que o sistema retorna erro HTTP 404 (Not Found) ao tentar excluir uma movimentação inexistente. | Média | CAG01 |
| CT-US05-005 | Verificar que a exclusão bem-sucedida retorna o status HTTP apropriado. | Alta | CAG01 |

---

## Matriz de Rastreabilidade Resumida

| Requisito / Regra | Condições de Teste Associadas |
|:---|:---|
| RF01 | CT-US01-001 a CT-US01-016 |
| RF02 | CT-US02-001 a CT-US02-019 |
| RF03 | CT-US03-001 a CT-US03-012 |
| RF04 | CT-US04-001 a CT-US04-007 |
| RF07 | CT-US05-001 a CT-US05-005 |
| RN01 | CT-US01-002, CT-US01-009, CT-US01-012 |
| RN02 | CT-US04-004, CT-US05-003 |
| RN04 | CT-US03-002, CT-US03-003 |
| RN05 | CT-US04-002, CT-US04-003 |
| RN06 | CT-US05-002 |
| CAG01 | CT-US01-011 a CT-US01-013, CT-US01-016, CT-US02-010 a CT-US02-012, CT-US02-019, CT-US03-012, CT-US04-005, CT-US04-007, CT-US05-004, CT-US05-005 |
| CAG02 | CT-US01-010, CT-US02-007 a CT-US02-009, CT-US02-014 a CT-US02-018, CT-US03-011, CT-US04-004, CT-US05-003 |
| CAG04 | CT-US05-002 |
| CAG05 | CT-US01-003 a CT-US01-008, CT-US02-004 a CT-US02-006, CT-US03-002 a CT-US03-010 |
