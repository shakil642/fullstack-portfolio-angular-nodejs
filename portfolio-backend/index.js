import express from 'express';
import cors from 'cors';
import https from 'https'; 
import fs from 'fs';      
import pool from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/uploadRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import blogRoutes from './routes/blogRoutes.js'; 
import reviewRoutes from './routes/reviewRoutes.js'; 
import messageRoutes from './routes/messageRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js'; 
import visitRoutes from './routes/visitRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

const app = express();
// Render will provide the PORT in an environment variable. We default to 3000 for local dev.
const PORT = process.env.PORT || 3000;

// This is necessary to correctly resolve file paths in an ES Module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
// This correctly serves your uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/blogs', blogRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', messageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Portfolio API!' });
});

// --- Final, Production-Ready Server Startup Logic ---
const startServer = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database!');
    client.release();

    // Check if we are in a development environment
    if (process.env.NODE_ENV === 'development') {
      // Use the secure HTTPS server only for local development
      const sslOptions = {
        key: fs.readFileSync('localhost-key.pem'),
        cert: fs.readFileSync('localhost.pem')
      };
      https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`Development server running securely on https://localhost:${PORT}`);
      });
    } else {
      // Use a standard HTTP server for production (Render will handle HTTPS)
      app.listen(PORT, () => {
        console.log(`Production server running on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error('Failed to connect to the database. Application shutting down.', err.stack);
    process.exit(1);
  }
};

startServer();