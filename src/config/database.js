import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const isTest = process.env.NODE_ENV === 'test';
        const uri = isTest 
            ? 'mongodb://localhost:27017/backend3_test'
            : process.env.MONGODB_URI || 'mongodb://localhost:27017/backend3';
        
        await mongoose.connect(uri);
        
        if (!isTest) {
            console.log('✅ MongoDB conectado correctamente');
        }
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;