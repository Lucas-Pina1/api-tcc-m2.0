# Requisitos do Sistema

## Requisitos Funcionais

### RF01 - Cadastro de Usuários
O sistema deve permitir que novos usuários se cadastrem fornecendo um endereço de e-mail e uma senha de acesso.

### RF02 - Autenticação de Usuários
O sistema deve permitir o acesso de usuários previamente cadastrados mediante a validação de suas credenciais de acesso.

### RF03 - Registro de Movimentações Financeiras
O sistema deve permitir que o usuário registre entradas (receitas) e saídas (despesas), informando obrigatoriamente:
- Descrição
- Valor
- Data
- Categoria (receita ou despesa)
- Status inicial (pendente ou pago)

### RF04 - Alteração de Status de Pagamento
O sistema deve permitir que o usuário altere o status de uma movimentação de **"Pendente"** para **"Pago"**.

### RF05 - Consulta de Extrato
O sistema deve exibir uma lista cronológica das movimentações financeiras registradas pelo usuário autenticado.

### RF06 - Cálculo de Saldo Atualizado
O sistema deve exibir o saldo consolidado do usuário, calculado através da fórmula:
> `(Soma de todas as Receitas) - (Soma de todas as Despesas)`

### RF07 - Exclusão de Movimentações
O sistema deve permitir a remoção de registros de movimentações do histórico do usuário, desde que respeitadas as regras de negócio de status.

### RF08 - Listagem de Usuários (Administrador)
O sistema deve permitir que o perfil **Administrador** visualize a lista completa de pessoas cadastradas na plataforma.

### RF09 - Banimento de Contas (Administrador)
O sistema deve permitir que o perfil **Administrador** remova permanentemente a conta de um usuário da plataforma.

---

## Regras de Negócio

### RN01 - Unicidade de Identificação
Não é permitido o cadastro de mais de uma conta utilizando o mesmo endereço de e-mail.

### RN02 - Isolamento de Dados
Um usuário comum jamais poderá visualizar, editar ou excluir movimentações financeiras pertencentes a outro usuário.

### RN03 - Restrição de Visualização Administrativa
O Administrador tem acesso à gestão de contas (usuários), porém é expressamente proibido de visualizar os dados financeiros (movimentações, saldo ou extrato) de qualquer usuário.

### RN04 - Validação de Valores Monetários
O sistema não deve aceitar o registro de movimentações com valor igual a zero ou valores negativos. Todos os lançamentos devem possuir valor absoluto positivo.

### RN05 - Fluxo Unidirecional de Status
Uma movimentação que esteja com o status **"Pago"** não pode, sob nenhuma hipótese, retornar ao status **"Pendente"**.

### RN06 - Proteção de Histórico de Pagamentos
Somente movimentações com status **"Pendente"** podem ser excluídas pelo usuário. Movimentações com status **"Pago"** são consideradas registros históricos definitivos e não podem ser removidas.