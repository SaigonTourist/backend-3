import Pet from '../models/Pet.js';

class PetsService {
    async getAll() {
        return await Pet.find();
    }

    async getById(id) {
        return await Pet.findById(id);
    }

    async create(petData) {
        const pet = new Pet(petData);
        return await pet.save();
    }

    async update(id, petData) {
        return await Pet.findByIdAndUpdate(id, petData, { new: true });
    }

    async delete(id) {
        return await Pet.findByIdAndDelete(id);
    }

    async insertMany(pets) {
        return await Pet.insertMany(pets);
    }
}

export default new PetsService();