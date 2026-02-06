import express from 'express';
import connectDB from './config/database.js';
import mocksRouter from './routes/mocks.router.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionRouter from './routes/adoption.router.js';
import { swaggerUi, specs } from './config/swagger.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB solo si no estamos en testing
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'Backend 3 - API funcionando correctamente',
        endpoints: {
            mocks: '/api/mocks',
            users: '/api/users',
            pets: '/api/pets',
            adoptions: '/api/adoptions',
            docs: '/api-docs'
        }
    });
});

// Solo iniciar servidor si no estamos en testing
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    });
}

// Exportar la app para testing
export default app;