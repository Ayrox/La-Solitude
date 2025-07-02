// Importing mongoose for MongoDB connection
import mongoose from 'mongoose';

// Async function to connect to the database
async function connectToDatabase() {
    try {
        // Remove deprecated options: useNewUrlParser and useUnifiedTopology
        await mongoose.connect(process.env.MONGODB_URI, {
            // Keep only supported options
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('The client is now connected to the database !');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

// Exporting the connection function
export default connectToDatabase;