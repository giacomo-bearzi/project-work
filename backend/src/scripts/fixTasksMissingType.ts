import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/project-work';

const taskSchema = new mongoose.Schema({
    type: String,
});

const Task = mongoose.model('Task', taskSchema, 'tasks');

async function fixTasksMissingType() {
    await mongoose.connect(uri);
    const res = await Task.updateMany(
        { $or: [{ type: { $exists: false } }, { type: null }] },
        { $set: { type: 'standard' } }
    );
    console.log(`Task aggiornate: ${res.modifiedCount}`);
    await mongoose.disconnect();
}

fixTasksMissingType().catch(err => {
    console.error(err);
    process.exit(1);
}); 