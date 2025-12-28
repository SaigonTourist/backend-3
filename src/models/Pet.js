import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'bird', 'fish', 'hamster', 'rabbit', 'other']
    },
    breed: {
        type: String
    },
    age: {
        type: Number,
        min: 0
    },
    adopted: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

const Pet = mongoose.model('Pet', petSchema);
export default Pet;