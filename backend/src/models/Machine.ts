import mongoose, { Schema, Document } from 'mongoose';

export interface IMachine extends Document {
    name: string;
    type: string;
    maxTemperature: number;
}

const MachineSchema = new Schema<IMachine>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    maxTemperature: { type: Number, required: true },
});

export default mongoose.model<IMachine>('Machine', MachineSchema); 