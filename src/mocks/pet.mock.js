import { faker } from '@faker-js/faker';

export const generateMockPet = () => {
    const petTypes = ['dog', 'cat', 'bird', 'fish', 'hamster', 'rabbit'];
    const randomType = petTypes[Math.floor(Math.random() * petTypes.length)];
    
    return {
        _id: faker.database.mongodbObjectId(),
        name: faker.person.firstName(),
        type: randomType,
        breed: faker.animal.dog(), // Puedes ajustar según el tipo
        age: faker.number.int({ min: 1, max: 15 }),
        adopted: false,
        owner: null,
        image: faker.image.urlLoremFlickr({ category: 'animals' }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
    };
};

export const generateMockPets = (quantity = 100) => {
    const pets = [];
    for (let i = 0; i < quantity; i++) {
        pets.push(generateMockPet());
    }
    return pets;
};