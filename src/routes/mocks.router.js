
import { Router } from 'express';
import { generateMockUsers, generateMockUser } from '../mocks/user.mock.js';
import { generateMockPets, generateMockPet } from '../mocks/pet.mock.js';
import usersService from '../services/users.service.js';
import petsService from '../services/pets.service.js';

const router = Router();

// Endpoint existente migrado - GET /mockingpets
router.get('/mockingpets', async (req, res) => {
    try {
        const pets = generateMockPets(100);
        res.status(200).json({
            status: 'success',
            payload: pets
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Nuevo endpoint - GET /mockingusers
router.get('/mockingusers', async (req, res) => {
    try {
        // Permite personalizar la cantidad con query param, default 50
        const quantity = parseInt(req.query.quantity) || 50;
        const users = generateMockUsers(quantity);
        
        res.status(200).json({
            status: 'success',
            count: users.length,
            payload: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Nuevo endpoint - POST /generateData
router.post('/generateData', async (req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;
        
        // Validación de parámetros
        if (typeof users !== 'number' || typeof pets !== 'number') {
            return res.status(400).json({
                status: 'error',
                message: 'Los parámetros users y pets deben ser numéricos'
            });
        }

        if (users < 0 || pets < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Los parámetros no pueden ser negativos'
            });
        }

        // Generar e insertar usuarios
        const generatedUsers = [];
        for (let i = 0; i < users; i++) {
            const mockUser = generateMockUser();
            // Remover el _id para que MongoDB lo genere
            delete mockUser._id;
            const createdUser = await usersService.create(mockUser);
            generatedUsers.push(createdUser);
        }

        // Generar e insertar mascotas
        const generatedPets = [];
        for (let i = 0; i < pets; i++) {
            const mockPet = generateMockPet();
            // Remover el _id para que MongoDB lo genere
            delete mockPet._id;
            const createdPet = await petsService.create(mockPet);
            generatedPets.push(createdPet);
        }

        res.status(201).json({
            status: 'success',
            message: 'Datos generados e insertados correctamente',
            payload: {
                usersCreated: generatedUsers.length,
                petsCreated: generatedPets.length,
                users: generatedUsers,
                pets: generatedPets
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;