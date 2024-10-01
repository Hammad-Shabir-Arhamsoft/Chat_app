import mongoose from 'mongoose';

// Connect to MongoDB
const connectToDB = () => {
    return mongoose.connect('mongodb://localhost:27017/chatdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('MongoDB connected!'))
        .catch(err => console.error('MongoDB connection error:', err));
};

export default connectToDB;
