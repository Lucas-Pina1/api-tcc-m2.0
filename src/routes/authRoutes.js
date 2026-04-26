const { Router } = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints de cadastro, login e perfil do usuário
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Cadastro de novo usuário
 *     description: |
 *       Cria uma nova conta na plataforma FinControl Flow.
 *       O e-mail deve ser único (RN01). A senha é armazenada com hash bcrypt.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Lucas Pina"
 *                 description: Nome completo do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "lucas@email.com"
 *                 description: E-mail válido e não cadastrado
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "senha123"
 *                 description: Senha com no mínimo 6 caracteres
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
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
 *                   example: "Usuário cadastrado com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               camposFaltando:
 *                 summary: Campos obrigatórios ausentes
 *                 value:
 *                   success: false
 *                   message: "Campos obrigatórios não preenchidos."
 *                   details:
 *                     missingFields: ["name", "email"]
 *               emailInvalido:
 *                 summary: Formato de e-mail inválido
 *                 value:
 *                   success: false
 *                   message: "Formato de e-mail inválido."
 *               senhaFraca:
 *                 summary: Senha muito curta
 *                 value:
 *                   success: false
 *                   message: "A senha deve conter no mínimo 6 caracteres."
 *       409:
 *         description: E-mail já cadastrado (RN01)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Este e-mail já está cadastrado na plataforma."
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticação de usuário
 *     description: |
 *       Valida as credenciais e retorna um token JWT.
 *       O token deve ser enviado no header `Authorization: Bearer <token>` para acessar rotas protegidas.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "lucas@email.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
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
 *                   example: "Login realizado com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "E-mail e senha são obrigatórios."
 *               details:
 *                 missingFields: ["password"]
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "E-mail ou senha incorretos."
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Perfil do usuário autenticado
 *     description: |
 *       Retorna os dados do usuário autenticado.
 *       Requer token JWT válido no header Authorization.
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
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
 *                   example: "Perfil do usuário obtido com sucesso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Token ausente, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               tokenAusente:
 *                 summary: Token não fornecido
 *                 value:
 *                   success: false
 *                   message: "Token de autenticação não fornecido."
 *               tokenExpirado:
 *                 summary: Token expirado
 *                 value:
 *                   success: false
 *                   message: "Token expirado. Realize o login novamente."
 *               tokenInvalido:
 *                 summary: Token inválido
 *                 value:
 *                   success: false
 *                   message: "Token inválido."
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Usuário não encontrado."
 */
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
