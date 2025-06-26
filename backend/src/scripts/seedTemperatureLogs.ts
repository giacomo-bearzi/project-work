import mongoose from 'mongoose';
import Machine from '../models/Machine';
import TemperatureLog from '../models/TemperatureLog';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project-work';

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await TemperatureLog.deleteMany({});
    const machines = await Machine.find();
    let totalLogs = 0;

    for (const machine of machines) {
        const logs = [];
        for (let i = 0; i < 50; i++) {
            logs.push({
                machineId: machine._id,
                temperature: Math.round((Math.random() * (machine.maxTemperature - 20) + 20) * 10) / 10,
                timestamp: randomDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date()),
            });
        }
        await TemperatureLog.insertMany(logs);
        totalLogs += logs.length;
    }

    console.log(`Created ${totalLogs} temperature logs (${machines.length} macchine x 50 log).`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

seed().catch(err => {
    console.error('Seeder error:', err);
    process.exit(1);
}); 