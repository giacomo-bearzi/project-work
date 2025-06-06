import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project-work');
        console.log('Connected to MongoDB');

        // Clear existing users (optional, uncomment if you want to start fresh)
        // await User.deleteMany({});
        // console.log('Cleared existing users');

        const operatorsToCreate = 44;
        const managersToCreate = 3;
        const usersToCreate = [];

        // Create operators
        for (let i = 1; i <= operatorsToCreate; i++) {
            const password = `operator${i}pass`;
            const hashedPassword = await bcrypt.hash(password, 10);
            usersToCreate.push({
                username: `operator${i}`,
                password: hashedPassword,
                fullName: `Operatore ${i}`,
                role: 'operator',
            });
        }

        // Create managers
        for (let i = 1; i <= managersToCreate; i++) {
            const password = `manager${i}pass`;
            const hashedPassword = await bcrypt.hash(password, 10);
            usersToCreate.push({
                username: `manager${i}`,
                password: hashedPassword,
                fullName: `Manager ${i}`,
                role: 'manager',
            });
        }

        console.log(`Creating ${usersToCreate.length} new users...`);

        await User.insertMany(usersToCreate);

        console.log('Users seeded successfully!');

    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

seedUsers(); 