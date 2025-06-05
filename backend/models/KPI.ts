import mongoose, { Document, Schema } from 'mongoose';

export interface IKPI extends Document {
    lineId: string;
    timestamp: Date;
    oee: number;
    productivity: number;
    downtimeMinutes: number;
}

const KPISchema = new Schema<IKPI>({
    lineId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    oee: { type: Number, required: true },
    productivity: { type: Number, required: true },
    downtimeMinutes: { type: Number, required: true }
});

// Indice composto per query efficienti
KPISchema.index({ lineId: 1, timestamp: -1 });

export default mongoose.model<IKPI>('KPI', KPISchema); 