const { Router } = require('express');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const { forbidAdminFinancialAccess } = require('../middlewares/roleMiddleware');

const router = Router();

router.use(authMiddleware);
router.use(forbidAdminFinancialAccess);

/**
 * @swagger
 * tags:
 *   name: Movimentações
 *   description: Endpoints de gestão de movimentações financeiras
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Consulta de extrato e saldo
 *     description: |
 *       Retorna as movimentações do usuário autenticado em ordem cronológica e o saldo consolidado (RF05, RF06).
 *       O isolamento dos dados do usuário é preservado em todas as respostas (RN02).
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Extrato financeiro obtido com sucesso
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
 *                   example: "Extrato financeiro obtido com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     balance:
 *                       type: number
 *                       example: 3500.5
 *       401:
 *         description: Não autorizado (token ausente ou inválido)
 *       403:
 *         description: Administradores não podem acessar dados financeiros
 *   post:
 *     summary: Registro de movimentação
 *     description: |
 *       Registra uma nova entrada (receita) ou saída (despesa).
 *       O valor deve ser estritamente positivo (RN04).
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - value
 *               - date
 *               - category
 *               - status
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Salário"
 *                 description: Descrição da movimentação
 *               value:
 *                 type: number
 *                 example: 5000.5
 *                 description: Valor da movimentação (deve ser maior que zero)
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-05"
 *                 description: Data da movimentação (YYYY-MM-DD)
 *               category:
 *                 type: string
 *                 enum: [receita, despesa]
 *                 example: "receita"
 *                 description: Categoria da movimentação
 *               status:
 *                 type: string
 *                 enum: [pendente, pago]
 *                 example: "pago"
 *                 description: Status inicial da movimentação
 *     responses:
 *       201:
 *         description: Movimentação registrada com sucesso
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
 *                   example: "Movimentação registrada com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Dados de entrada inválidos
 *       401:
 *         description: Não autorizado (token ausente ou inválido)
 *       403:
 *         description: Administradores não podem acessar dados financeiros
 */
router.get('/', transactionController.list);
router.post('/', transactionController.create);

/**
 * @swagger
 * /api/transactions/{id}/pay:
 *   patch:
 *     summary: Alteração de status para pago
 *     description: |
 *       Altera o status de uma movimentação de "pendente" para "pago" (RN05).
 *       Somente o dono da movimentação pode alterá-la (RN02).
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID da movimentação
 *     responses:
 *       200:
 *         description: Movimentação marcada como paga com sucesso
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
 *                   example: "Movimentação marcada como paga com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (movimentação de outro usuário ou perfil admin)
 *       404:
 *         description: Movimentação não encontrada
 *       422:
 *         description: Entidade não processável (movimentação já está paga)
 */
router.patch('/:id/pay', transactionController.pay);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Exclusão de movimentação
 *     description: |
 *       Remove uma movimentação pendente do histórico (RN06).
 *       Somente o dono da movimentação pode excluí-la (RN02).
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID da movimentação
 *     responses:
 *       200:
 *         description: Movimentação excluída com sucesso
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
 *                   example: "Movimentação excluída com sucesso."
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (movimentação de outro usuário ou perfil admin)
 *       404:
 *         description: Movimentação não encontrada
 *       422:
 *         description: Entidade não processável (movimentação já está paga e não pode ser excluída)
 */
router.delete('/:id', transactionController.remove);

module.exports = router;
