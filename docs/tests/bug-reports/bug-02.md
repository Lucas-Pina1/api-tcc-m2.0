# Validação de valor monetário inválido retorna código HTTP divergente do contrato de erro

## ID
BUG-002

## Severidade
Média

## Prioridade
Alta

## Ambiente
QA

## Descrição
Ao tentar registrar uma movimentação com valor igual a zero ou negativo, a API rejeita a operação com `422 Unprocessable Entity`. Entretanto, os artefatos de teste e os critérios globais de padronização HTTP definem `400 Bad Request` para erros de validação de entrada nesse cenário.

## Pré-condições
- API disponível no ambiente de QA.
- Usuário autenticado com token JWT válido.
- Massa de teste preparada para criação de movimentações.

## Passos para Reprodução
1. Autenticar com um usuário válido e obter um token JWT.
2. Enviar uma requisição `POST /api/transactions` com o header `Authorization: Bearer <token_valido>`.
3. Informar um payload válido em todos os campos, exceto no valor monetário, por exemplo: `{"description":"Conta de teste","value":0,"date":"2026-05-05","category":"despesa","status":"pendente"}`.
4. Repetir a operação com valor negativo, por exemplo: `{"description":"Conta de teste","value":-50.00,"date":"2026-05-05","category":"despesa","status":"pendente"}`.
5. Verificar o status code retornado nas duas tentativas.

## Resultado Esperado
O sistema deve rejeitar a requisição com `400 Bad Request`, mantendo aderência a CAG01, CAG05, CT-US03-002, CT-US03-003 e TC-OPT-015.

## Resultado Obtido
O sistema rejeita corretamente a regra de negócio, porém retorna `422 Unprocessable Entity` em vez de `400 Bad Request`.

## Evidências
- Mensagem funcional retornada: `O valor da movimentação deve ser maior que zero (RN04).`
- Divergência de status code em relação ao contrato de teste documentado para cenários de validação de entrada.

## Impacto
O defeito compromete a consistência do contrato HTTP da API, podendo quebrar validações automatizadas, tratamento de erro no front-end e integrações que dependem do código `400` para exibir mensagens de validação ao usuário final.

## Observações
- Rastreabilidade: RF03, RN04, CAG01, CAG05, CT-US03-002, CT-US03-003, TC-OPT-015.
- O comportamento funcional está parcialmente correto, porém o protocolo de resposta está fora do padrão acordado.
