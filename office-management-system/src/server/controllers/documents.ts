import { Request, Response } from 'express';
import Document from '../models/document';

// Get all documents
export const getDocuments = async (req: Request, res: Response) => {
    try {
        const documents = await Document.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving documents' });
    }
};

// Get a single document by ID
export const getDocumentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving document' });
    }
};

// Create a new document
export const createDocument = async (req: Request, res: Response) => {
    const newDocument = new Document(req.body);
    try {
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        res.status(400).json({ message: 'Error creating document' });
    }
};

// Update an existing document
export const updateDocument = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedDocument = await Document.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(400).json({ message: 'Error updating document' });
    }
};

// Delete a document
export const deleteDocument = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedDocument = await Document.findByIdAndDelete(id);
        if (!deletedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting document' });
    }
};