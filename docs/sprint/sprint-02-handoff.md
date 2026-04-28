# Sprint 02 - Handoff

## Resumo
Nesta sprint, o foco foi a implementação do **Épico 02 - Gestão de Movimentações Financeiras**, estendendo as capacidades da API para incluir o registro, pagamento e exclusão de receitas e despesas. As implementações seguem rigorosamente a arquitetura MVC definida na Sprint 01 e a camada de persistência em memória (array) projetada para fácil substituição futura por um ORM.

## Novas funcionalidades
- **Registro de movimentações (US03)**:
  - `POST /api/transactions`
  - Permite a criação de receitas e despesas.
  - Valida regras como valor positivo e formato correto de datas.
- **Efetivação de pagamento (US04)**:
  - `PATCH /api/transactions/:id/pay`
  - Altera o status de uma movimentação de "pendente" para "pago".
  - Implementa fluxo unidirecional (movimentações pagas não retornam a pendente).
- **Exclusão de movimentação (US05)**:
  - `DELETE /api/transactions/:id`
  - Remove uma movimentação do sistema.
  - Impede a exclusão de registros já marcados como "pago".

## Alterações realizadas
- **`src/app.js`**: Adicionada a importação e o roteamento para `/api/transactions`.
- **`docs/swagger.js`**:
  - Inclusão do Schema `Transaction`.
  - Documentação atualizada lendo de `./src/routes/*.js`.

## Decisões técnicas
- **Arquitetura (Controller -> Service -> Model)**: O padrão estabelecido pela entidade `User` (Sprint 01) foi totalmente replicado para `Transaction`. Os Models geram seus próprios UUIDs e a camada Service aplica a regra de negócio e lança `AppError`.
- **Isolamento e Segurança (RN02)**: Todas as rotas de `transactions` são restritas por `authMiddleware`. Os *endpoints* que operam sob uma transação específica checam se ela pertence ao `userId` extraído do token JWT.
- **Modelagem do Status (RN05 e RN06)**: As checagens de regras relativas ao status (`pendente`/`pago`) foram isoladas em `transactionService.js` para garantir centralização e proteção das entidades.

## Como continuar o projeto
- **Épico 03 (Consultas e Dashboard)**: A base de dados em memória (`transactionModel`) já tem a função `findByUserId` para facilitar a listagem. A próxima sprint deve focar na extração do extrato (US06) listando essas transações e possivelmente no balanço consolidado (US07).
- Recomenda-se começar criando um endpoint `GET /api/transactions` para listar os registros do usuário autenticado antes de prosseguir com agregações financeiras.
