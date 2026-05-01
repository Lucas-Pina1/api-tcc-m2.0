# Login falha quando o e-mail é informado com espaços em branco nas extremidades

## ID
BUG-003

## Severidade
Média

## Prioridade
Média

## Ambiente
QA

## Descrição
O processo de autenticação não trata e-mails com espaços em branco no início ou no final do campo durante o login. Em cenários de cópia e cola, o usuário informa credenciais válidas, porém o sistema rejeita a autenticação como se os dados estivessem incorretos.

## Pré-condições
- API disponível no ambiente de QA.
- Usuário previamente cadastrado com o e-mail `login.teste@email.com` e senha válida.
- Token não é necessário para execução do fluxo.

## Passos para Reprodução
1. Garantir que exista um usuário ativo cadastrado com o e-mail `login.teste@email.com` e senha `senha123`.
2. Enviar uma requisição `POST /api/auth/login` com o corpo `{"email":" login.teste@email.com ","password":"senha123"}`.
3. Verificar o status code e a mensagem retornada pela API.
4. Repetir a operação enviando o mesmo e-mail sem espaços para comparação de comportamento.

## Resultado Esperado
O sistema deve normalizar o e-mail informado no login, ignorando espaços acidentais nas extremidades, e autenticar o usuário com sucesso quando as credenciais forem válidas.

## Resultado Obtido
Quando o e-mail contém espaços nas extremidades, a API retorna `401 Unauthorized` com a mensagem `E-mail ou senha incorretos.`. Ao remover os espaços, o login é realizado com sucesso.

## Evidências
- Mensagem retornada no cenário com espaços: `E-mail ou senha incorretos.`
- Diferença de comportamento entre a mesma credencial com e sem espaços em branco nas extremidades.

## Impacto
O defeito gera falhas de autenticação em um fluxo crítico de acesso, aumentando chamados de suporte e a percepção de instabilidade do sistema. O problema é especialmente sensível em interfaces web e mobile, onde cópia e cola de credenciais é comum.

## Observações
- Rastreabilidade: RF02, US02-CA01, CAG05.
- Embora o sistema valide o formato no cadastro, a normalização não é aplicada de forma consistente no fluxo de autenticação.
