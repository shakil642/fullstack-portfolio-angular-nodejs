import { Pool } from 'pg';
import 'dotenv/config';

let dbConfig;

// Check if we are in production (on Render)
if (process.env.DATABASE_URL) {
  // Use the single connection string provided by Render
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Render's secure connection
    }
  };
} else {
  // Use the individual variables for local development
  dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };
}

const pool = new Pool(dbConfig);

export default pool;