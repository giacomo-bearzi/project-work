import mongoose, { Document, Schema } from 'mongoose';

export interface IProductionLog extends Document {
    lineId: string;
    candiesProduced: number;
    productionRate: number; // caramelle per ora
    startTime: Date;
    endTime?: Date;
    duration: number; // minuti
    status: 'active' | 'completed';
}

const ProductionLogSchema = new Schema<IProductionLog>({
    lineId: { type: String, required: true },
    candiesProduced: { type: Number, required: true },
    productionRate: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['active', 'completed'], 
        default: 'active' 
    }
});

export default mongoose.model<IProductionLog>('ProductionLog', ProductionLogSchema); 