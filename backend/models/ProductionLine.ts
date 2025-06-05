import mongoose, { Document, Schema } from 'mongoose';

export interface IProductionLine extends Document {
    lineId: string;
    name: string;
    status: 'active' | 'stopped' | 'maintenance' | 'issue';
    lastUpdated: Date;
}

const ProductionLineSchema = new Schema<IProductionLine>({
    lineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'stopped', 'maintenance', 'issue'],
        required: true
    },
    lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IProductionLine>('ProductionLine', ProductionLineSchema); 