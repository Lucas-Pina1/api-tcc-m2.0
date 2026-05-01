# Cadastro de movimentação falha ao utilizar payload documentado com os campos `amount` e `type`

## ID
BUG-001

## Severidade
Alta

## Prioridade
Alta

## Ambiente
QA

## Descrição
O endpoint `POST /api/transactions` não aceita a estrutura de payload definida nos artefatos funcionais e de teste para a US03. Ao enviar a requisição com os campos `amount` e `type`, conforme documentado em `docs/requirements.md`, `docs/user-stories.md` e `docs/tests/casos-de-teste.md`, a API rejeita a operação como se campos obrigatórios estivessem ausentes.

## Pré-condições
- API disponível no ambiente de QA.
- Usuário autenticado com token JWT válido.
- Usuário sem bloqueios de permissão para registrar movimentações.

## Passos para Reprodução
1. Autenticar com um usuário válido e obter um token JWT.
2. Enviar uma requisição `POST /api/transactions` com o header `Authorization: Bearer <token_valido>`.
3. Informar o corpo da requisição com a estrutura documentada: `{"description":"Salario","amount":5000.00,"date":"2026-05-01","type":"receita","status":"pago"}`.
4. Observar o status code e a mensagem retornada pela API.

## Resultado Esperado
O sistema deve aceitar o payload documentado, registrar a movimentação com sucesso e retornar `201 Created`, em conformidade com RF03, US03-CA01, US03-CA02 e TC-OPT-014.

## Resultado Obtido
A API retorna erro `400 Bad Request`, informando que os campos obrigatórios `description`, `value`, `date`, `category` e `status` são obrigatórios, evidenciando que a implementação espera nomes de atributos diferentes dos especificados nos artefatos de negócio e teste.

## Evidências
- Divergência entre o contrato funcional documentado (`amount` e `type`) e a validação implementada pela API (`value` e `category`).
- Mensagem de erro retornada: `Todos os campos são obrigatórios (description, value, date, category, status).`

## Impacto
O defeito impede a execução do fluxo principal de registro de movimentações por consumidores que seguem o contrato oficial do produto. O problema afeta diretamente a integração entre front-end, documentação, automação de testes e API, gerando falhas no processo de lançamento de receitas e despesas.

## Observações
- Rastreabilidade: RF03, US03-CA01, US03-CA02, TC-OPT-014, TC-OPT-016.
- O defeito sugere incompatibilidade contratual entre camada de serviço e artefatos funcionais do projeto.
