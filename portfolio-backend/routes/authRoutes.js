import express from 'express';
import { login } from '../controllers/authController.js';
import { forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Define the route: POST request to /api/auth/login
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;