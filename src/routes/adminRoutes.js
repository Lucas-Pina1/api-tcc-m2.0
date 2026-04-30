const { Router } = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/roleMiddleware');

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

/**
 * @swagger
 * tags:
 *   name: Administração
 *   description: Endpoints administrativos para gestão de contas
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Listagem de usuários
 *     description: |
 *       Retorna a lista de usuários cadastrados para o perfil administrador (RF08).
 *       O retorno expõe apenas identificadores e dados cadastrais não financeiros.
 *     tags: [Administração]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lista de usuários obtida com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AdminUser'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a administradores
 */
router.get('/users', adminController.listUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Banimento de conta
 *     description: |
 *       Remove permanentemente um usuário da plataforma (RF09).
 *       Também elimina suas movimentações em memória e invalida tokens já emitidos.
 *     tags: [Administração]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário a ser removido
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuário removido com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/AdminUser'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a administradores
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
