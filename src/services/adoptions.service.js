import Adoption from '../models/Adoption.js';

class AdoptionsService {
    async getAll() {
        return await Adoption.find()
            .populate('owner', 'first_name last_name email')
            .populate('pet', 'name type breed age');
    }

    async getById(id) {
        return await Adoption.findById(id)
            .populate('owner', 'first_name last_name email')
            .populate('pet', 'name type breed age');
    }

    async create(adoptionData) {
        const adoption = new Adoption(adoptionData);
        return await adoption.save();
    }

    async update(id, adoptionData) {
        return await Adoption.findByIdAndUpdate(id, adoptionData, { new: true })
            .populate('owner', 'first_name last_name email')
            .populate('pet', 'name type breed age');
    }

    async delete(id) {
        return await Adoption.findByIdAndDelete(id);
    }

    async getByUserId(userId) {
        return await Adoption.find({ owner: userId })
            .populate('pet', 'name type breed age');
    }

    async getByPetId(petId) {
        return await Adoption.find({ pet: petId })
            .populate('owner', 'first_name last_name email');
    }
}

export default new AdoptionsService();