import express from 'express';
import { trackVisit } from '../controllers/visitController.js';

const router = express.Router();

// Public route for tracking a page visit
router.post('/track', trackVisit);

export default router;