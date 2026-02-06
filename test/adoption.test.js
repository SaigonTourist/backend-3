import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Pet from '../src/models/Pet.js';
import Adoption from '../src/models/Adoption.js';

// Importar la app SIN iniciar el servidor
import app from '../src/app.js';

const requester = supertest(app);

describe('Adoption Router Tests', function() {
    this.timeout(10000);
    
    let testUser, testPet;
    
    before(async () => {
        // Conectar a base de datos de prueba
        const uri = 'mongodb://localhost:27017/backend3_test';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri);
        }
    });
    
    beforeEach(async () => {
        // Limpiar datos antes de cada test
        await User.deleteMany({});
        await Pet.deleteMany({});
        await Adoption.deleteMany({});
        
        // Crear usuario de prueba
        testUser = new User({
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            password: 'hashedpassword123',
            role: 'user',
            pets: []
        });
        await testUser.save();
        
        // Crear mascota de prueba
        testPet = new Pet({
            name: 'Test Pet',
            type: 'dog',
            breed: 'Labrador',
            age: 3,
            adopted: false,
            owner: null
        });
        await testPet.save();
    });
    
    afterEach(async () => {
        // Limpiar después de cada test
        await User.deleteMany({});
        await Pet.deleteMany({});
        await Adoption.deleteMany({});
    });

    after(async () => {
        // Cerrar conexión después de todos los tests
        await mongoose.connection.close();
    });

    describe('GET /api/adoptions', () => {
        it('Debe obtener todas las adopciones (array vacío inicialmente)', async () => {
            const response = await requester.get('/api/adoptions');
            
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.lengthOf(0);
        });
        
        it('Debe obtener todas las adopciones cuando existen', async () => {
            // Crear una adopción de prueba
            const adoption = new Adoption({
                owner: testUser._id,
                pet: testPet._id,
                status: 'pending',
                notes: 'Test adoption'
            });
            await adoption.save();
            
            const response = await requester.get('/api/adoptions');
            
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.lengthOf(1);
            expect(response.body.payload[0]).to.have.property('owner');
            expect(response.body.payload[0]).to.have.property('pet');
        });

        it('Debe manejar errores internos del servidor', async () => {
            // Simular error desconectando la base de datos temporalmente
            await mongoose.connection.close();
            
            const response = await requester.get('/api/adoptions');
            
            expect(response.status).to.equal(500);
            expect(response.body.status).to.equal('error');
            
            // Reconectar para otros tests
            const uri = 'mongodb://localhost:27017/backend3_test';
            await mongoose.connect(uri);
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('Debe obtener una adopción específica por ID', async () => {
            // Crear adopción de prueba
            const adoption = new Adoption({
                owner: testUser._id,
                pet: testPet._id,
                status: 'pending',
                notes: 'Test adoption'
            });
            await adoption.save();
            
            const response = await requester.get(`/api/adoptions/${adoption._id}`);
            
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.property('_id');
            expect(response.body.payload.notes).to.equal('Test adoption');
            expect(response.body.payload.status).to.equal('pending');
        });
        
        it('Debe retornar 404 cuando la adopción no existe', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await requester.get(`/api/adoptions/${fakeId}`);
            
            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('Adoption not found');
        });
        
        it('Debe retornar error 500 con ID inválido', async () => {
            const invalidId = 'invalid-id';
            const response = await requester.get(`/api/adoptions/${invalidId}`);
            
            expect(response.status).to.equal(500);
            expect(response.body.status).to.equal('error');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('Debe crear una adopción exitosamente', async () => {
            const response = await requester
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
                .send({ notes: 'Test adoption creation' });
            
            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('Adoption created successfully');
            expect(response.body.payload).to.have.property('_id');
            expect(response.body.payload.notes).to.equal('Test adoption creation');
            expect(response.body.payload.status).to.equal('pending');
            
            // Verificar que la mascota se marcó como adoptada
            const updatedPet = await Pet.findById(testPet._id);
            expect(updatedPet.adopted).to.be.true;
            expect(updatedPet.owner.toString()).to.equal(testUser._id.toString());
        });

        it('Debe crear una adopción sin notas', async () => {
            const response = await requester
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
                .send({});
            
            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload.notes).to.equal('');
        });
        
        it('Debe retornar 404 cuando el usuario no existe', async () => {
            const fakeUserId = '507f1f77bcf86cd799439011';
            const response = await requester
                .post(`/api/adoptions/${fakeUserId}/${testPet._id}`)
                .send({ notes: 'Test' });
            
            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('User not found');
        });
        
        it('Debe retornar 404 cuando la mascota no existe', async () => {
            const fakePetId = '507f1f77bcf86cd799439011';
            const response = await requester
                .post(`/api/adoptions/${testUser._id}/${fakePetId}`)
                .send({ notes: 'Test' });
            
            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('Pet not found');
        });
        
        it('Debe retornar 400 cuando la mascota ya está adoptada', async () => {
            // Marcar mascota como adoptada
            await Pet.findByIdAndUpdate(testPet._id, { adopted: true });
            
            const response = await requester
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
                .send({ notes: 'Test' });
            
            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('Pet is already adopted');
        });

        it('Debe retornar error 500 con IDs inválidos', async () => {
            const invalidId = 'invalid-id';
            const response = await requester
                .post(`/api/adoptions/${invalidId}/${testPet._id}`)
                .send({ notes: 'Test' });
            
            expect(response.status).to.equal(500);
            expect(response.body.status).to.equal('error');
        });
    });

    describe('PUT /api/adoptions/:aid', () => {
        it('Debe actualizar una adopción exitosamente', async () => {
            // Crear adopción de prueba
            const adoption = new Adoption({
                owner: testUser._id,
                pet: testPet._id,
                status: 'pending',
                notes: 'Original notes'
            });
            await adoption.save();
            
            const updateData = {
                status: 'approved',
                notes: 'Updated notes'
            };
            
            const response = await requester
                .put(`/api/adoptions/${adoption._id}`)
                .send(updateData);
            
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('Adoption updated successfully');
            expect(response.body.payload.status).to.equal('approved');
            expect(response.body.payload.notes).to.equal('Updated notes');
        });

        it('Debe actualizar solo el status', async () => {
            const adoption = new Adoption({
                owner: testUser._id,
                pet: testPet._id,
                status: 'pending',
                notes: 'Original notes'
            });
            await adoption.save();
            
            const response = await requester
                .put(`/api/adoptions/${adoption._id}`)
                .send({ status: 'completed' });
            
            expect(response.status).to.equal(200);
            expect(response.body.payload.status).to.equal('completed');
            expect(response.body.payload.notes).to.equal('Original notes');
        });

        it('Debe actualizar solo las notas', async () => {
            const adoption = new Adoption({
                owner: testUser._id,
                pet: testPet._id,
                status: 'pending',
                notes: 'Original notes'
            });
            await adoption.save();
            
            const response = await requester
                .put(`/api/adoptions/${adoption._id}`)
                .send({ notes: 'Only notes updated' });
            
            expect(response.status).to.equal(200);
            expect(response.body.payload.status).to.equal('pending');
            expect(response.body.payload.notes).to.equal('Only notes updated');
        });
        
        it('Debe retornar 404 cuando la adopción no existe', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await requester
                .put(`/api/adoptions/${fakeId}`)
                .send({ status: 'approved' });
            
            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('Adoption not found');
        });

        it('Debe retornar error 500 con ID inválido', async () => {
            const invalidId = 'invalid-id';
            const response = await requester
                .put(`/api/adoptions/${invalidId}`)
                .send({ status: 'approved' });
            
            expect(response.status).to.equal(500);
            expect(response.body.status).to.equal('error');
        });
    });

    describe('DELETE /api/adoptions/:aid', () => {
        it('Debe eliminar una adopción exitosamente', async () => {
            // Crear adopción de prueba
            const adoption = new Adoption({
                owner: testUser._id,
                pet: testPet._id,
                status: 'pending',
                notes: 'Test adoption'
            });
            await adoption.save();
            
            // Marcar mascota como adoptada y asignar owner
            await Pet.findByIdAndUpdate(testPet._id, { 
                adopted: true, 
                owner: testUser._id 
            });
            
            // Agregar mascota al array de pets del usuario
            await User.findByIdAndUpdate(testUser._id, {
                $push: { pets: testPet._id }
            });
            
            const response = await requester.delete(`/api/adoptions/${adoption._id}`);
            
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('Adoption deleted successfully');
            
            // Verificar que la mascota ya no esté adoptada
            const updatedPet = await Pet.findById(testPet._id);
            expect(updatedPet.adopted).to.be.false;
            expect(updatedPet.owner).to.be.null;
            
            // Verificar que la mascota se removió del usuario
            const updatedUser = await User.findById(testUser._id);
            expect(updatedUser.pets).to.not.include(testPet._id);
        });
        
        it('Debe retornar 404 cuando la adopción no existe', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await requester.delete(`/api/adoptions/${fakeId}`);
            
            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('Adoption not found');
        });

        it('Debe retornar error 500 con ID inválido', async () => {
            const invalidId = 'invalid-id';
            const response = await requester.delete(`/api/adoptions/${invalidId}`);
            
            expect(response.status).to.equal(500);
            expect(response.body.status).to.equal('error');
        });
    });

    describe('Casos edge adicionales', () => {
        it('Debe manejar adopción con estados válidos', async () => {
            const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
            
            for (const status of validStatuses) {
                const adoption = new Adoption({
                    owner: testUser._id,
                    pet: testPet._id,
                    status: status,
                    notes: `Test ${status}`
                });
                await adoption.save();
                
                const response = await requester.get(`/api/adoptions/${adoption._id}`);
                expect(response.status).to.equal(200);
                expect(response.body.payload.status).to.equal(status);
                
                await Adoption.findByIdAndDelete(adoption._id);
            }
        });

        it('Debe poblar correctamente owner y pet en las consultas', async () => {
            const adoption = new Adoption({
                owner: testUser._id,
                pet: testPet._id,
                status: 'pending',
                notes: 'Test population'
            });
            await adoption.save();
            
            const response = await requester.get(`/api/adoptions/${adoption._id}`);
            
            expect(response.status).to.equal(200);
            expect(response.body.payload.owner).to.have.property('first_name');
            expect(response.body.payload.owner).to.have.property('email');
            expect(response.body.payload.pet).to.have.property('name');
            expect(response.body.payload.pet).to.have.property('type');
        });
    });
});