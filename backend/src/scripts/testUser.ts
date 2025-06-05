import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

async function testUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project-work');
        if (mongoose.connection.db) {
            const dbName = mongoose.connection.db.databaseName;
            console.log('Connected to MongoDB');
            console.log('Current database name:', dbName);
        } else {
            console.log('Connected to MongoDB, but db is undefined');
        }

        // Print all documents in Users collection
        if (mongoose.connection.db) {
            const allDocs = await mongoose.connection.db.collection('Users').find({}).toArray();
            console.log('--- ALL DOCUMENTS IN Users COLLECTION ---');
            allDocs.forEach(doc => console.log(JSON.stringify(doc, null, 2)));
            console.log('--- END OF DOCUMENTS ---');
        }

        // List all collections
        if (mongoose.connection.db) {
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log('Available collections:', collections.map(c => c.name));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the test
testUser(); 