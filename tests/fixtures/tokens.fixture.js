/**
 * Tokens Fixture — Tokens inválidos e expirados para testes de segurança.
 *
 * Centraliza tokens fabricados para validação de cenários negativos
 * do middleware de autenticação.
 */

const jwt = require('jsonwebtoken');

/**
 * Token com assinatura adulterada (segredo incorreto).
 */
const TAMPERED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZha2UtaWQiLCJlbWFpbCI6ImZha2VAZW1haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTQ0MDAwMDAsImV4cCI6MTcxNDQwMzYwMH0.assinatura_invalida_adulterada';

/**
 * String sem o prefixo "Bearer" — formato incorreto.
 */
const TOKEN_WITHOUT_BEARER = 'token_sem_prefixo_bearer';

/**
 * Gera um token expirado sob demanda utilizando o segredo real.
 * O token é criado com expiração retroativa de 1 segundo.
 *
 * @returns {string} Token JWT expirado
 */
function generateExpiredToken() {
  const secret = process.env.JWT_SECRET || 'fincontrol_flow_super_secret_key_2026';

  return jwt.sign(
    { id: 'expired-user-id', email: 'expired@email.com', role: 'user' },
    secret,
    { expiresIn: '0s' }
  );
}

module.exports = {
  TAMPERED_TOKEN,
  TOKEN_WITHOUT_BEARER,
  generateExpiredToken,
};
