import express from 'express';
import { getStats, getTagStats, getActivity, getTopSkillStat, getApprovalRate, getBusiestMonthStat } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route is secure and can only be accessed by a logged-in admin
router.get('/stats', protect, getStats);
router.get('/tag-stats', protect, getTagStats);
router.get('/recent-activity', protect, getActivity);
router.get('/top-skill', protect, getTopSkillStat);
router.get('/approval-rate', protect, getApprovalRate);
router.get('/busiest-month', protect, getBusiestMonthStat);

export default router;