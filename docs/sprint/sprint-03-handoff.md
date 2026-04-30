# Sprint 03 - Handoff

## Resumo
Esta sprint concluiu a continuidade planejada da **US06** e da **US07**, entregando consulta de extrato com saldo consolidado e ferramentas administrativas de listagem e remocao de contas, sem romper o padrao MVC + Service Layer e mantendo a persistencia em memoria.

## O que foi implementado
- **US06 - Visualizacao de Saldo e Extrato**
  - `GET /api/transactions`
  - Retorna apenas as movimentacoes do usuario autenticado em ordem cronologica.
  - Calcula o saldo consolidado usando a formula `(receitas - despesas)`.
- **US07 - Gestao de Contas por Administrador**
  - `GET /api/admin/users`
  - `DELETE /api/admin/users/:id`
  - Permite listagem de usuarios e banimento de contas por perfil administrador.

## O que foi alterado
- **Controle de acesso**
  - As rotas financeiras agora bloqueiam explicitamente o perfil `admin`, atendendo a `RN03`.
  - O `authMiddleware` passou a validar se o usuario do token ainda existe no repositorio in-memory, invalidando acesso apos banimento.
- **Persistencia em memoria**
  - O repositorio de usuarios passou a manter um administrador padrao em memoria para viabilizar autenticacao administrativa sem banco de dados.
  - A remocao administrativa de conta tambem apaga as movimentacoes do usuario removido.

## Decisoes importantes
- O endpoint de extrato foi incorporado em `GET /api/transactions` para reaproveitar o contexto funcional ja aberto pela Sprint 02 e evitar fragmentacao desnecessaria da API.
- A exclusao administrativa remove a conta e seus lancamentos em memoria, mas nao expoe dados financeiros ao administrador em nenhum momento.
- O usuario administrador padrao fica disponivel com e-mail `admin@fincontrol.local` apenas para viabilizar a operacao da US07 neste estagio sem banco de dados.

## Como continuar
- Proximas evolucoes devem preservar a separacao entre gestao administrativa de contas e acesso financeiro do usuario final.
- Se houver futura persistencia em banco, o primeiro ponto de troca natural e a camada de `models`, mantendo services e controllers estaveis.
