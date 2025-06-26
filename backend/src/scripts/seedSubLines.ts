import mongoose from 'mongoose';
import SubLine from '../models/SubLine';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project-work';

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // 9 subline, 3 per ciascuna linea
    const fakeMachineIds = Array.from({ length: 9 }, () => new mongoose.Types.ObjectId());

    const subLines = [
        { name: 'SubLine 1A', status: 'active', machine: fakeMachineIds[0] },
        { name: 'SubLine 1B', status: 'active', machine: fakeMachineIds[1] },
        { name: 'SubLine 1C', status: 'active', machine: fakeMachineIds[2] },
        { name: 'SubLine 2A', status: 'maintenance', machine: fakeMachineIds[3] },
        { name: 'SubLine 2B', status: 'maintenance', machine: fakeMachineIds[4] },
        { name: 'SubLine 2C', status: 'maintenance', machine: fakeMachineIds[5] },
        { name: 'SubLine 3A', status: 'stopped', machine: fakeMachineIds[6] },
        { name: 'SubLine 3B', status: 'stopped', machine: fakeMachineIds[7] },
        { name: 'SubLine 3C', status: 'stopped', machine: fakeMachineIds[8] },
    ];

    await SubLine.deleteMany({});
    const inserted = await SubLine.insertMany(subLines);
    console.log('Seeded 9 sublines!');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

seed().catch(err => {
    console.error('Seeder error:', err);
    process.exit(1);
}); 