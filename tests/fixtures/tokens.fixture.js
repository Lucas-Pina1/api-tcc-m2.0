/**
 * Tokens Fixture — Tokens inválidos e expirados para testes de segurança.
 *
 * Centraliza tokens fabricados para validação de cenários negativos
 * do middleware de autenticação.
 */

const jwt = require('jsonwebtoken');
const authConfig = require('../../src/config/auth');

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
 * Usa o mesmo segredo de src/config/auth.js para garantir que
 * jwt.verify lance TokenExpiredError (e não JsonWebTokenError).
 *
 * @returns {string} Token JWT expirado
 */
function generateExpiredToken() {
  return jwt.sign(
    { id: 'expired-user-id', email: 'expired@email.com', role: 'user' },
    authConfig.secret,
    { expiresIn: '0s' }
  );
}

module.exports = {
  TAMPERED_TOKEN,
  TOKEN_WITHOUT_BEARER,
  generateExpiredToken,
};
