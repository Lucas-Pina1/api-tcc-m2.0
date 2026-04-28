const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'FinControl Flow API',
    version: '1.0.0',
    description: `
API RESTful para controle financeiro pessoal.

## Visão Geral
O **FinControl Flow** permite que usuários gerenciem suas finanças pessoais,
registrando receitas e despesas, acompanhando saldos e extratos.

## Autenticação
A API utiliza **JWT (JSON Web Token)** para autenticação.

### Fluxo de Autenticação:
1. **Cadastro** — \`POST /api/auth/register\` cria uma conta
2. **Login** — \`POST /api/auth/login\` retorna um token JWT
3. **Uso do Token** — Enviar o token no header \`Authorization: Bearer <token>\`
4. **Acesso** — Rotas protegidas validam o token automaticamente

### Formato do Header:
\`\`\`
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

## Status Codes
| Código | Significado |
|--------|-------------|
| 200 | Operação realizada com sucesso |
| 201 | Recurso criado com sucesso |
| 400 | Dados de entrada inválidos |
| 401 | Não autenticado / token inválido |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex: e-mail duplicado) |
| 500 | Erro interno do servidor |
    `,
    contact: {
      name: 'FinControl Flow',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtido no endpoint de login',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            description: 'Identificador único do usuário (UUID v4)',
          },
          name: {
            type: 'string',
            example: 'Lucas Pina',
            description: 'Nome completo do usuário',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'lucas@email.com',
            description: 'E-mail do usuário',
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            example: 'user',
            description: 'Perfil de acesso do usuário',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-26T14:00:00.000Z',
            description: 'Data de criação da conta',
          },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
            description: 'Identificador único da movimentação',
          },
          userId: {
            type: 'string',
            format: 'uuid',
            example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            description: 'ID do usuário dono da movimentação',
          },
          description: {
            type: 'string',
            example: 'Salário',
            description: 'Descrição da movimentação',
          },
          amount: {
            type: 'number',
            example: 5000.50,
            description: 'Valor da movimentação',
          },
          date: {
            type: 'string',
            format: 'date',
            example: '2026-05-05',
            description: 'Data da movimentação',
          },
          type: {
            type: 'string',
            enum: ['receita', 'despesa'],
            example: 'receita',
            description: 'Categoria da movimentação',
          },
          status: {
            type: 'string',
            enum: ['pendente', 'pago'],
            example: 'pago',
            description: 'Status atual',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-26T14:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-26T14:00:00.000Z',
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Operação realizada com sucesso.',
          },
          data: {
            type: 'object',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Descrição clara do erro.',
          },
          details: {
            type: 'object',
            nullable: true,
            description: 'Detalhes adicionais sobre o erro (quando aplicável)',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
