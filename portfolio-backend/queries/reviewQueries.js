import pool from '../config/db.js';

// --- Public Queries ---

// Get all reviews that have been approved
export const getAllApprovedReviews = async () => {
  const result = await pool.query(
    'SELECT name, position, company, rating, comment, created_at FROM reviews WHERE is_approved = true ORDER BY created_at DESC'
  );
  return result.rows;
};

// Create a new review with auto-approval logic
export const createReview = async (review) => {
  const { name, position, company, rating, comment } = review;
  // Auto-approve if rating is 3 or more
  const isApproved = rating >= 3; 

  const result = await pool.query(
    'INSERT INTO reviews (name, position, company, rating, comment, is_approved) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, position, company, rating, comment, isApproved]
  );
  return result.rows[0];
};


// --- Admin Queries ---

// Get all reviews (approved and pending) for the admin panel
export const getAllReviewsAdmin = async () => {
    const result = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
    return result.rows;
};

// Manually approve a review
export const approveReviewById = async (id) => {
    const result = await pool.query(
        'UPDATE reviews SET is_approved = true WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

// Delete a review
export const deleteReviewById = async (id) => {
    await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
};

export const getReviewStats = async () => {
  const statsResult = await pool.query(
    `SELECT 
      COUNT(*) AS total_reviews, 
      AVG(rating) AS average_rating 
     FROM reviews 
     WHERE is_approved = true`
  );
  return statsResult.rows[0];
};