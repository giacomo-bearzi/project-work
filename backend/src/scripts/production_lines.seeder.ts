import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/CandyDB';

const productionLineSchema = new mongoose.Schema({
    lineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'stopped', 'maintenance', 'issue'], required: true },
    lastUpdated: { type: Date, default: Date.now },
}, { collection: 'productionlines' });

const ProductionLine = mongoose.model('ProductionLine', productionLineSchema);

const lines = [
    {
        lineId: 'LINE-1',
        name: 'Linea 1 - Gommose',
        status: 'active',
        lastUpdated: new Date(),
    },
    {
        lineId: 'LINE-2',
        name: 'Linea 2 - Caramelle dure',
        status: 'maintenance',
        lastUpdated: new Date(),
    },
    {
        lineId: 'LINE-3',
        name: 'Linea 3 - Cioccolatini',
        status: 'stopped',
        lastUpdated: new Date(),
    },
];

async function seed() {
    try {
        await mongoose.connect(uri);
        await ProductionLine.deleteMany({});
        await ProductionLine.insertMany(lines);
        console.log('Production lines seeded!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed(); 