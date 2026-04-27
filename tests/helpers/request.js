/**
 * Request Helper — Instância SuperTest configurada.
 *
 * Centraliza a criação do agente HTTP para testes,
 * apontando diretamente para a instância Express (sem necessidade de servidor rodando).
 */

const supertest = require('supertest');
const app = require('../../src/app');

const request = supertest(app);

module.exports = request;
