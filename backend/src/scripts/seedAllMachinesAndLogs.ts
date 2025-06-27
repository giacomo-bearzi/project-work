import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import ProductionLine from '../models/ProductionLine';
import SubLine from '../models/SubLine';
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
    await ProductionLine.deleteMany({});
    await SubLine.deleteMany({});
    await Machine.deleteMany({});
    await TemperatureLog.deleteMany({});
    await PowerLog.deleteMany({});
    await CO2EmissionLog.deleteMany({});
    await ConsumptionLog.deleteMany({});
    console.log('Deleted all production lines, sublines, machines and logs');

    // 2. Crea 3 linee di produzione
    const linesData = [
        { lineId: 'line-1', name: 'Linea 1', status: 'active' },
        { lineId: 'line-2', name: 'Linea 2', status: 'maintenance' },
        { lineId: 'line-3', name: 'Linea 3', status: 'stopped' },
    ];
    const productionLines = [];
    for (const line of linesData) {
        // 3 subline per ogni linea
        const subLines = [];
        for (let i = 0; i < 3; i++) {
            // Crea una macchina per ogni subline
            const machine = await Machine.create({
                name: `Macchina ${line.lineId}-${i + 1}`,
                type: 'standard',
                maxTemperature: 100 + Math.floor(Math.random() * 50),
                warnTemperature: 80 + Math.floor(Math.random() * 20),
            });
            // Crea la subline collegata alla macchina
            const subLine = await SubLine.create({
                name: `SubLine ${line.lineId}-${i + 1}`,
                status: 'active',
                machine: machine._id,
            });
            subLines.push(subLine._id);

            // Crea 50 log per ogni tipo per la macchina
            const tempLogs = [], powerLogs = [], co2Logs = [], consumptionLogs = [];
            for (let j = 0; j < 50; j++) {
                const timestamp = randomDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date());
                tempLogs.push({
                    machineId: machine._id,
                    temperature: Math.round((Math.random() * (machine.maxTemperature - 20) + 20) * 10) / 10,
                    timestamp,
                });
                powerLogs.push({
                    machineId: machine._id,
                    power: Math.round((Math.random() * 100 + 50) * 10) / 10,
                    timestamp,
                });
                co2Logs.push({
                    machineId: machine._id,
                    co2Emission: Math.round((Math.random() * 10 + 1) * 100) / 100,
                    timestamp,
                });
                consumptionLogs.push({
                    machineId: machine._id,
                    energyConsumed: Math.round((Math.random() * 100 + 10) * 10) / 10,
                    timestamp,
                });
            }
            await TemperatureLog.insertMany(tempLogs);
            await PowerLog.insertMany(powerLogs);
            await CO2EmissionLog.insertMany(co2Logs);
            await ConsumptionLog.insertMany(consumptionLogs);
        }
        // Crea la linea di produzione collegando le subline
        const prodLine = await ProductionLine.create({
            ...line,
            lastUpdated: new Date(),
            subLines,
        });
        productionLines.push(prodLine);
    }
    console.log('Created 3 production lines, 9 sublines, 9 machines, and all logs.');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

seed().catch(err => {
    console.error('Seeder error:', err);
    process.exit(1);
}); 