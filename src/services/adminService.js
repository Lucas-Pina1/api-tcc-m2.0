const transactionModel = require('../models/transactionModel');
const userModel = require('../models/userModel');
const AppError = require('../utils/AppError');

function listUsers() {
  return userModel.findAll().map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));
}

function deleteUser(userId) {
  const existingUser = userModel.findById(userId);

  if (!existingUser) {
    throw new AppError('Usuário não encontrado.', 404);
  }

  const removedUser = userModel.remove(userId);
  transactionModel.removeByUserId(userId);

  return removedUser;
}

module.exports = {
  listUsers,
  deleteUser,
};
