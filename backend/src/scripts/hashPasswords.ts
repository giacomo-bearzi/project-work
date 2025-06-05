import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

async function hashExistingPasswords() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project-work');
        console.log('Connected to MongoDB');

        // Get all users
        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        // Hash each user's password
        for (const user of users) {
            console.log(`Processing user: ${user.username}`);
            console.log(`Current password: ${user.password}`);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            // Update the user's password
            const result = await User.updateOne(
                { _id: user._id },
                { $set: { password: hashedPassword } }
            );

            console.log(`Update result for ${user.username}:`, result);
            console.log(`Updated password for user: ${user.username}`);
        }

        console.log('All passwords have been hashed successfully');
    } catch (error) {
        console.error('Error hashing passwords:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the script
hashExistingPasswords(); 