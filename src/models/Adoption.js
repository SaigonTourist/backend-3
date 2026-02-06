import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    adoption_date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Adoption = mongoose.model('Adoption', adoptionSchema);
export default Adoption;