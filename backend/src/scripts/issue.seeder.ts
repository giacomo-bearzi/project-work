import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Issue from '../models/Issue';
import User from '../models/User'; // Import the User model

dotenv.config();

const seedIssues = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project-work');
        console.log('Connected to MongoDB for issue seeding');

        // Optional: Clear existing issues
        // await Issue.deleteMany({});
        // console.log('Cleared existing issues');

        // Get existing users to assign issues to
        const adminUser = await User.findOne({ username: 'AdminMario' });
        const managerUser = await User.findOne({ username: 'ManagerLuca' });
        const operatorUser = await User.findOne({ username: 'GioZacca12' });

        if (!adminUser || !managerUser || !operatorUser) {
            console.error('Could not find required users for seeding. Please run user seeder first.');
            await mongoose.disconnect();
            return;
        }

        const sampleIssues = [
            {
                lineId: 'LINE-1',
                type: 'meccanico',
                priority: 'alta',
                status: 'aperta',
                description: 'Motore linea 1 surriscaldato',
                reportedBy: operatorUser._id,
                assignedTo: managerUser._id,
            },
            {
                lineId: 'LINE-2',
                type: 'elettrico',
                priority: 'media',
                status: 'in lavorazione',
                description: 'Problema alimentazione pannello di controllo',
                reportedBy: operatorUser._id,
                assignedTo: adminUser._id,
            },
            {
                lineId: 'LINE-3',
                type: 'qualità',
                priority: 'bassa',
                status: 'risolta',
                description: 'Imballaggio non conforme',
                reportedBy: managerUser._id,
                resolvedAt: new Date(),
            },
            {
                lineId: 'LINE-1',
                type: 'sicurezza',
                priority: 'alta',
                status: 'aperta',
                description: 'Sensore di sicurezza bloccato',
                reportedBy: operatorUser._id,
            }
        ];

        console.log(`Creating ${sampleIssues.length} sample issues...`);

        await Issue.insertMany(sampleIssues);

        console.log('Sample issues seeded successfully!');

    } catch (error) {
        console.error('Error seeding issues:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB after issue seeding');
    }
};

seedIssues(); 