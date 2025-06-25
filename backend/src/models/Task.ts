import mongoose, { Document, Schema } from 'mongoose';

interface ChecklistItem {
    item: string;
    done: boolean;
}

export interface ITask extends Document {
    date: string;
    lineId: string;
    description: string;
    assignedTo: mongoose.Types.ObjectId;
    estimatedMinutes: number;
    status: 'in_attesa' | 'in_corso' | 'completata';
    checklist: ChecklistItem[];
    completedAt?: string;
    type: 'standard' | 'manutenzione';
    maintenanceStart?: string;
    maintenanceEnd?: string;
}

const TaskSchema = new Schema<ITask>({
    date: { type: String, required: true },
    lineId: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    estimatedMinutes: { type: Number, required: true },
    status: {
        type: String,
        enum: ['in_attesa', 'in_corso', 'completata'],
        required: true
    },
    checklist: [{
        item: { type: String, required: true },
        done: { type: Boolean, default: false }
    }],
    completedAt: { type: String, required: false },
    type: {
        type: String,
        enum: ['standard', 'manutenzione'],
        required: true
    },
    maintenanceStart: { type: String, required: false },
    maintenanceEnd: { type: String, required: false },
});

// Indici per query efficienti
TaskSchema.index({ date: 1, lineId: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ status: 1 });

export default mongoose.model<ITask>('Task', TaskSchema); 