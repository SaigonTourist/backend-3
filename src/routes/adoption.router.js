import { Router } from 'express';
import adoptionsService from '../services/adoptions.service.js';
import usersService from '../services/users.service.js';
import petsService from '../services/pets.service.js';

const router = Router();

// GET /api/adoptions - Obtener todas las adopciones
router.get('/', async (req, res) => {
    try {
        const adoptions = await adoptionsService.getAll();
        res.json({
            status: 'success',
            payload: adoptions
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET /api/adoptions/:aid - Obtener adopción por ID
router.get('/:aid', async (req, res) => {
    try {
        const { aid } = req.params;
        const adoption = await adoptionsService.getById(aid);
        
        if (!adoption) {
            return res.status(404).json({
                status: 'error',
                message: 'Adoption not found'
            });
        }
        
        res.json({
            status: 'success',
            payload: adoption
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// POST /api/adoptions/:uid/:pid - Crear una adopción
router.post('/:uid/:pid', async (req, res) => {
    try {
        const { uid, pid } = req.params;
        
        // Verificar que el usuario existe
        const user = await usersService.getById(uid);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        
        // Verificar que la mascota existe
        const pet = await petsService.getById(pid);
        if (!pet) {
            return res.status(404).json({
                status: 'error',
                message: 'Pet not found'
            });
        }
        
        // Verificar que la mascota no esté adoptada
        if (pet.adopted) {
            return res.status(400).json({
                status: 'error',
                message: 'Pet is already adopted'
            });
        }
        
        // Crear la adopción
        const adoptionData = {
            owner: uid,
            pet: pid,
            status: 'pending',
            notes: req.body.notes || ''
        };
        
        const adoption = await adoptionsService.create(adoptionData);
        
        // Actualizar la mascota como adoptada
        await petsService.update(pid, { adopted: true, owner: uid });
        
        // Actualizar el usuario agregando la mascota
        const updatedUser = await usersService.getById(uid);
        const userPets = [...updatedUser.pets, pid];
        await usersService.update(uid, { pets: userPets });
        
        const populatedAdoption = await adoptionsService.getById(adoption._id);
        
        res.status(201).json({
            status: 'success',
            message: 'Adoption created successfully',
            payload: populatedAdoption
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// PUT /api/adoptions/:aid - Actualizar adopción
router.put('/:aid', async (req, res) => {
    try {
        const { aid } = req.params;
        const { status, notes } = req.body;
        
        const adoption = await adoptionsService.getById(aid);
        if (!adoption) {
            return res.status(404).json({
                status: 'error',
                message: 'Adoption not found'
            });
        }
        
        const updateData = {};
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;
        
        const updatedAdoption = await adoptionsService.update(aid, updateData);
        
        res.json({
            status: 'success',
            message: 'Adoption updated successfully',
            payload: updatedAdoption
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// DELETE /api/adoptions/:aid - Eliminar adopción
router.delete('/:aid', async (req, res) => {
    try {
        const { aid } = req.params;
        
        const adoption = await adoptionsService.getById(aid);
        if (!adoption) {
            return res.status(404).json({
                status: 'error',
                message: 'Adoption not found'
            });
        }
        
        // Revertir la adopción en la mascota
        await petsService.update(adoption.pet._id, { 
            adopted: false, 
            owner: null 
        });
        
        // Remover mascota del usuario
        const user = await usersService.getById(adoption.owner._id);
        const updatedPets = user.pets.filter(petId => 
            petId.toString() !== adoption.pet._id.toString()
        );
        await usersService.update(adoption.owner._id, { pets: updatedPets });
        
        await adoptionsService.delete(aid);
        
        res.json({
            status: 'success',
            message: 'Adoption deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;