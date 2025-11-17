import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All project routes require authentication
router.use(authenticate);

router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
