import mongoose from 'mongoose';
import Machine from '../models/Machine';
import ConsumptionLog from '../models/ConsumptionLog';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project-work';

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await ConsumptionLog.deleteMany({});
    const machines = await Machine.find();
    let totalLogs = 0;

    for (const machine of machines) {
        const logs = [];
        for (let i = 0; i < 50; i++) {
            logs.push({
                machineId: machine._id,
                energyConsumed: Math.round((Math.random() * 100 + 10) * 10) / 10,
                timestamp: randomDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date()),
            });
        }
        await ConsumptionLog.insertMany(logs);
        totalLogs += logs.length;
    }

    console.log(`Created ${totalLogs} consumption logs (${machines.length} macchine x 50 log).`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

seed().catch(err => {
    console.error('Seeder error:', err);
    process.exit(1);
}); 