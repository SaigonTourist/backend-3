import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend 3 - Pet Adoption API',
            version: '1.0.0',
            description: 'API para gestión de adopciones de mascotas',
        },
        servers: [
            {
                url: 'http://localhost:8080/api',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };