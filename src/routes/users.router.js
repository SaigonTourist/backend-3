import { Router } from 'express';
import usersService from '../services/users.service.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del usuario
 *         first_name:
 *           type: string
 *           description: Nombre del usuario
 *         last_name:
 *           type: string
 *           description: Apellido del usuario
 *         email:
 *           type: string
 *           description: Email del usuario
 *         password:
 *           type: string
 *           description: Contraseña encriptada
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: Rol del usuario
 *         pets:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs de mascotas
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         first_name: "Juan"
 *         last_name: "Pérez"
 *         email: "juan@example.com"
 *         role: "user"
 *         pets: []
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
    try {
        const users = await usersService.getAll();
        res.json({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await usersService.getById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.json({ status: 'success', payload: user });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;