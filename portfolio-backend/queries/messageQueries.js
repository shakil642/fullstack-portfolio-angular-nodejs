import pool from '../config/db.js';

// Insert a new message into the database
export const createMessage = async (message) => {
  const { name, email, message: text } = message; // 'message' is a reserved word, so we rename it to 'text'
  const result = await pool.query(
    'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
    [name, email, text]
  );
  return result.rows[0];
};

// Get all messages for the admin panel
export const getAllMessagesAdmin = async () => {
  const result = await pool.query('SELECT * FROM messages ORDER BY received_at DESC');
  return result.rows;
};

// Toggle the 'is_read' status of a message
export const toggleMessageReadStatus = async (id) => {
  const result = await pool.query(
    'UPDATE messages SET is_read = NOT is_read WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

// Delete a message by its ID
export const deleteMessageById = async (id) => {
  await pool.query('DELETE FROM messages WHERE id = $1', [id]);
};