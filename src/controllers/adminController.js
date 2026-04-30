const adminService = require('../services/adminService');
const { sendSuccess } = require('../utils/responseHelper');

async function listUsers(req, res, next) {
  try {
    const users = adminService.listUsers();
    return sendSuccess(res, 200, 'Lista de usuários obtida com sucesso.', { users });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = adminService.deleteUser(id);
    return sendSuccess(res, 200, 'Usuário removido com sucesso.', { user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsers,
  deleteUser,
};
