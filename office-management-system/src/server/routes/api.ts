import express from 'express';
import { authenticateUser } from '../controllers/auth';
import { getUsers, createUser } from '../controllers/users';
import { getDocuments, createDocument } from '../controllers/documents';

const router = express.Router();

// Authentication routes
router.post('/auth/login', authenticateUser);

// User routes
router.get('/users', getUsers);
router.post('/users', createUser);

// Document routes
router.get('/documents', getDocuments);
router.post('/documents', createDocument);

export default router;