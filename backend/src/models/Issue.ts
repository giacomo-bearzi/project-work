import mongoose from 'mongoose';
import { IUser } from './User'; // Assuming User model is in the same directory

export interface IIssue extends mongoose.Document {
    lineId: string;
    type: 'meccanico' | 'elettrico' | 'qualità' | 'sicurezza';
    priority: 'bassa' | 'media' | 'alta';
    status: 'aperta' | 'in lavorazione' | 'risolta';
    description: string;
    reportedBy: mongoose.Types.ObjectId | IUser; // Reference to User
    assignedTo?: mongoose.Types.ObjectId | IUser; // Optional reference to User
    createdAt?: Date; // Handled by timestamps
    resolvedAt?: Date;
}

const issueSchema = new mongoose.Schema({
    lineId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['meccanico', 'elettrico', 'qualità', 'sicurezza']
    },
    priority: {
        type: String,
        required: true,
        enum: ['bassa', 'media', 'alta']
    },
    status: {
        type: String,
        required: true,
        enum: ['aperta', 'in lavorazione', 'risolta'],
        default: 'aperta'
    },
    description: {
        type: String,
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // AssignedTo is optional
    },
    resolvedAt: {
        type: Date,
        required: false // ResolvedAt is optional
    },
    readBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    hiddenFor: [{ 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'User',
        default: []
    }],
    createdAt: { type: Date, required: true },

}, {
    timestamps: true, // Handles createdAt and updatedAt
    collection: 'Issues' // Explicitly set collection name
});

// Indici per query efficienti
issueSchema.index({ lineId: 1, status: 1 });
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ assignedTo: 1 });

const Issue = mongoose.model<IIssue>('Issue', issueSchema);

export default Issue; 