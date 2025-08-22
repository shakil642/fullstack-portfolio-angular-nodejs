import pool from '../config/db.js';

// Insert a new visit record into the database
export const createVisit = async () => {
  await pool.query('INSERT INTO visits (visited_at) VALUES (NOW())');
};