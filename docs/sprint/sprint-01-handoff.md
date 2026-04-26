# Sprint 01 — Handoff para o Próximo Desenvolvedor

## O que foi implementado

Esta sprint cobriu o **Épico 01 — Gestão de Identidade e Acesso**, contemplando duas user stories:

| User Story | Descrição | Endpoint |
|:---|:---|:---|
| **US01** | Cadastro de novo usuário | `POST /api/auth/register` |
| **US02** | Autenticação de usuário (login) | `POST /api/auth/login` |

Além disso, foi criado o endpoint `GET /api/auth/profile` como suporte para validar que o token JWT está funcionando corretamente em rotas protegidas.

---

## Arquitetura do Projeto

O projeto segue a arquitetura **MVC + Service Layer**:

```
src/
├── config/          → Configurações (JWT secret, expiração)
├── controllers/     → Recebe HTTP request, delega ao service, retorna response
├── docs/            → Configuração Swagger/OpenAPI
├── middlewares/     → Auth (JWT), error handler global
├── models/          → Repositório in-memory (array JS)
├── routes/          → Definição de rotas + anotações Swagger
├── services/        → Regras de negócio (validação, hash, geração de token)
├── utils/           → AppError (erro customizado) e responseHelper (respostas padronizadas)
└── app.js           → Bootstrap do Express
```

### Fluxo de uma requisição

```
Request → Route → [Middleware(s)] → Controller → Service → Model
                                                    ↓
Response ← Controller ← Service ← Model (dados retornados)
```

- **Controllers** NÃO contêm regra de negócio — apenas orquestram HTTP.
- **Services** concentram toda a lógica: validação de e-mail, hash de senha, geração de JWT.
- **Models** expõem uma interface simples (`findByEmail`, `findById`, `create`) que pode ser trocada por um ORM no futuro sem alterar o service.

---

## Requisitos Funcionais e Regras de Negócio Implementados

| ID | Descrição | Status |
|:---|:---|:---|
| RF01 | Cadastro de usuários (e-mail + senha) | ✅ Implementado |
| RF02 | Autenticação com validação de credenciais | ✅ Implementado |
| RN01 | E-mail único (impede cadastro duplicado) | ✅ Implementado |
| CAG01 | Uso correto de verbos e status HTTP | ✅ Implementado |
| CAG02 | Dados financeiros nunca expostos a terceiros | ✅ Respeitado |
| CAG05 | Validação de entrada de dados | ✅ Implementado |

---

## Tecnologias Utilizadas

| Pacote | Finalidade |
|:---|:---|
| `express` | Framework HTTP |
| `jsonwebtoken` | Geração e verificação de tokens JWT |
| `bcryptjs` | Hash de senhas (10 salt rounds) |
| `uuid` | Geração de IDs únicos (UUID v4) |
| `dotenv` | Variáveis de ambiente |
| `swagger-jsdoc` + `swagger-ui-express` | Documentação interativa OpenAPI |

---

## Como Rodar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# O arquivo .env já existe na raiz com valores padrão:
#   PORT=3000
#   JWT_SECRET=fincontrol_flow_super_secret_key_2026
#   JWT_EXPIRES_IN=1h

# 3. Iniciar em modo desenvolvimento (hot reload)
npm run dev

# 4. Acessar
# API:      http://localhost:3000
# Swagger:  http://localhost:3000/api-docs
# Health:   http://localhost:3000/api/health
```

---

## Padrão de Respostas da API

Toda resposta segue este contrato:

**Sucesso:**
```json
{
  "success": true,
  "message": "Descrição da operação.",
  "data": { }
}
```

**Erro:**
```json
{
  "success": false,
  "message": "Descrição clara do erro.",
  "details": { }
}
```

---

## O que NÃO foi implementado (próximas sprints)

Estes itens estão documentados em `docs/requirements.md` e `docs/user-stories.md` e devem ser implementados nas próximas sprints:

| Épico | User Story | Descrição |
|:---|:---|:---|
| Épico 02 | US03 | Registro de movimentação financeira (receita/despesa) |
| Épico 02 | US04 | Efetivação de pagamento (Pendente → Pago) |
| Épico 02 | US05 | Exclusão de movimentação |
| Épico 03 | US06 | Visualização de saldo e extrato |
| Épico 04 | US07 | Gestão de contas pelo administrador |

### Dicas para continuar

1. **Criar `src/models/transactionModel.js`** — Seguir o mesmo padrão do `userModel.js` (array in-memory + funções exportadas).
2. **Criar `src/services/transactionService.js`** — Toda regra de negócio (RN02 a RN06) deve ficar aqui.
3. **Rota protegida** — Usar `authMiddleware` nas rotas de transação. O middleware já injeta `req.userId` e `req.userRole` no request.
4. **Isolamento de dados (RN02)** — Filtrar transações sempre por `userId` no service. Nunca retornar dados de outro usuário.
5. **Swagger** — Adicionar as anotações JSDoc nas novas rotas seguindo o padrão de `authRoutes.js`. A documentação se atualiza automaticamente.
6. **Erros** — Usar `throw new AppError('mensagem', statusCode)` nos services. O `errorHandler` global já trata tudo.

---

## Persistência

> **A aplicação usa persistência em memória.** Todos os dados são perdidos ao reiniciar o servidor. Isso é intencional para este estágio do projeto.

Se no futuro for adicionado um banco de dados, basta trocar os métodos do Model sem alterar services ou controllers.
