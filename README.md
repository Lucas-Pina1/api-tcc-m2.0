# FinControl Flow API

API RESTful para controle financeiro pessoal com autenticação JWT, gestão de movimentações e rotas administrativas separadas das operações financeiras.

## Visão Geral

O projeto resolve o fluxo básico de controle financeiro pessoal em uma API HTTP: cadastro de usuários, login, consulta de perfil, registro de receitas e despesas, efetivação de pagamentos, exclusão de lançamentos pendentes, consulta de extrato com saldo consolidado e administração de contas.

A aplicação segue o padrão `MVC + Service Layer`, com regras de negócio centralizadas em `services`, proteção de rotas por JWT e documentação interativa via Swagger.

## Tecnologias

- Node.js
- Express 5
- JSON Web Token (`jsonwebtoken`)
- `bcryptjs` para hash de senha
- `uuid` para geração de identificadores
- `dotenv` para variáveis de ambiente
- Swagger (`swagger-jsdoc` e `swagger-ui-express`)
- Mocha, Chai, SuperTest e Mochawesome para testes automatizados
- k6 para testes de performance

## Principais Funcionalidades

- Cadastro de usuário com validação de e-mail único
- Login com emissão de token JWT
- Consulta de perfil autenticado
- Registro de receitas e despesas
- Marcação de movimentação pendente como paga
- Exclusão apenas de movimentações pendentes
- Consulta de extrato com ordenação cronológica e saldo consolidado
- Listagem administrativa de usuários
- Banimento administrativo com remoção das movimentações do usuário excluído
- Bloqueio explícito para impedir que administradores acessem dados financeiros

## Como Executar

### Pré-requisitos

- Node.js 18 ou superior
- `npm`

### Instalação

```bash
npm install
```

### Variáveis de ambiente

O projeto lê as seguintes variáveis:

```env
PORT=3000
JWT_SECRET=seu_segredo
JWT_EXPIRES_IN=1h
```

Se `PORT` não for definida, a aplicação usa `3000`.  
Se `JWT_SECRET` ou `JWT_EXPIRES_IN` não forem definidos, o código usa valores fallback configurados em `src/config/auth.js`.

### Execução

```bash
npm run dev
```

Ou em modo normal:

```bash
npm start
```

### Endereços locais

- API: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`
- Swagger UI: `http://localhost:3000/api-docs`

## Swagger

A especificação OpenAPI é montada a partir de [docs/swagger.js](/D:/Users/lucas/Cursos/M2_julio_de_lima/Projetos/FinControl%20Flow-tcc-m2.0/docs/swagger.js) e das anotações JSDoc das rotas em `src/routes/`.

Para explorar a API:

- abra `http://localhost:3000/api-docs` com o servidor em execução
- autentique-se primeiro em `POST /api/auth/login`
- use o token JWT no padrão `Bearer <token>` nas rotas protegidas

## Testes

A suíte automatizada atual usa Mocha, Chai, SuperTest e Mochawesome, com configuração em [tests/.mocharc.yml](/D:/Users/lucas/Cursos/M2_julio_de_lima/Projetos/FinControl%20Flow-tcc-m2.0/tests/.mocharc.yml).

Execução:

```bash
npm.cmd test
```

Estado validado neste workspace:

- `58` testes passando
- relatório HTML em [reports/fincontrol-flow-test-report.html](/D:/Users/lucas/Cursos/M2_julio_de_lima/Projetos/FinControl%20Flow-tcc-m2.0/reports/fincontrol-flow-test-report.html)
- relatório JSON em [reports/fincontrol-flow-test-report.json](/D:/Users/lucas/Cursos/M2_julio_de_lima/Projetos/FinControl%20Flow-tcc-m2.0/reports/fincontrol-flow-test-report.json)

Também há testes de performance com k6:

- `npm run perf:smoke`
- `npm run perf:login`
- `npm run perf:statement`

## Limitações Atuais

- Persistência em memória nos models, sem banco de dados
- Dados são perdidos ao reiniciar o servidor
- Existe um administrador padrão em memória para viabilizar os fluxos administrativos:
  - e-mail: `admin@fincontrol.local`
  - senha: `admin123`


Para visão completa da arquitetura, fluxos, endpoints e estratégia de qualidade, consulte (https://github.com/Lucas-Pina1/api-tcc-m2.0/wiki)]
