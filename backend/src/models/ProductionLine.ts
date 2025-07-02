import mongoose, { Document, Schema } from 'mongoose';

export interface IProductionLine extends Document {
    lineId: string;
    name: string;
    status: 'active' | 'stopped' | 'maintenance' | 'issue';
    lastUpdated: Date;
    subLines: mongoose.Types.ObjectId[];
    // Simple tracking fields
    lastStatusChange: Date;
    totalStoppedTimeToday: number; // in minutes
    // Shift-based tracking fields
    totalStoppedTimeCurrentShift: number; // in minutes
    lastShiftReset: Date; // when the shift stopped time was last reset
}

const ProductionLineSchema = new Schema<IProductionLine>({
    lineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'stopped', 'maintenance', 'issue'],
        required: true
    },
    lastUpdated: { type: Date, default: Date.now },
    subLines: [{ type: Schema.Types.ObjectId, ref: 'SubLine' }],
    // Simple tracking fields
    lastStatusChange: { type: Date, default: Date.now },
    totalStoppedTimeToday: { type: Number, default: 0 }, // minutes
    // Shift-based tracking fields
    totalStoppedTimeCurrentShift: { type: Number, default: 0 }, // minutes
    lastShiftReset: { type: Date, default: Date.now }
});

export default mongoose.model<IProductionLine>('ProductionLine', ProductionLineSchema); 