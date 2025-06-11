import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/CandyDB';

const taskSchema = new mongoose.Schema({
    date: { type: String, required: true },
    lineId: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    estimatedMinutes: { type: Number, required: true },
    status: { type: String, enum: ['in_attesa', 'in_corso', 'completata'], required: true },
    checklist: [{
        item: { type: String, required: true },
        done: { type: Boolean, default: false }
    }]
}, { collection: 'tasks' });

const Task = mongoose.model('Task', taskSchema);

const tasks = [
    {
        date: '2025-06-12',
        lineId: 'LINE-1',
        description: 'Controllo qualità sulle gommose',
        assignedTo: '68405b59b203b5c97f89f496', // Giovanni Zaccarin
        estimatedMinutes: 30,
        status: 'in_attesa',
        checklist: [
            { item: 'Verifica temperatura', done: false },
            { item: 'Controlla confezionamento', done: false }
        ]
    },
    {
        date: '2025-06-12',
        lineId: 'LINE-2',
        description: 'Manutenzione ordinaria',
        assignedTo: '6842aeb4dce96d81caa0b934', // Operatore 1
        estimatedMinutes: 45,
        status: 'in_corso',
        checklist: [
            { item: 'Lubrifica ingranaggi', done: true },
            { item: 'Sostituisci filtro', done: false }
        ]
    },
    {
        date: '2025-06-12',
        lineId: 'LINE-3',
        description: 'Pulizia post-produzione',
        assignedTo: '6842aeb4dce96d81caa0b935', // Operatore 2
        estimatedMinutes: 20,
        status: 'completata',
        checklist: [
            { item: 'Rimuovi residui', done: true },
            { item: 'Sanifica superfici', done: true }
        ]
    }
];

async function seed() {
    try {
        await mongoose.connect(uri);
        await Task.deleteMany({});
        await Task.insertMany(tasks);
        console.log('Tasks seeded!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed(); 