/**
 * Setup Global — Executado antes de toda a suite de testes.
 *
 * Responsabilidades:
 * - Carregar variáveis de ambiente para testes
 * - Configurar chai plugins
 * - Garantir que o ambiente está pronto
 */

const dotenv = require('dotenv');
const chai = require('chai');

// Carrega variáveis de ambiente
dotenv.config();

// Exporta expect globalmente para conveniência
global.expect = chai.expect;
