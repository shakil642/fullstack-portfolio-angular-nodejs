import express from 'express';
import { search } from '../controllers/searchController.js';

const router = express.Router();

// Public route for searching content
router.get('/', search);

export default router;