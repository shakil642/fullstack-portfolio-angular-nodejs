import express from 'express';
import {
    getPublishedBlogs,
    getSingleBlog,
    getBlogsForAdmin,
    createNewBlog,
    updateExistingBlog,
    deleteExistingBlog
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateBlog } from '../middleware/validationMiddleware.js';

const router = express.Router();

// --- Public Routes ---
router.get('/', getPublishedBlogs);
router.get('/:slug', getSingleBlog);

// --- Admin Routes ---
// This special route for admin uses the 'protect' middleware
router.get('/admin/all', protect, getBlogsForAdmin); 
router.post('/', protect, validateBlog, createNewBlog);
router.put('/:id', protect, validateBlog, updateExistingBlog);
router.delete('/:id', protect, deleteExistingBlog);

export default router;