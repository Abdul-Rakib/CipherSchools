import express from 'express';
import * as fileController from '../controllers/file.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Protect all routes with authentication
router.use(authenticate);

// File routes - order matters, more specific routes first
router.get('/project/:projectId', fileController.getProjectFiles);
router.post('/', fileController.createFile);
router.get('/:fileId', fileController.getFile);
router.put('/:fileId', fileController.updateFile);
router.delete('/:fileId', fileController.deleteFile);

export default router;
