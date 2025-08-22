import express from 'express';
import { getAllSkills, updateSkills } from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get all skills
router.get('/', getAllSkills);

// Secure route to update all skills
router.put('/', protect, updateSkills);

export default router;