import express from 'express';
import connectDB from './config/database.js';
import mocksRouter from './routes/mocks.router.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
connectDB();

// Routes
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'Backend 3 - API funcionando correctamente',
        endpoints: {
            mocks: '/api/mocks',
            users: '/api/users',
            pets: '/api/pets'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});