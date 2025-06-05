import mongoose, { Document, Schema } from 'mongoose';

export interface IIssue extends Document {
    lineId: string;
    type: 'meccanico' | 'elettrico' | 'qualità' | 'sicurezza';
    priority: string;
    status: 'aperta' | 'in lavorazione' | 'risolta';
    description: string;
    reportedBy: mongoose.Types.ObjectId;
    assignedTo: mongoose.Types.ObjectId;
    createdAt: Date;
    resolvedAt?: Date;
}

const IssueSchema = new Schema<IIssue>({
    lineId: { type: String, required: true },
    type: {
        type: String,
        enum: ['meccanico', 'elettrico', 'qualità', 'sicurezza'],
        required: true
    },
    priority: { type: String, required: true },
    status: {
        type: String,
        enum: ['aperta', 'in lavorazione', 'risolta'],
        required: true
    },
    description: { type: String, required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date }
});

// Indici per query efficienti
IssueSchema.index({ lineId: 1, status: 1 });
IssueSchema.index({ reportedBy: 1 });
IssueSchema.index({ assignedTo: 1 });

export default mongoose.model<IIssue>('Issue', IssueSchema); 