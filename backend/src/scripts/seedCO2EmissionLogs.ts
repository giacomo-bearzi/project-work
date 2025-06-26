import mongoose from 'mongoose';
import Machine from '../models/Machine';
import CO2EmissionLog from '../models/CO2EmissionLog';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project-work';

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await CO2EmissionLog.deleteMany({});
    const machines = await Machine.find();
    let totalLogs = 0;

    for (const machine of machines) {
        const logs = [];
        for (let i = 0; i < 50; i++) {
            logs.push({
                machineId: machine._id,
                co2Emission: Math.round((Math.random() * 50 + 5) * 10) / 10,
                timestamp: randomDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date()),
            });
        }
        await CO2EmissionLog.insertMany(logs);
        totalLogs += logs.length;
    }

    console.log(`Created ${totalLogs} CO2 emission logs (${machines.length} macchine x 50 log).`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

seed().catch(err => {
    console.error('Seeder error:', err);
    process.exit(1);
}); 