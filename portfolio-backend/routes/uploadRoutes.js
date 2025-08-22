import express from 'express';
// 1. Import the new named middleware functions
import { uploadSingle, optimizeImage } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 2. The route now runs a chain of middleware:
//    First 'protect' -> then 'uploadSingle' -> then 'optimizeImage' -> then the final controller
router.post('/', protect, uploadSingle, optimizeImage, (req, res) => {
  // This code now runs AFTER the image has been fully processed and saved.
  if (!req.file) {
    return res.status(400).json({ message: 'Error: No File Selected!' });
  }
  
  // Send back the path to the new, optimized .webp file
  res.status(200).json({
    message: 'File uploaded and optimized successfully',
    filePath: `/uploads/${req.file.filename}`
  });
});

export default router;