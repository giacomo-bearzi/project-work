import 'dotenv/config';
import mongoose from 'mongoose';
import ProductionLine from '../models/ProductionLine';
import SubLine from '../models/SubLine';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/project-work';

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Recupera le subline per ciascuna linea
    const subLines1 = await SubLine.find({ name: { $in: ['SubLine 1A', 'SubLine 1B', 'SubLine 1C'] } });
    const subLines2 = await SubLine.find({ name: { $in: ['SubLine 2A', 'SubLine 2B', 'SubLine 2C'] } });
    const subLines3 = await SubLine.find({ name: { $in: ['SubLine 3A', 'SubLine 3B', 'SubLine 3C'] } });

    const lines = [
      {
        lineId: 'line-1',
        name: 'Linea 1 - Gommose',
        status: 'active',
        lastUpdated: new Date(),
        subLines: subLines1.map(s => s._id),
      },
      {
        lineId: 'line-2',
        name: 'Linea 2 - Caramelle dure',
        status: 'maintenance',
        lastUpdated: new Date(),
        subLines: subLines2.map(s => s._id),
      },
      {
        lineId: 'line-3',
        name: 'Linea 3 - Cioccolatini',
        status: 'stopped',
        lastUpdated: new Date(),
        subLines: subLines3.map(s => s._id),
      },
    ];

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
