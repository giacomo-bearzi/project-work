import mongoose from 'mongoose';
import Machine from '../models/Machine';
import SubLine from '../models/SubLine';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project-work';

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Machine.deleteMany({});
    const sublines = await SubLine.find();
    const createdMachines = [];

    for (const subline of sublines) {
        const machine = await Machine.create({
            name: `Macchina per ${subline.name}`,
            type: 'standard',
            maxTemperature: 100 + Math.floor(Math.random() * 100),
        });
        subline.machine = machine._id as mongoose.Types.ObjectId;
        await subline.save();
        createdMachines.push(machine);
    }

    console.log(`Created ${createdMachines.length} machines and linked to sublines.`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

seed().catch(err => {
    console.error('Seeder error:', err);
    process.exit(1);
}); 