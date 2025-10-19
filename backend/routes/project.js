import express from 'express';
import * as projectController from '../controllers/project.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Protect all routes with authentication
router.use(authenticate);

// Project routes
router.post('/', projectController.createProject);
router.get('/user/:userId', projectController.getUserProjects);
router.get('/:projectId', projectController.getProjectById);
router.put('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);

export default router;
