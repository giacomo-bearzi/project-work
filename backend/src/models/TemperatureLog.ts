import mongoose, { Schema, Document } from 'mongoose';

export interface ITemperatureLog extends Document {
    machineId: mongoose.Types.ObjectId;
    temperature: number;
    timestamp: Date;
}

const TemperatureLogSchema = new Schema<ITemperatureLog>({
    machineId: { type: Schema.Types.ObjectId, ref: 'Machine', required: true },
    temperature: { type: Number, required: true },
    timestamp: { type: Date, required: true },
});

export default mongoose.model<ITemperatureLog>('TemperatureLog', TemperatureLogSchema); 