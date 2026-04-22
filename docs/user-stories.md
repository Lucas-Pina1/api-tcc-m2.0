# User Stories

## US01 — Cadastro de Novo Usuário (RF01)

**Como** um visitante do sistema,  
**Quero** criar uma conta com nome, e-mail e senha,  
**Para que** eu possa acessar os serviços de pedidos.

### Critérios de Aceite
- O e-mail deve ser único; se já existir, a API deve retornar `400 Bad Request`.
- A senha deve possuir no mínimo 6 caracteres.
- Todos os campos (`nome`, `email`, `password`) são obrigatórios.
- Ao criar com sucesso, deve retornar `201 Created`.

---

## US02 — Login e Autenticação (RF02, RNF01)

**Como** um cliente cadastrado,  
**Quero** realizar autenticação com e-mail e senha,  
**Para que** eu obtenha um token de acesso para realizar operações protegidas.

### Critérios de Aceite
- Credenciais corretas devem retornar `200 OK` e um token JWT.
- Credenciais inválidas devem retornar `401 Unauthorized`.
- O token deve conter o ID do usuário para identificar a propriedade dos pedidos futuros.

---

## US03 — Registro de Pedido com Cálculo Automático (RF03, RF04)

**Como** um usuário autenticado,  
**Quero** enviar uma lista de itens para criar um pedido,  
**Para que** o sistema registre minha compra e calcule o valor total automaticamente.

### Critérios de Aceite
- É obrigatório o envio de pelo menos um item no array de itens.
- Cada item deve conter:
  - `produto`
  - `quantidade` (inteiro > 0)
  - `precoUnitario` (decimal > 0)
- O sistema deve calcular o `valorTotal` (soma de: `quantidade * precoUnitario`).
- O status inicial do pedido deve ser obrigatoriamente `CRIADO`.
- A tentativa de criar um pedido sem token JWT válido deve retornar `401 Unauthorized`.

---

## US04 — Consulta de Pedidos e Privacidade (RF06)

**Como** um usuário autenticado,  
**Quero** listar meus pedidos ou buscar um pedido específico por ID,  
**Para que** eu possa acompanhar minhas compras com privacidade.

### Critérios de Aceite
- A listagem (`GET /orders`) deve retornar apenas pedidos do usuário logado.
- Ao buscar por ID (`GET /orders/:id`):
  - Se o pedido pertencer a outro usuário, a API deve retornar `403 Forbidden` ou `404 Not Found`.
- Se o usuário não tiver pedidos, deve retornar uma lista vazia `[]` com status `200 OK`.

---

## US05 — Atualização de Status (RF05)

**Como** um sistema/operador,  
**Quero** atualizar o progresso do pedido,  
**Para que** o fluxo de entrega seja respeitado.

### Critérios de Aceite
- As transições permitidas são:
  - `CRIADO` → `PAGO` → `EM_PREPARO` → `ENVIADO` → `ENTREGUE`
- Não é permitido pular etapas ou retroceder o status.
- Qualquer violação da regra de transição deve retornar `400 Bad Request` com uma mensagem explicativa.

---

## US06 — Cancelamento de Pedido (RF07)

**Como** um cliente autenticado,  
**Quero** cancelar um pedido ainda não enviado,  
**Para que** eu possa desistir da compra.

### Critérios de Aceite
- O cancelamento só é permitido se o status atual for:
  - `CRIADO` ou `PAGO`
- Se o status for `EM_PREPARO` ou superior, o cancelamento deve ser bloqueado com `400 Bad Request`.
- Um pedido cancelado assume o status `CANCELADO` e não pode mais ser alterado.