import { Schema, model } from 'mongoose';

interface Document {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new Schema<Document>({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

documentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const DocumentModel = model<Document>('Document', documentSchema);

export default DocumentModel;