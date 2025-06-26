import mongoose, { Schema, Document } from 'mongoose';

export interface ISubLine extends Document {
    name: string;
    status: string;
    machine: mongoose.Types.ObjectId;
}

const SubLineSchema = new Schema<ISubLine>({
    name: { type: String, required: true },
    status: { type: String, required: true },
    machine: { type: Schema.Types.ObjectId, ref: 'Machine', required: true },
});

export default mongoose.model<ISubLine>('SubLine', SubLineSchema); 