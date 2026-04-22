# Requisitos do Sistema

## 1. Requisitos Funcionais (RF)

**RF01 — Cadastro de Usuários**  
O sistema deve permitir a criação de novos usuários, validando a unicidade do e-mail.

**RF02 — Autenticação**  
O sistema deve permitir o login de usuários cadastrados e retornar um token JWT.

**RF03 — Criação de Pedido**  
Um usuário autenticado deve conseguir registrar um novo pedido enviando uma lista de itens.

**RF04 — Cálculo de Valor**  
O sistema deve calcular o valor total automaticamente, multiplicando a quantidade pelo preço unitário de cada item.

**RF05 — Máquina de Estados**  
O sistema deve controlar o fluxo de status do pedido, impedindo transições ilegais.

**RF06 — Isolamento de Dados**  
Um usuário só pode visualizar ou interagir com pedidos vinculados ao seu próprio ID.

**RF07 — Cancelamento**  
O sistema deve permitir o cancelamento de pedidos, respeitando as regras de progresso do fluxo.

---

## 2. Requisitos Não Funcionais (RNF)

**RNF01 — Autenticação**  
Uso de JWT (JSON Web Token) no cabeçalho das requisições:
`Authorization: Bearer <token>`

**RNF02 — Persistência**  
Os dados serão armazenados em memória (arrays), sem necessidade de banco de dados externo.

**RNF03 — Documentação**  
A API deve expor uma interface Swagger (OpenAPI 3.0).

**RNF04 — Padronização HTTP**  
As respostas devem utilizar os status codes adequados, como:

- `201 Created`
- `204 No Content`
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
