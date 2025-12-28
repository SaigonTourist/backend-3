import { Router } from 'express';
import usersService from '../services/users.service.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const users = await usersService.getAll();
        res.json({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

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