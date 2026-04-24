# Planejamento de User Stories

## Épicos

| ID | Título | Descrição |
| :--- | :--- | :--- |
| **Épico 01** | Gestão de Identidade e Acesso | Responsável por toda a jornada de entrada, identificação e segurança do usuário e do administrador na plataforma. |
| **Épico 02** | Gestão de Movimentações Financeiras | Abrange as funcionalidades de criação, modificação de estado e remoção de registros de receitas e despesas. |
| **Épico 03** | Painel de Resultados e Visibilidade | Focado na entrega de valor através da exibição consolidada de lançamentos e cálculos de saúde financeira (saldo). |
| **Épico 04** | Administração da Plataforma | Dedicado às ferramentas de governança e controle de usuários por parte do perfil administrador. |

---

## User Stories

### Épico 01: Gestão de Identidade e Acesso

#### US01 - Cadastro de Novo Usuário
> **Como** usuário comum,  
> **Quero** criar uma conta na plataforma utilizando e-mail e senha,  
> **Para que** eu possa iniciar o controle das minhas finanças pessoais.

- **Critério de Aceite 01 (Sucesso):** Dado que o usuário preenche um e-mail válido e não cadastrado e uma senha, quando solicita o cadastro, então o sistema confirma a criação da conta e permite o acesso.
- **Critério de Aceite 02 (E-mail duplicado):** Dado que o usuário tenta se cadastrar com um e-mail que já existe na base, quando solicita o cadastro, então o sistema impede a operação e exibe uma mensagem de erro informando a duplicidade.

#### US02 - Autenticação de Usuário
> **Como** usuário cadastrado,  
> **Quero** realizar o login no sistema,  
> **Para que** eu possa acessar meus dados financeiros com segurança.

- **Critério de Aceite 01 (Sucesso):** Dado que o usuário informa e-mail e senha corretos, quando solicita o acesso, então o sistema redireciona para a tela principal de extrato.
- **Critério de Aceite 02 (Dados Inválidos):** Dado que o usuário informa credenciais incorretas, quando solicita o acesso, então o sistema nega a entrada e informa que os dados estão incorretos.

---

### Épico 02: Gestão de Movimentações Financeiras

#### US03 - Registro de Movimentação
> **Como** usuário autenticado,  
> **Quero** registrar uma nova receita ou despesa,  
> **Para** manter meu histórico financeiro atualizado.

- **Critério de Aceite 01 (Validação de Valor):** Dado que o usuário tenta registrar um valor menor ou igual a zero, quando confirma o registro, então o sistema bloqueia a operação e exige um valor positivo.
- **Critério de Aceite 02 (Dados Obrigatórios):** Dado que o usuário deixa de preencher descrição, valor ou data, quando confirma o registro, então o sistema impede a gravação e destaca os campos obrigatórios.

#### US04 - Efetivação de Pagamento
> **Como** usuário autenticado,  
> **Quero** marcar uma conta pendente como paga,  
> **Para que** o sistema reflita que aquela transação foi concluída.

- **Critério de Aceite 01 (Mudança de Status):** Dado que existe uma movimentação "Pendente", quando o usuário aciona o comando de pagar, então o status é atualizado para "Pago" e a data de alteração é registrada.
- **Critério de Aceite 02 (Impedimento de Retrocesso):** Dado que uma movimentação já possui o status "Pago", quando o usuário tenta alterar o status, então o sistema não oferece a opção de retornar para "Pendente".

#### US05 - Exclusão de Movimentação
> **Como** usuário autenticado,  
> **Quero** excluir um lançamento feito por erro,  
> **Para** corrigir falhas de preenchimento no meu extrato.

- **Critério de Aceite 01 (Exclusão Permitida):** Dado que uma movimentação está com status "Pendente", quando o usuário solicita a exclusão, então o sistema remove o registro e atualiza o saldo.
- **Critério de Aceite 02 (Exclusão Negada):** Dado que uma movimentação está com status "Pago", quando o usuário tenta excluir o registro, então o sistema impede a ação e informa que registros pagos não podem ser removidos.

---

### Épico 03: Painel de Resultados e Visibilidade

#### US06 - Visualização de Saldo e Extrato
> **Como** usuário autenticado,  
> **Quero** visualizar a lista de meus lançamentos e o saldo final,  
> **Para** entender minha situação financeira atual.

- **Critério de Aceite 01 (Cálculo do Saldo):** Dado que o usuário possui receitas e despesas lançadas, quando acessa a tela principal, então o sistema exibe o valor resultante da subtração das despesas do total de receitas.
- **Critério de Aceite 02 (Isolamento):** Dado que o Usuário A está logado, quando visualiza o extrato, então o sistema garante que nenhum dado do Usuário B seja exibido.

---

### Épico 04: Administração da Plataforma

#### US07 - Gestão de Contas por Administrador
> **Como** administrador,  
> **Quero** visualizar a lista de usuários e ter o poder de excluir contas,  
> **Para** manter a ordem e a segurança da plataforma.

- **Critério de Aceite 01 (Listagem):** Dado que o administrador acessa sua área restrita, quando solicita a lista de usuários, então o sistema exibe apenas os nomes/e-mails dos cadastrados.
- **Critério de Aceite 02 (Banimento):** Dado que o administrador decide remover um usuário, quando confirma a exclusão da conta, então todos os dados de acesso daquele usuário são invalidados.
- **Critério de Aceite 03 (Privacidade Financeira):** Dado que o administrador visualiza a lista de usuários, quando tenta acessar os lançamentos de um usuário específico, então o sistema não deve fornecer nenhum caminho ou visualização de dados financeiros.

---

## Critérios de Aceite Globais

- **CAG01 - Padronização de Protocolo:** Todas as interações do sistema devem seguir rigorosamente o padrão HTTP para comunicação, utilizando os verbos e códigos de estado correspondentes à semântica da operação.
- **CAG02 - Segurança e Privacidade de Dados:** O sistema deve garantir que em nenhuma circunstância dados financeiros sejam expostos a terceiros ou administradores. O acesso deve ser restrito exclusivamente ao proprietário da conta através de autenticação.
- **CAG03 - Integridade Financeira:** O cálculo do saldo deve ser reprocessado a cada inclusão ou alteração de status para garantir que o valor exibido reflita exatamente a soma algébrica dos lançamentos atuais.
- **CAG04 - Persistência de Histórico:** Uma vez que um registro é marcado como "Pago", o sistema deve assegurar a imutabilidade desse status e a impossibilidade de sua remoção, garantindo a rastreabilidade histórica do fluxo de caixa do usuário.
- **CAG05 - Validação de Entrada de Dados:** Toda e qualquer entrada de valor monetário deve passar por uma trava que impeça valores nulos, negativos ou caracteres não numéricos, assegurando a consistência dos cálculos matemáticos do sistema.