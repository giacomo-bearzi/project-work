import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Machine from '../models/Machine';
import TemperatureLog from '../models/TemperatureLog';
import PowerLog from '../models/PowerLog';
import CO2EmissionLog from '../models/CO2EmissionLog';
import ConsumptionLog from '../models/ConsumptionLog';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project-work';

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Cancella tutto
    await Machine.deleteMany({});
    await TemperatureLog.deleteMany({});
    await PowerLog.deleteMany({});
    await CO2EmissionLog.deleteMany({});
    await ConsumptionLog.deleteMany({});
    console.log('Deleted all machines and logs');

    // 2. Crea 9 macchine
    const machineData = Array.from({ length: 9 }, (_, i) => ({
        name: `Macchina ${i + 1}`,
        type: 'standard',
        maxTemperature: 100 + Math.floor(Math.random() * 50),
        warnTemperature: 80 + Math.floor(Math.random() * 20),
    }));
    const machines = await Machine.insertMany(machineData);
    console.log(`Created ${machines.length} machines`);

    // 3. Crea log per ogni macchina
    let totalTempLogs = 0, totalPowerLogs = 0, totalCO2Logs = 0, totalConsumptionLogs = 0;
    for (const machine of machines) {
        // Temperature logs
        const tempLogs = [];
        for (let i = 0; i < 50; i++) {
            tempLogs.push({
                machineId: machine._id,
                temperature: Math.round((Math.random() * (machine.maxTemperature - 20) + 20) * 10) / 10,
                timestamp: randomDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date()),
            });
        }
        await TemperatureLog.insertMany(tempLogs);
        totalTempLogs += tempLogs.length;

        // Power logs
        const powerLogs = [];
        for (let i = 0; i < 50; i++) {
            powerLogs.push({
                machineId: machine._id,
                power: Math.round((Math.random() * 100 + 50) * 10) / 10,
                timestamp: randomDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date()),
            });
        }
        await PowerLog.insertMany(powerLogs);
        totalPowerLogs += powerLogs.length;

        // CO2 logs
        const co2Logs = [];
        for (let i = 0; i < 50; i++) {
            co2Logs.push({
                machineId: machine._id,
                co2Emission: Math.round((Math.random() * 10 + 1) * 100) / 100,
                timestamp: randomDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date()),
            });
        }
        await CO2EmissionLog.insertMany(co2Logs);
        totalCO2Logs += co2Logs.length;

        // Consumption logs
        const consumptionLogs = [];
        for (let i = 0; i < 50; i++) {
            consumptionLogs.push({
                machineId: machine._id,
                energyConsumed: Math.round((Math.random() * 100 + 10) * 10) / 10,
                timestamp: randomDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date()),
            });
        }
        await ConsumptionLog.insertMany(consumptionLogs);
        totalConsumptionLogs += consumptionLogs.length;
    }

    console.log(`Created ${totalTempLogs} temperature logs, ${totalPowerLogs} power logs, ${totalCO2Logs} CO2 logs, ${totalConsumptionLogs} consumption logs.`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

seed().catch(err => {
    console.error('Seeder error:', err);
    process.exit(1);
}); 