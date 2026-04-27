const { v4: uuidv4 } = require('uuid');

/**
 * UserModel — Repositório in-memory de usuários.
 *
 * Simula uma camada de persistência utilizando um array JS.
 * Cada usuário possui: id, name, email, password (hash), role, createdAt.
 *
 * A interface pública é projetada para ser facilmente
 * substituída por um ORM/driver de banco no futuro.
 */

const users = [];

/**
 * Busca um usuário pelo e-mail.
 * @param {string} email
 * @returns {object|undefined}
 */
function findByEmail(email) {
  return users.find((user) => user.email === email);
}

/**
 * Busca um usuário pelo ID.
 * @param {string} id
 * @returns {object|undefined}
 */
function findById(id) {
  return users.find((user) => user.id === id);
}

/**
 * Cria um novo usuário e persiste no array.
 * @param {object} userData — { name, email, password (já hashada) }
 * @returns {object} — Usuário criado (sem o campo password)
 */
function create(userData) {
  const newUser = {
    id: uuidv4(),
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  // Retorna o usuário sem a senha
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/**
 * Retorna todos os usuários (sem senhas).
 * @returns {Array<object>}
 */
function findAll() {
  return users.map(({ password, ...user }) => user);
}

/**
 * Limpa todos os usuários do array (somente para testes).
 * Permite isolamento entre suítes de teste.
 */
function clearAll() {
  users.length = 0;
}

module.exports = {
  findByEmail,
  findById,
  create,
  findAll,
  clearAll,
};
