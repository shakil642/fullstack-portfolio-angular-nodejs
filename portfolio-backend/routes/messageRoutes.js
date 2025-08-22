import express from 'express';
// 1. Import all the controller functions
import {
    createNewMessage,
    getAllMessages,
    toggleReadStatus,
    deleteMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Route ---
router.post('/', createNewMessage);

// --- Admin Routes (all protected) ---
router.get('/admin', protect, getAllMessages);
router.put('/:id/toggle-read', protect, toggleReadStatus);
router.delete('/:id', protect, deleteMessage);

export default router;