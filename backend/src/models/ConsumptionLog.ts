import mongoose, { Schema, Document } from 'mongoose';

export interface IConsumptionLog extends Document {
    machineId: mongoose.Types.ObjectId;
    energyConsumed: number;
    timestamp: Date;
}

const ConsumptionLogSchema = new Schema<IConsumptionLog>({
    machineId: { type: Schema.Types.ObjectId, ref: 'Machine', required: true },
    energyConsumed: { type: Number, required: true },
    timestamp: { type: Date, required: true },
});

export default mongoose.model<IConsumptionLog>('ConsumptionLog', ConsumptionLogSchema); 