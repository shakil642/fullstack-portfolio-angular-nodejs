import express from 'express';
import { getAllProjects, createProject, deleteProject, updateProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateProject } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Define the route: GET request to /api/projects/
router.get('/', getAllProjects);

// This route is protected (only an admin with a valid token can create a project)
router.post('/', protect, validateProject, createProject);
router.put('/:id', protect, validateProject, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;