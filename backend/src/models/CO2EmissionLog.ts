import mongoose, { Schema, Document } from 'mongoose';

export interface ICO2EmissionLog extends Document {
    machineId: mongoose.Types.ObjectId;
    co2Emission: number;
    timestamp: Date;
}

const CO2EmissionLogSchema = new Schema<ICO2EmissionLog>({
    machineId: { type: Schema.Types.ObjectId, ref: 'Machine', required: true },
    co2Emission: { type: Number, required: true },
    timestamp: { type: Date, required: true },
});

export default mongoose.model<ICO2EmissionLog>('CO2EmissionLog', CO2EmissionLogSchema); 