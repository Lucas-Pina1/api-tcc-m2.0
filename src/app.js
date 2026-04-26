const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ─── Middlewares Globais ──────────────────────────────────────
app.use(express.json());

// ─── Documentação Swagger ─────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FinControl Flow API — Documentação',
}));

// ─── Rota de Health Check ─────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'FinControl Flow API está operacional.',
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
    },
  });
});

// ─── Rotas da Aplicação ───────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Rota 404 (catch-all) ─────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada.',
  });
});

// ─── Middleware Global de Erros ───────────────────────────────
app.use(errorHandler);

module.exports = app;
