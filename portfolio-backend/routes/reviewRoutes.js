import express from 'express';
import {
    getApprovedReviews,
    createNewReview,
    getReviewsForAdmin,
    approveReview,
    deleteReview,
    getStats
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Routes ---
router.get('/stats', getStats); 
router.get('/', getApprovedReviews);
router.post('/', createNewReview);

// --- Admin Routes ---
router.get('/admin', protect, getReviewsForAdmin);
router.put('/:id/approve', protect, approveReview);
router.delete('/:id', protect, deleteReview);

export default router;