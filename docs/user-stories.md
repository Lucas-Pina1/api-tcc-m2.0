# Planejamento de User Stories

## Epicos

| ID | Titulo | Descricao |
| :--- | :--- | :--- |
| **Epico 01** | Gestao de Identidade e Acesso | Responsavel por toda a jornada de entrada, identificacao e seguranca do usuario e do administrador na plataforma. |
| **Epico 02** | Gestao de Movimentacoes Financeiras | Abrange as funcionalidades de criacao, modificacao de estado e remocao de registros de receitas e despesas. |
| **Epico 03** | Painel de Resultados e Visibilidade | Focado na entrega de valor por meio da exibicao consolidada de lancamentos e calculos de saude financeira. |
| **Epico 04** | Administracao da Plataforma | Dedicado as ferramentas de governanca e controle de usuarios por parte do perfil administrador. |

---

## User Stories

### Epico 01: Gestao de Identidade e Acesso

#### US01 - Cadastro de Novo Usuario
> **Como** usuario comum,  
> **Quero** criar uma conta na plataforma utilizando e-mail e senha,  
> **Para que** eu possa iniciar o controle das minhas financas pessoais.

- **Criterio de Aceite 01 (Sucesso):** Dado que o usuario preenche um e-mail valido e nao cadastrado e uma senha, quando solicita o cadastro, entao o sistema confirma a criacao da conta e permite o acesso.
- **Criterio de Aceite 02 (E-mail duplicado):** Dado que o usuario tenta se cadastrar com um e-mail que ja existe na base, quando solicita o cadastro, entao o sistema impede a operacao e exibe uma mensagem de erro informando a duplicidade.

#### US02 - Autenticacao de Usuario
> **Como** usuario cadastrado,  
> **Quero** realizar o login no sistema,  
> **Para que** eu possa acessar meus dados financeiros com seguranca.

- **Criterio de Aceite 01 (Sucesso):** Dado que o usuario informa e-mail e senha corretos, quando solicita o acesso, entao o sistema redireciona para a tela principal de extrato.
- **Criterio de Aceite 02 (Dados Invalidos):** Dado que o usuario informa credenciais incorretas, quando solicita o acesso, entao o sistema nega a entrada e informa que os dados estao incorretos.

---

### Epico 02: Gestao de Movimentacoes Financeiras

#### US03 - Registro de Movimentacao
> **Como** usuario autenticado,  
> **Quero** registrar uma nova receita ou despesa,  
> **Para** manter meu historico financeiro atualizado.

- **Criterio de Aceite 01 (Validacao de Valor):** Dado que o usuario tenta registrar um valor menor ou igual a zero, quando confirma o registro, entao o sistema bloqueia a operacao e exige um valor positivo.
- **Criterio de Aceite 02 (Dados Obrigatorios):** Dado que o usuario deixa de preencher descricao, valor ou data, quando confirma o registro, entao o sistema impede a gravacao e destaca os campos obrigatorios.

#### US04 - Efetivacao de Pagamento
> **Como** usuario autenticado,  
> **Quero** marcar uma conta pendente como paga,  
> **Para que** o sistema reflita que aquela transacao foi concluida.

- **Criterio de Aceite 01 (Mudanca de Status):** Dado que existe uma movimentacao "Pendente", quando o usuario aciona o comando de pagar, entao o status e atualizado para "Pago".
- **Criterio de Aceite 02 (Impedimento de Retrocesso):** Dado que uma movimentacao ja possui o status "Pago", quando o usuario tenta alterar o status, entao o sistema nao oferece a opcao de retornar para "Pendente".

#### US05 - Exclusao de Movimentacao
> **Como** usuario autenticado,  
> **Quero** excluir um lancamento feito por erro,  
> **Para** corrigir falhas de preenchimento no meu extrato.

- **Criterio de Aceite 01 (Exclusao Permitida):** Dado que uma movimentacao esta com status "Pendente", quando o usuario solicita a exclusao, entao o sistema remove o registro e atualiza o saldo.
- **Criterio de Aceite 02 (Exclusao Negada):** Dado que uma movimentacao esta com status "Pago", quando o usuario tenta excluir o registro, entao o sistema impede a acao e informa que registros pagos nao podem ser removidos.

---

### Epico 03: Painel de Resultados e Visibilidade

**Objetivo de negocio:** permitir que o usuario acompanhe sua saude financeira atual com base apenas nos lancamentos do proprio historico.

#### US06 - Visualizacao de Saldo e Extrato
> **Como** usuario autenticado,  
> **Quero** visualizar a lista de meus lancamentos e o saldo final,  
> **Para** entender minha situacao financeira atual.

- **Valor de negocio:** aumenta a visibilidade do fluxo financeiro pessoal sem exigir calculos manuais fora da plataforma.
- **INVEST:** a historia e independente das operacoes de cadastro e login, negociavel quanto ao formato do retorno, valiosa por consolidar o extrato, estimavel por reaproveitar os lancamentos existentes, pequena para uma sprint e testavel por saldo calculado e isolamento de dados.
- **Criterio de Aceite 01 (Calculo do Saldo):** Dado que o usuario possui receitas e despesas lancadas, quando acessa a consulta principal, entao o sistema exibe o valor resultante da subtracao das despesas do total de receitas.
- **Criterio de Aceite 02 (Isolamento):** Dado que o Usuario A esta logado, quando visualiza o extrato, entao o sistema garante que nenhum dado do Usuario B seja exibido.

---

### Epico 04: Administracao da Plataforma

**Objetivo de negocio:** oferecer governanca minima da base de usuarios sem violar a privacidade financeira definida pelas regras da plataforma.

#### US07 - Gestao de Contas por Administrador
> **Como** administrador,  
> **Quero** visualizar a lista de usuarios e ter o poder de excluir contas,  
> **Para** manter a ordem e a seguranca da plataforma.

- **Valor de negocio:** permite acao administrativa sobre contas invalidas, inativas ou indevidas sem expor dados financeiros sensiveis.
- **INVEST:** a historia e independente do fluxo financeiro, negociavel no detalhamento dos dados cadastrais retornados, valiosa para governanca, estimavel pelo reuso do modelo de usuarios, pequena para uma sprint e testavel por autorizacao, listagem e banimento.
- **Criterio de Aceite 01 (Listagem):** Dado que o administrador acessa sua area restrita, quando solicita a lista de usuarios, entao o sistema exibe apenas os identificadores necessarios e os nomes/e-mails dos cadastrados.
- **Criterio de Aceite 02 (Banimento):** Dado que o administrador decide remover um usuario, quando confirma a exclusao da conta, entao todos os dados de acesso daquele usuario sao invalidados.
- **Criterio de Aceite 03 (Privacidade Financeira):** Dado que o administrador visualiza a lista de usuarios, quando tenta acessar os lancamentos de um usuario especifico, entao o sistema nao deve fornecer nenhum caminho ou visualizacao de dados financeiros.

---

## Criterios de Aceite Globais

- **CAG01 - Padronizacao de Protocolo:** Todas as interacoes do sistema devem seguir rigorosamente o padrao HTTP para comunicacao, utilizando os verbos e codigos de estado correspondentes a semantica da operacao.
- **CAG02 - Seguranca e Privacidade de Dados:** O sistema deve garantir que em nenhuma circunstancia dados financeiros sejam expostos a terceiros ou administradores. O acesso deve ser restrito exclusivamente ao proprietario da conta por meio de autenticacao.
- **CAG03 - Integridade Financeira:** O calculo do saldo deve ser reprocessado a cada inclusao ou alteracao de status para garantir que o valor exibido reflita exatamente a soma algebrica dos lancamentos atuais.
- **CAG04 - Persistencia de Historico:** Uma vez que um registro e marcado como "Pago", o sistema deve assegurar a imutabilidade desse status e a impossibilidade de sua remocao, garantindo a rastreabilidade historica do fluxo de caixa do usuario.
- **CAG05 - Validacao de Entrada de Dados:** Toda e qualquer entrada de valor monetario deve passar por uma trava que impeca valores nulos, negativos ou caracteres nao numericos, assegurando a consistencia dos calculos matematicos do sistema.
