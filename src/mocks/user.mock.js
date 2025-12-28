import { faker } from '@faker-js/faker';
import { createHash } from '../utils/bcrypt.utils.js';

export const generateMockUser = () => {
    const numberOfRoles = ['user', 'admin'];
    const randomRole = numberOfRoles[Math.floor(Math.random() * numberOfRoles.length)];
    
    return {
        _id: faker.database.mongodbObjectId(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: createHash('coder123'),
        role: randomRole,
        pets: [],
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
    };
};

export const generateMockUsers = (quantity = 50) => {
    const users = [];
    for (let i = 0; i < quantity; i++) {
        users.push(generateMockUser());
    }
    return users;
};