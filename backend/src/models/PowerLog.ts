import mongoose, { Schema, Document } from 'mongoose';

export interface IPowerLog extends Document {
    machineId: mongoose.Types.ObjectId;
    power: number;
    timestamp: Date;
}

const PowerLogSchema = new Schema<IPowerLog>({
    machineId: { type: Schema.Types.ObjectId, ref: 'Machine', required: true },
    power: { type: Number, required: true },
    timestamp: { type: Date, required: true },
});

export default mongoose.model<IPowerLog>('PowerLog', PowerLogSchema); 